import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";

export async function GET() {
  try {
    const admin = await getCurrentUser();

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const transactions =
      await db.orm.public.Transaction
        .include("user")
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
      "ADMIN_TRANSACTIONS_GET_ERROR",
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