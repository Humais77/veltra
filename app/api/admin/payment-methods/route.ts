import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";

const PAYMENT_TYPES = [
  "SADAPAY",
  "EASYPAISA",
  "JAZZCASH",
  "BANK",
  "CRYPTO",
] as const;

type PaymentMethodType =
  (typeof PAYMENT_TYPES)[number];

export async function GET() {
  try {
    const admin = await getCurrentUser();

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden",
        },
        { status: 403 }
      );
    }

    const paymentMethods =
      await db.orm.public.PaymentMethod
        .orderBy((paymentMethod) =>
          paymentMethod.createdAt.desc()
        )
        .all();

    return NextResponse.json({
      success: true,
      paymentMethods,
    });
  } catch (error) {
    console.error(
      "ADMIN_PAYMENT_METHODS_GET_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load payment methods",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getCurrentUser();

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const name = String(
      body.name || ""
    ).trim();

    const type = String(
      body.type || ""
    ).trim() as PaymentMethodType;

    const accountName =
      body.accountName
        ? String(body.accountName).trim()
        : null;

    const accountNumber =
      body.accountNumber
        ? String(body.accountNumber).trim()
        : null;

    const instructions =
      body.instructions
        ? String(body.instructions).trim()
        : null;

    const isAvailable =
      Boolean(body.isAvailable);

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment method name is required",
        },
        { status: 400 }
      );
    }

    if (!PAYMENT_TYPES.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment method type",
        },
        { status: 400 }
      );
    }

    /*
     * Only one payment method can be active.
     */
    const paymentMethod =
      await db.transaction(async (tx) => {
        if (isAvailable) {
          await tx.orm.public.PaymentMethod
            .where({
              isAvailable: true,
            })
            .update({
              isAvailable: false,
            });
        }

        return await tx.orm.public.PaymentMethod.create({
          name,
          type,
          accountName,
          accountNumber,
          instructions,
          isAvailable,
        });
      });

    return NextResponse.json({
      success: true,
      paymentMethod,
    });
  } catch (error) {
    console.error(
      "ADMIN_PAYMENT_METHOD_CREATE_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create payment method",
      },
      { status: 500 }
    );
  }
}