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

    const deposits = await db.orm.public.Deposit
      .where({
        userId: user.id,
      })
      .orderBy((deposit) => deposit.createdAt.desc())
      .all();

    return NextResponse.json({
      success: true,
      deposits: serializeBigInts(deposits),
    });
  } catch (error) {
    console.error(
      "GET_DEPOSIT_HISTORY_ERROR",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load deposit history",
      },
      { status: 500 }
    );
  }
}