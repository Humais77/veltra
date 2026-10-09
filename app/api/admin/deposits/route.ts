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

    const deposits = await db.orm.public.Deposit
      .include("user")
      .orderBy((deposit) => deposit.createdAt.desc())
      .all();

    return NextResponse.json({
      success: true,
      deposits: serializeBigInts(deposits),
    });
  } catch (error) {
    console.error("ADMIN_DEPOSITS_GET_ERROR", error);

    return NextResponse.json(
      { success: false, error: "Failed to load deposits" },
      { status: 500 }
    );
  }
}