import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";

export async function GET() {
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
      .orderBy((w) => w.createdAt.desc())
      .all();

  return NextResponse.json(
    serializeBigInts(withdrawals)
  );
}