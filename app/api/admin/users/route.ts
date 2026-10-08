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

  const users = await db.orm.public.User
    .select(
      "id",
      "fullName",
      "username",
      "email",
      "phone",
      "role",
      "status",
      "balance",
      "totalDeposit",
      "totalWithdrawal",
      "totalReward",
      "totalCommission",
      "referralCode",
      "referredById",
      "createdAt"
    )
    .orderBy((u) => u.createdAt.desc())
    .all();

  return NextResponse.json(
    serializeBigInts(users)
  );
}