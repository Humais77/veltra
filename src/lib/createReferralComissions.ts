type CommissionEventType = "INVESTMENT" | "PROFIT";

type CreateReferralCommissionsArgs = {
  tx: any;
  sourceUserId: string;
  amount: bigint;
  investmentId: string;
  type: CommissionEventType;
  // Required for recurring profit payouts, e.g. PROFIT:<investmentId>:<payoutId>.
  eventKey?: string;
};

export async function createReferralCommissions({
  tx,
  sourceUserId,
  amount,
  investmentId,
  type,
  eventKey,
}: CreateReferralCommissionsArgs) {
  if (amount <= 0n) return;

  if (type === "PROFIT" && !eventKey) {
    throw new Error(
      "A unique eventKey is required for each profit commission payout."
    );
  }

  const plans = await tx.orm.public.ReferralPlan.all();
  const activePlans = plans.filter(
    (plan: any) => plan.isActive && plan.level >= 1 && plan.level <= 5
  );

  const sourceUser = await tx.orm.public.User
    .where({ id: sourceUserId })
    .first();

  if (!sourceUser) {
    throw new Error("REFERRAL_SOURCE_USER_NOT_FOUND");
  }

  let ancestorId: string | null = sourceUser.referredById;

  for (let level = 1; level <= 5 && ancestorId; level++) {
    // Guard against malformed referral loops.
    if (ancestorId === sourceUserId) break;

    const ancestor = await tx.orm.public.User
      .where({ id: ancestorId })
      .first();

    if (!ancestor) break;

    const plan = activePlans.find(
      (item: any) => item.level === level
    );

    if (plan) {
      const percentageBps =
        type === "INVESTMENT"
          ? plan.investmentPercentageBps
          : plan.profitPercentageBps;

      if (percentageBps > 0) {
        const commissionAmount =
          (amount * BigInt(percentageBps)) / 10000n;

        const stableEventKey =
          type === "INVESTMENT"
            ? `INVESTMENT:${investmentId}:L${level}:${ancestor.id}`
            : `${eventKey}:L${level}:${ancestor.id}`;

        const existing = await tx.orm.public.Commission
          .where({ eventKey: stableEventKey })
          .first();

        if (!existing && commissionAmount > 0n) {
          await tx.orm.public.Commission.create({
            userId: ancestor.id,
            sourceUserId,
            investmentId,
            level,
            type,
            percentageBps,
            amount: commissionAmount,
            eventKey: stableEventKey,
          });

          await tx.orm.public.User
            .where({ id: ancestor.id })
            .update({
              balance: ancestor.balance + commissionAmount,
              totalCommission:
                ancestor.totalCommission + commissionAmount,
            });

          await tx.orm.public.Transaction.create({
            userId: ancestor.id,
            type: "REFERRAL_COMMISSION",
            amount: commissionAmount,
            note:
              `${type} referral commission — level ${level} ` +
              `(${percentageBps / 100}%)`,
          });
        }
      }
    }

    ancestorId = ancestor.referredById ?? null;
  }
}