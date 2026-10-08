import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const allUsers =
      await db.orm.public.User
        .select(
          "id",
          "fullName",
          "username",
          "email",
          "referredById",
          "createdAt"
        )
        .all();

    /*
     * Build the user's five-level network.
     */
    const levels: Record<
      number,
      string[]
    > = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    };

    let parentIds = [user.id];

    for (
      let level = 1;
      level <= 5;
      level++
    ) {
      const usersAtLevel =
        allUsers.filter(
          (item) =>
            item.referredById &&
            parentIds.includes(
              item.referredById
            )
        );

      levels[level] =
        usersAtLevel.map(
          (item) => item.id
        );

      parentIds =
        usersAtLevel.map(
          (item) => item.id
        );

      if (parentIds.length === 0) {
        break;
      }
    }

    const networkIds = [
      ...new Set(
        Object.values(levels).flat()
      ),
    ];

    /*
     * Investment totals.
     */
    let networkInvestment = 0n;

    if (networkIds.length > 0) {
      const investments =
        await db.orm.public.Investment
          .where((investment) =>
            investment.userId.in(
              networkIds
            )
          )
          .all();

      for (const investment of investments) {
        networkInvestment +=
          investment.amount;
      }
    }

    /*
     * Commissions.
     */
    const commissions =
      await db.orm.public.Commission
        .where({
          userId: user.id,
        })
        .orderBy((commission) =>
          commission.createdAt.desc()
        )
        .all();

    let totalCommission = 0n;

    const levelBreakdown = {
      1: {
        referrals: levels[1].length,
        earnings: 0n,
      },
      2: {
        referrals: levels[2].length,
        earnings: 0n,
      },
      3: {
        referrals: levels[3].length,
        earnings: 0n,
      },
      4: {
        referrals: levels[4].length,
        earnings: 0n,
      },
      5: {
        referrals: levels[5].length,
        earnings: 0n,
      },
    };

    for (const commission of commissions) {
      totalCommission +=
        commission.amount;

      if (
        commission.level >= 1 &&
        commission.level <= 5
      ) {
        levelBreakdown[
          commission.level as 1 | 2 | 3 | 4 | 5
        ].earnings +=
          commission.amount;
      }
    }

    /*
     * Referral list.
     */
    const referrals = networkIds
      .map((id) => {
        const referral =
          allUsers.find(
            (item) => item.id === id
          );

        if (!referral) return null;

        let level = 0;

        for (let i = 1; i <= 5; i++) {
          if (
            levels[i].includes(id)
          ) {
            level = i;
            break;
          }
        }

        return {
          id: referral.id,
          fullName: referral.fullName,
          username: referral.username,
          email: referral.email,
          level,
          createdAt:
            referral.createdAt,
        };
      })
      .filter(Boolean);

    return NextResponse.json(
  serializeBigInts({
    success: true,

    referralCode: user.referralCode,

    referralLink: `/register?ref=${user.referralCode}`,

    totalReferrals: networkIds.length,

    directReferrals: levels[1].length,

    networkInvestment,

    totalCommission,

    levelBreakdown,

    referrals,

    commissions,
  })
);
  } catch (error) {
    console.error(
      "REFERRALS_GET_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load referral information",
      },
      { status: 500 }
    );
  }
}