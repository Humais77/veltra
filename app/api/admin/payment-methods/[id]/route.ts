import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  { params }: Params
) {
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

    const { id } = await params;

    const body = await request.json();

    const isAvailable =
      Boolean(body.isAvailable);

    const existing =
      await db.orm.public.PaymentMethod
        .where({ id })
        .first();

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment method not found",
        },
        { status: 404 }
      );
    }

    const updated =
      await db.transaction(async (tx) => {
        /*
         * Activating one method automatically
         * disables every other method.
         */
        if (isAvailable) {
          await tx.orm.public.PaymentMethod
            .where({
              isAvailable: true,
            })
            .update({
              isAvailable: false,
            });
        }

        return await tx.orm.public.PaymentMethod
          .where({ id })
          .update({
            isAvailable,
          });
      });

    return NextResponse.json({
      success: true,
      paymentMethod: updated,
    });
  } catch (error) {
    console.error(
      "ADMIN_PAYMENT_METHOD_UPDATE_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update payment method",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: Params
) {
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

    const { id } = await params;

    const existing =
      await db.orm.public.PaymentMethod
        .where({ id })
        .first();

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment method not found",
        },
        { status: 404 }
      );
    }

    await db.orm.public.PaymentMethod
      .where({ id })
      .delete();

    return NextResponse.json({
      success: true,
      message: "Payment method deleted successfully.",
    });
  } catch (error) {
    console.error(
      "ADMIN_PAYMENT_METHOD_DELETE_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete payment method",
      },
      { status: 500 }
    );
  }
}