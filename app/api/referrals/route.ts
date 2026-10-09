import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "USER") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [users, investments, commissions] = await Promise.all([
      db.orm.public.User.all(),
      db.orm.public.Investment.all(),
      db.orm.public.Commission.all(),
    ]);

    const investedByUser = new Map<string, bigint>();

    for (const investment of investments as any[]) {
      if (
        investment.status !== "ACTIVE" &&
        investment.status !== "COMPLETED"
      ) {
        continue;
      }

      investedByUser.set(
        investment.userId,
        (investedByUser.get(investment.userId) ?? 0n) +
          BigInt(investment.amount)
      );
    }

    const network: any[] = [];
    let frontier = [{ id: currentUser.id, level: 0 }];
    const visited = new Set<string>([currentUser.id]);

    for (let level = 1; level <= 5; level++) {
      const parentIds = new Set(frontier.map((item) => item.id));

      const children = users
        .filter(
          (user: any) =>
            user.referredById &&
            parentIds.has(user.referredById) &&
            !visited.has(user.id)
        )
        .map((user: any) => ({ ...user, level }));

      for (const child of children) {
        visited.add(child.id);

        network.push({
          id: child.id,
          fullName: child.fullName,
          username: child.username,
          referralCode: child.referralCode,
          level,
          investmentAmount: investedByUser.get(child.id) ?? 0n,
          hasInvested: (investedByUser.get(child.id) ?? 0n) > 0n,
          createdAt: child.createdAt,
        });
      }

      frontier = children.map((child: any) => ({
        id: child.id,
        level,
      }));

      if (frontier.length === 0) break;
    }

    const levelBreakdown = Array.from({ length: 5 }, (_, index) => {
      const level = index + 1;
      const members = network.filter((user) => user.level === level);

      return {
        level,
        count: members.length,
        investedMembers: members.filter((user) => user.hasInvested).length,
        investment: members.reduce(
          (sum: bigint, user: any) =>
            sum + BigInt(user.investmentAmount),
          0n
        ),
      };
    });

    const myCommissions = commissions
      .filter((commission: any) => commission.userId === currentUser.id)
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

    const totalCommission = myCommissions.reduce(
      (sum: bigint, commission: any) =>
        sum + BigInt(commission.amount),
      0n
    );

    const totalNetworkInvestment = levelBreakdown.reduce(
      (sum, item) => sum + item.investment,
      0n
    );

    return NextResponse.json(
  serializeBigInts({
    success: true,
    referralCode: currentUser.referralCode,
    referralLink: `/register?ref=${encodeURIComponent(
      currentUser.referralCode
    )}`,
    totalReferrals: network.length,
    directReferrals: levelBreakdown[0].count,
    networkInvestment: totalNetworkInvestment,
    totalCommission,
    levelBreakdown,
    referrals: network,
    commissions: myCommissions,
  })
);
  } catch (error) {
    console.error("USER_REFERRALS_GET", error);
    return NextResponse.json(
      { success: false, error: "Failed to load referrals." },
      { status: 500 }
    );
  }
}