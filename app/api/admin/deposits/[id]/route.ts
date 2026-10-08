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
      const deposit =
        await tx.orm.public.Deposit.first({ id });

      if (!deposit) {
        throw new Error("NOT_FOUND");
      }

      if (deposit.status !== "PENDING") {
        throw new Error("ALREADY_PROCESSED");
      }

      const updated =
        await tx.orm.public.Deposit
          .where({ id })
          .update({
            status,
          });

      if (status === "APPROVED") {
        const user =
          await tx.orm.public.User.first({
            id: deposit.userId,
          });

        if (!user) {
          throw new Error("USER_NOT_FOUND");
        }

        await tx.orm.public.User
          .where({ id: user.id })
          .update({
            balance: user.balance + deposit.amount,
            totalDeposit:
              user.totalDeposit + deposit.amount,
          });

        await tx.orm.public.Transaction.create({
          userId: user.id,
          type: "DEPOSIT",
          amount: deposit.amount,
          note: `EasyPaisa deposit ${deposit.transactionId ?? ""}`,
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
          { error: "Deposit not found" },
          { status: 404 }
        );
      }

      if (error.message === "ALREADY_PROCESSED") {
        return NextResponse.json(
          { error: "Deposit already processed" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to process deposit" },
      { status: 500 }
    );
  }
}