import { db } from "@/src/prisma/db";

const plans = [
  {
    name: "Plan 1",
    investmentAmount: 1600n,
    rewardAmount: 80n,
  },
  {
    name: "Plan 2",
    investmentAmount: 2500n,
    rewardAmount: 150n,
  },
  {
    name: "Plan 3",
    investmentAmount: 3500n,
    rewardAmount: 230n,
  },
];

async function main() {
  for (const plan of plans) {
    const existing = await db.orm.public.Plan
      .where({ name: plan.name })
      .first();

    if (!existing) {
      await db.orm.public.Plan.create({
        ...plan,
        durationDays: null,
        isActive: true,
      });
    }
  }

  console.log("Plans created.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });