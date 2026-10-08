import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Sparkles,
  Wallet,
} from "lucide-react";

import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";

export default async function PlansPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  /*
   * Find plans where the user already
   * has an active investment.
   */
  const activeInvestments =
    await db.orm.public.Investment
      .where({
        userId: user.id,
        status: "ACTIVE",
      })
      .all();

  const investedPlanIds = new Set(
    activeInvestments.map(
      (investment) => investment.planId
    )
  );

  /*
   * Get active plans only.
   */
  const activePlans =
    await db.orm.public.Plan
      .where({
        isActive: true,
      })
      .orderBy((plan) =>
        plan.investmentAmount.asc()
      )
      .all();

  /*
   * Remove plans that the user
   * already has an active investment in.
   */
  const plans = activePlans.filter(
    (plan) =>
      !investedPlanIds.has(plan.id)
  );

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-2 text-pink-400">
            <Sparkles size={18} />

            <span className="text-sm font-semibold">
              Investment Plans
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Choose Your Plan
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
            Select an investment plan that fits
            your budget and start growing your
            balance with Veltra.
          </p>
        </div>

        {plans.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#080b1f] p-6 transition hover:-translate-y-1 hover:border-pink-500/30"
              >
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-pink-500/10 blur-3xl" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="rounded-2xl bg-pink-500/10 p-3 text-pink-400">
                      <Wallet size={22} />
                    </div>

                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                      Available
                    </span>
                  </div>

                  <h2 className="mt-6 text-xl font-bold">
                    {plan.name}
                  </h2>

                  <div className="mt-5">
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Investment
                    </p>

                    <p className="mt-1 text-3xl font-black">
                      Rs.{" "}
                      {Number(
                        plan.investmentAmount
                      ).toLocaleString("en-PK")}
                    </p>
                  </div>

                  <div className="my-6 h-px bg-white/10" />

                  <div className="space-y-4">
                    <Feature
                      label="Reward"
                      value={`Rs. ${Number(
                        plan.rewardAmount
                      ).toLocaleString(
                        "en-PK"
                      )}`}
                    />

                    <Feature
                      label="Duration"
                      value={
                        plan.durationDays
                          ? `${plan.durationDays} Days`
                          : "Flexible"
                      }
                    />

                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckCircle2
                        size={17}
                        className="text-emerald-400"
                      />

                      <span>
                        2% direct referral
                        commission
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckCircle2
                        size={17}
                        className="text-emerald-400"
                      />

                      <span>
                        Secure account dashboard
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/deposit?planId=${plan.id}`}
                    className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3.5 text-sm font-bold transition hover:opacity-90"
                  >
                    Invest in This Plan

                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function Feature({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="font-semibold text-white">
        {value}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-12 text-center">
      <Clock3
        className="mx-auto text-gray-500"
        size={35}
      />

      <h2 className="mt-4 text-xl font-bold">
        No plans available
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        You have already invested in all
        currently available plans, or there
        are no active plans right now.
      </p>

      <Link
        href="/dashboard/investments"
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 text-sm font-bold"
      >
        View My Investments
        <ArrowRight size={17} />
      </Link>
    </div>
  );
}