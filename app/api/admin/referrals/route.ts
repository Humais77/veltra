import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";

export async function GET() {
  try {
    const admin = await getCurrentUser();

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const [users, investments, commissions] = await Promise.all([
      db.orm.public.User.all(),
      db.orm.public.Investment.all(),
      db.orm.public.Commission.all(),
    ]);

    const qualifyingInvestments = investments.filter(
      (item: any) =>
        item.status === "ACTIVE" || item.status === "COMPLETED"
    );

    const investedByUser = new Map<string, bigint>();

    for (const investment of qualifyingInvestments as any[]) {
      investedByUser.set(
        investment.userId,
        (investedByUser.get(investment.userId) ?? 0n) +
          BigInt(investment.amount)
      );
    }

    const userById = new Map<string, any>(
      users.map((user: any) => [user.id, user])
    );

    const referrals = users.map((user: any) => {
      const userCommissions = commissions.filter(
        (commission: any) => commission.userId === user.id
      );

      const paidCommission = userCommissions.reduce(
        (sum: bigint, commission: any) =>
          sum + BigInt(commission.amount),
        0n
      );

      return {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        referralCode: user.referralCode,
        referredById: user.referredById,
        referredByName: user.referredById
          ? userById.get(user.referredById)?.fullName ?? null
          : null,
        ownInvestment: investedByUser.get(user.id) ?? 0n,
        commissionTotal: paidCommission,
        createdAt: user.createdAt,
      };
    });

    return NextResponse.json(
  serializeBigInts({
    success: true,
    summary: {
      totalUsers: users.length,
      usersWithReferrer: users.filter((u: any) => u.referredById).length,
      totalCommissionRecords: commissions.length,
      totalCommissionAmount: commissions.reduce(
        (sum: bigint, item: any) => sum + BigInt(item.amount),
        0n
      ),
    },
    referrals,
    commissions,
  })
);
  } catch (error) {
    console.error("ADMIN_REFERRALS_GET", error);
    return NextResponse.json(
      { success: false, error: "Failed to load referral administration data." },
      { status: 500 }
    );
  }
}