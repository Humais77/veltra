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

    const [users, investments, ranks] = await Promise.all([
      db.orm.public.User.all(),
      db.orm.public.Investment.all(),
      db.orm.public.Rank.all(),
    ]);

    const userById = new Map<string, any>(
      users.map((user: any) => [user.id, user])
    );

    const qualifyingInvestments = investments.filter(
      (investment: any) =>
        investment.status === "ACTIVE" ||
        investment.status === "COMPLETED"
    );

    const ownInvestment = qualifyingInvestments
      .filter((investment: any) => investment.userId === currentUser.id)
      .reduce(
        (sum: bigint, investment: any) =>
          sum + BigInt(investment.amount),
        0n
      );

    const investedByUser = new Map<string, bigint>();

    for (const investment of qualifyingInvestments as any[]) {
      investedByUser.set(
        investment.userId,
        (investedByUser.get(investment.userId) ?? 0n) +
          BigInt(investment.amount)
      );
    }

    let networkInvestment = 0n;
    let frontier = [currentUser.id];
    const visited = new Set<string>([currentUser.id]);

    for (let level = 1; level <= 5; level++) {
      const nextFrontier = users
        .filter(
          (user: any) =>
            user.referredById &&
            frontier.includes(user.referredById) &&
            !visited.has(user.id)
        )
        .map((user: any) => user.id);

      for (const id of nextFrontier) {
        visited.add(id);
        networkInvestment += investedByUser.get(id) ?? 0n;
      }

      frontier = nextFrontier;

      if (frontier.length === 0) break;
    }

    const activeRanks = ranks
      .filter((rank: any) => rank.isActive)
      .sort((a: any, b: any) => a.level - b.level);

    const eligible = activeRanks.filter(
      (rank: any) =>
        ownInvestment >= BigInt(rank.minOwnInvestment) &&
        networkInvestment >= BigInt(rank.minReferralInvestment)
    );

    const currentRank = eligible.length
      ? eligible[eligible.length - 1]
      : null;

    const nextRank =
      activeRanks.find(
        (rank: any) =>
          rank.level > (currentRank?.level ?? 0)
      ) ?? null;

    const ownThreshold = nextRank
      ? BigInt(nextRank.minOwnInvestment)
      : 0n;

    const referralThreshold = nextRank
      ? BigInt(nextRank.minReferralInvestment)
      : 0n;

    const progress = (value: bigint, threshold: bigint) => {
      if (threshold <= 0n) return 100;
      const percentage = Number((value * 10000n) / threshold) / 100;
      return Math.max(0, Math.min(100, percentage));
    };

    return NextResponse.json(
  serializeBigInts({
    success: true,
    ownInvestment,
    networkInvestment,
    currentRank,
    nextRank,
    ownProgress: nextRank
      ? progress(ownInvestment, ownThreshold)
      : 100,
    referralProgress: nextRank
      ? progress(networkInvestment, referralThreshold)
      : 100,
    ranks: activeRanks,
  })
);
  } catch (error) {
    console.error("USER_RANKS_GET", error);
    return NextResponse.json(
      { success: false, error: "Failed to calculate ranks." },
      { status: 500 }
    );
  }
}