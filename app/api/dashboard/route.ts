import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const [
      referralCount,
      activeInvestmentCount,
      totalInvestmentCount,
      recentInvestments,
      recentTransactions,
    ] = await Promise.all([
      db.orm.public.User
        .where({
          referredById: user.id,
        })
        .aggregate((agg) => ({
          count: agg.count(),
        })),

      db.orm.public.Investment
        .where({
          userId: user.id,
          status: "ACTIVE",
        })
        .aggregate((agg) => ({
          count: agg.count(),
        })),

      db.orm.public.Investment
        .where({
          userId: user.id,
        })
        .aggregate((agg) => ({
          count: agg.count(),
        })),

      db.orm.public.Investment
        .where({
          userId: user.id,
        })
        .orderBy((investment) =>
          investment.createdAt.desc()
        )
        .limit(10)
        .include("plan")
        .all(),

      db.orm.public.Transaction
        .where({
          userId: user.id,
        })
        .orderBy((transaction) =>
          transaction.createdAt.desc()
        )
        .limit(10)
        .all(),
    ]);

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
        totalDeposit:
          user.totalDeposit.toString(),

        totalWithdrawal:
          user.totalWithdrawal.toString(),

        totalReward:
          user.totalReward.toString(),

        totalCommission:
          user.totalCommission.toString(),

        referralCode: user.referralCode,
      },

      stats: {
        referralCount:
          referralCount.count ?? 0,

        activeInvestmentCount:
          activeInvestmentCount.count ?? 0,

        totalInvestmentCount:
          totalInvestmentCount.count ?? 0,
      },

      investments: recentInvestments.map(
        (investment) => ({
          id: investment.id,

          amount:
            investment.amount.toString(),

          reward:
            investment.reward.toString(),

          status: investment.status,

          startedAt: investment.startedAt,

          completedAt:
            investment.completedAt,

          createdAt:
            investment.createdAt,

          plan: {
            id: investment.plan.id,
            name: investment.plan.name,

            investmentAmount:
              investment.plan.investmentAmount.toString(),

            rewardAmount:
              investment.plan.rewardAmount.toString(),

            durationDays:
              investment.plan.durationDays,

            isActive:
              investment.plan.isActive,
          },
        })
      ),

      transactions: recentTransactions.map(
        (transaction) => ({
          id: transaction.id,
          type: transaction.type,

          amount:
            transaction.amount.toString(),

          note: transaction.note,

          createdAt:
            transaction.createdAt,
        })
      ),
    });
  } catch (error) {
    console.error(
      "DASHBOARD_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load dashboard",
      },
      { status: 500 }
    );
  }
}