import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";

export async function GET() {
  try {
    const paymentMethods =
      await db.orm.public.PaymentMethod
        .where({
          isAvailable: true,
        })
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
      "GET_PAYMENT_METHODS_ERROR",
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