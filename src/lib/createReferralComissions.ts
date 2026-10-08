import { getReferralRate } from "@/src/lib/referrals";

type TransactionType = "INVESTMENT" | "PROFIT";

type ReferralUser = {
  id: string;
  referredById: string | null;
  status: string;
  balance: bigint;
  totalCommission: bigint;
};

export async function createReferralCommissions({
  tx,
  sourceUserId,
  amount,
  investmentId,
  type,
}: {
  tx: any;
  sourceUserId: string;
  amount: bigint;
  investmentId?: string;
  type: TransactionType;
}) {
  if (amount <= 0n) {
    return;
  }

  let currentUserId: string | null = sourceUserId;

  for (let level = 1; level <= 5; level++) {
    if (!currentUserId) {
      break;
    }

    /*
     * Get the current user in the referral chain.
     *
     * L1:
     * source user -> direct sponsor
     *
     * L2:
     * sponsor -> sponsor's sponsor
     *
     * etc.
     */
    const sourceUser: ReferralUser | null =
      (await tx.orm.public.User.first({
        id: currentUserId,
      })) as ReferralUser | null;

    if (!sourceUser) {
      break;
    }

    /*
     * Find this user's sponsor.
     */
    const referrerId: string | null =
      sourceUser.referredById;

    if (!referrerId) {
      break;
    }

    const referrer: ReferralUser | null =
      (await tx.orm.public.User.first({
        id: referrerId,
      })) as ReferralUser | null;

    if (!referrer) {
      break;
    }

    /*
     * Only active users receive referral commissions.
     */
    if (referrer.status !== "ACTIVE") {
      currentUserId = referrer.id;
      continue;
    }

    /*
     * Get the commission rate for this level.
     *
     * Investment:
     * L1 = 5%
     * L2 = 4%
     * L3 = 3%
     * L4 = 2%
     * L5 = 1%
     *
     * Profit:
     * L1 = 5%
     * L2 = 4%
     * L3 = 3%
     * L4 = 2%
     * L5 = 1%
     */
    const percentageBps: number = getReferralRate(
      level,
      type
    );

    if (percentageBps > 0) {
      const commission: bigint =
        (amount * BigInt(percentageBps)) / 10000n;

      if (commission > 0n) {
        await tx.orm.public.Commission.create({
          userId: referrer.id,
          sourceUserId,
          investmentId: investmentId ?? null,
          level,
          type,
          percentageBps,
          amount: commission,
        });

        await tx.orm.public.User
          .where({
            id: referrer.id,
          })
          .update({
            balance: referrer.balance + commission,
            totalCommission:
              referrer.totalCommission + commission,
          });

        await tx.orm.public.Transaction.create({
          userId: referrer.id,
          type: "REFERRAL_COMMISSION",
          amount: commission,
          note:
            `${type === "INVESTMENT" ? "Investment" : "Profit"} referral commission L${level} from ${sourceUserId}`,
        });
      }
    }

    /*
     * Move one level upward.
     */
    currentUserId = referrer.id;
  }
}