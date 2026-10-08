import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const transactions =
      await db.orm.public.Transaction
        .where({
          userId: user.id,
        })
        .orderBy((transaction) =>
          transaction.createdAt.desc()
        )
        .all();

    return NextResponse.json({
      transactions:
        serializeBigInts(transactions),
    });
  } catch (error) {
    console.error(
      "GET_TRANSACTIONS_ERROR",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load transactions",
      },
      { status: 500 }
    );
  }
}