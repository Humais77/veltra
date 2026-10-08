import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";

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
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const status = body.status;

    if (status !== "APPROVED" && status !== "REJECTED") {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    // Look up the deposit
    const deposit = await db.orm.public.Deposit
      .where({ id })
      .first();

    if (!deposit) {
      return NextResponse.json(
        { success: false, error: "Deposit not found" },
        { status: 404 }
      );
    }

    if (deposit.status !== "PENDING") {
      return NextResponse.json(
        {
          success: false,
          error: "This deposit has already been processed.",
        },
        { status: 409 }
      );
    }

    // Look up the user
    const user = await db.orm.public.User
      .where({ id: deposit.userId })
      .first();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Deposit user no longer exists.",
        },
        { status: 404 }
      );
    }

    // Update deposit status
    await db.orm.public.Deposit
      .where({ id })
      .update({ status });

    // If approved, update user balance and create a transaction
    if (status === "APPROVED") {
      await db.orm.public.User
        .where({ id: user.id })
        .update({
          balance: user.balance + deposit.amount,
          totalDeposit: user.totalDeposit + deposit.amount,
        });

      await db.orm.public.Transaction.create({
        userId: user.id,
        type: "DEPOSIT",
        amount: deposit.amount,
        note: `EasyPaisa deposit ${deposit.transactionId ?? ""}`.trim(),
      });
    }

    return NextResponse.json({
      success: true,
      message:
        status === "APPROVED"
          ? "Deposit approved successfully."
          : "Deposit rejected successfully.",
    });
  } catch (error) {
    console.error("ADMIN_DEPOSIT_REVIEW_ERROR", error);

    return NextResponse.json(
      { success: false, error: "Failed to process deposit" },
      { status: 500 }
    );
  }
}