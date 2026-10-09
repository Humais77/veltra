import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";


export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const withdrawals =
      await db.orm.public.Withdrawal
        .where({ userId: user.id })
        .orderBy((withdrawal) =>
          withdrawal.createdAt.desc()
        )
        .all();

    return NextResponse.json({
      success: true,
      withdrawals: serializeBigInts(withdrawals),
    });
  } catch (error) {
    console.error("USER_WITHDRAWALS_GET_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load withdrawal history",
      },
      { status: 500 }
    );
  }
}



export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const amount = BigInt(body.amount);
    const accountName =
      String(body.accountName || "").trim();
    const accountNumber =
      String(body.accountNumber || "").trim();

    if (amount <= 0n) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    if (!accountName || !accountNumber) {
      return NextResponse.json(
        { error: "Account information is required" },
        { status: 400 }
      );
    }

    const withdrawal =
      await db.transaction(async (tx) => {
        const currentUser =
          await tx.orm.public.User.first({
            id: user.id,
          });

        if (!currentUser) {
          throw new Error("USER_NOT_FOUND");
        }

        if (currentUser.balance < amount) {
          throw new Error("INSUFFICIENT_BALANCE");
        }

        const request =
          await tx.orm.public.Withdrawal.create({
            userId: user.id,
            amount,
            method: "EASYPAISA",
            accountName,
            accountNumber,
            status: "PENDING",
          });

        await tx.orm.public.User
          .where({ id: user.id })
          .update({
            balance: currentUser.balance - amount,
          });

        return request;
      });

    return NextResponse.json(
      serializeBigInts(withdrawal),
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INSUFFICIENT_BALANCE") {
        return NextResponse.json(
          { error: "Insufficient balance" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Withdrawal request failed" },
      { status: 500 }
    );
  }
}