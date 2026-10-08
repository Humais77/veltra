import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const allUsers =
    await db.orm.public.User
      .select("id", "referredById")
      .all();

  const networkIds = new Set<string>([user.id]);

  let changed = true;

  while (changed) {
    changed = false;

    for (const item of allUsers) {
      if (
        item.referredById &&
        networkIds.has(item.referredById) &&
        !networkIds.has(item.id)
      ) {
        networkIds.add(item.id);
        changed = true;
      }
    }
  }

  networkIds.delete(user.id);

  const directReferrals =
    allUsers.filter(
      (item) => item.referredById === user.id
    );

  const networkUserIds =
    Array.from(networkIds);

  let networkInvestment = 0n;

  if (networkUserIds.length > 0) {
    const investments =
      await db.orm.public.Investment
        .where((investment) =>
          investment.userId.in(networkUserIds)
        )
        .all();

    for (const investment of investments) {
      networkInvestment += investment.amount;
    }
  }

  const commissions =
    await db.orm.public.Commission
      .where({
        userId: user.id,
      })
      .orderBy((c) => c.createdAt.desc())
      .all();

  let totalCommission = 0n;

  for (const commission of commissions) {
    totalCommission += commission.amount;
  }

  return NextResponse.json(
    serializeBigInts({
      referralCode: user.referralCode,
      totalReferrals: networkIds.size,
      directReferrals: directReferrals.length,
      networkInvestment,
      totalCommission,
      commissions,
    })
  );
}