import { NextResponse } from "next/server";


import { getSession } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = await db.user.findUnique({
    where: {
      id: session.userId,
    },
    select: {
      id: true,
      fullName: true,
      username: true,
      balance: true,
      totalDeposit: true,
      totalWithdrawal: true,
      totalReward: true,
      totalCommission: true,
      referralCode: true,
      referrals: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    user,
    stats: {
      referralCount: user.referrals.length,
    },
  });
}