import { db } from "@/src/prisma/db";

const ranks = [
  {
    level: 1,
    name: "Starter",
    minOwnInvestment: 0n,
    minReferralInvestment: 7000n,
    bonus: 1050n,
  },
  {
    level: 2,
    name: "Premium",
    minOwnInvestment: 0n,
    minReferralInvestment: 14000n,
    bonus: 2240n,
  },
  {
    level: 3,
    name: "Gold",
    minOwnInvestment: 0n,
    minReferralInvestment: 42000n,
    bonus: 7140n,
  },
  {
    level: 4,
    name: "Platinum",
    minOwnInvestment: 0n,
    minReferralInvestment: 70000n,
    bonus: 12600n,
  },
  {
    level: 5,
    name: "Diamond",
    minOwnInvestment: 0n,
    minReferralInvestment: 210000n,
    bonus: 39900n,
  },
  {
    level: 6,
    name: "Elite",
    minOwnInvestment: 0n,
    minReferralInvestment: 700000n,
    bonus: 140000n,
  },
  {
    level: 7,
    name: "Master",
    minOwnInvestment: 0n,
    minReferralInvestment: 2100000n,
    bonus: 441000n,
  },
  {
    level: 8,
    name: "Grand Master",
    minOwnInvestment: 0n,
    minReferralInvestment: 11200000n,
    bonus: 2800000n,
  },
  {
    level: 9,
    name: "King",
    minOwnInvestment: 0n,
    minReferralInvestment: 35000000n,
    bonus: 12250000n,
  },
  {
    level: 10,
    name: "Titan",
    minOwnInvestment: 0n,
    minReferralInvestment: 140000000n,
    bonus: 70000000n,
  },
];

export async function seedRanks() {
  for (const rank of ranks) {
    const existing =
      await db.orm.public.Rank.first({
        level: rank.level,
      });

    if (existing) {
      await db.orm.public.Rank
        .where({
          id: existing.id,
        })
        .update({
          name: rank.name,
          minOwnInvestment:
            rank.minOwnInvestment,
          minReferralInvestment:
            rank.minReferralInvestment,
          bonus: rank.bonus,
          isActive: true,
        });
    } else {
      await db.orm.public.Rank.create(
        rank
      );
    }
  }
}