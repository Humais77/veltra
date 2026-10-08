import { NextResponse } from "next/server";

import { getCurrentUser } from "@/src/lib/auth";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      referralCode: user.referralCode,
      balance: user.balance.toString(),
      totalDeposit: user.totalDeposit.toString(),
      totalWithdrawal: user.totalWithdrawal.toString(),
      totalReward: user.totalReward.toString(),
      totalCommission: user.totalCommission.toString(),
      createdAt: user.createdAt,
    },
  });
}