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

    const withdrawals =
      await db.orm.public.Withdrawal
        .include("user")
        .orderBy((withdrawal) =>
          withdrawal.createdAt.desc()
        )
        .all();

    return NextResponse.json({
      withdrawals:
        serializeBigInts(withdrawals),
    });
  } catch (error) {
    console.error(
      "ADMIN_WITHDRAWALS_GET_ERROR",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load withdrawals",
      },
      { status: 500 }
    );
  }
}