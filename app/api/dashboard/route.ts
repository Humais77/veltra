import { NextResponse } from "next/server";
import { getSession } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.orm.public.User
      .where({ id: session.userId })
      .include("referrals")
      .include("investments", (investments) =>
        investments
          .where({ status: "ACTIVE" })
          .orderBy((i) => i.createdAt.desc())
          .limit(10)
          .include("plan")
      )
      .include("transactions", (transactions) =>
        transactions
          .orderBy((t) => t.createdAt.desc())
          .limit(10)
      )
      .first();

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json({ success: false, error: "Account is not active" }, { status: 403 });
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
        balance: user.balance.toString(),
        totalDeposit: user.totalDeposit.toString(),
        totalWithdrawal: user.totalWithdrawal.toString(),
        totalReward: user.totalReward.toString(),
        totalCommission: user.totalCommission.toString(),
        referralCode: user.referralCode,
      },
      stats: {
        referralCount: user.referrals.length,
        activeInvestmentCount: user.investments.length,
      },
      investments: user.investments.map((investment) => ({
        id: investment.id,
        amount: investment.amount.toString(),
        reward: investment.reward.toString(),
        status: investment.status,
        startedAt: investment.startedAt,
        plan: {
          id: investment.plan.id,
          name: investment.plan.name,
          investmentAmount: investment.plan.investmentAmount.toString(),
          rewardAmount: investment.plan.rewardAmount.toString(),
          durationDays: investment.plan.durationDays,
        },
      })),
      transactions: user.transactions.map((transaction) => ({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount.toString(),
        note: transaction.note,
        createdAt: transaction.createdAt,
      })),
    });
  } catch (error) {
    console.error("DASHBOARD_ERROR:", error);
    return NextResponse.json({ success: false, error: "Unable to load dashboard" }, { status: 500 });
  }
}