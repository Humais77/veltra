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
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const result = await db.transaction(async (tx) => {
      const withdrawal =
        await tx.orm.public.Withdrawal.first({ id });

      if (!withdrawal) {
        throw new Error("NOT_FOUND");
      }

      if (withdrawal.status !== "PENDING") {
        throw new Error("ALREADY_PROCESSED");
      }

      const updated =
        await tx.orm.public.Withdrawal
          .where({ id })
          .update({
            status,
          });

      const user =
        await tx.orm.public.User.first({
          id: withdrawal.userId,
        });

      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      if (status === "REJECTED") {
        // Return reserved amount
        await tx.orm.public.User
          .where({ id: user.id })
          .update({
            balance: user.balance + withdrawal.amount,
          });
      }

      if (status === "APPROVED") {
        await tx.orm.public.User
          .where({ id: user.id })
          .update({
            totalWithdrawal:
              user.totalWithdrawal +
              withdrawal.amount,
          });

        await tx.orm.public.Transaction.create({
          userId: user.id,
          type: "WITHDRAWAL",
          amount: withdrawal.amount,
          note: `EasyPaisa withdrawal`,
        });
      }

      return updated;
    });

    return NextResponse.json(
      serializeBigInts(result)
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "NOT_FOUND") {
        return NextResponse.json(
          { error: "Withdrawal not found" },
          { status: 404 }
        );
      }

      if (error.message === "ALREADY_PROCESSED") {
        return NextResponse.json(
          { error: "Withdrawal already processed" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to process withdrawal" },
      { status: 500 }
    );
  }
}