import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Sparkles,
  Wallet,
  Zap,
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
  const activeInvestments = await db.orm.public.Investment.where({
    userId: user.id,
    status: "ACTIVE",
  }).all();

  const investedPlanIds = new Set(
    activeInvestments.map((investment) => investment.planId)
  );

  /*
   * Get active plans only.
   */
  const activePlans = await db.orm.public.Plan.where({
    isActive: true,
  })
    .orderBy((plan) => plan.investmentAmount.asc())
    .all();

  /*
   * Remove plans that the user
   * already has an active investment in.
   */
  const plans = activePlans.filter((plan) => !investedPlanIds.has(plan.id));

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-2 text-pink-400">
            <Sparkles size={18} />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Investment Plans
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Choose Your Plan
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">
            Select an investment plan that fits your budget and start growing your balance with SunZee1.
          </p>
        </div>

        {plans.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/5 bg-[#080b1f] p-5 shadow-2xl transition-all hover:-translate-y-1 hover:border-pink-500/30 hover:bg-[#0c102a]"
              >
                {/* Subtle top-left glow */}
                <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-pink-500/10 blur-[40px] transition-opacity group-hover:opacity-100 opacity-50" />

                <div>
                  {/* Top Header */}
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-white">
                        {plan.name}
                      </h3>
                      <p className="mt-1 text-[10px] font-bold tracking-widest text-pink-400 uppercase">
                        Available
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-pink-500/20 bg-[#4020bd]/20 text-pink-400 shadow-[inset_0_0_15px_rgba(236,72,153,0.1)]">
                      <Zap size={18} />
                    </div>
                  </div>

                  {/* Financial Metrics Box */}
                  <div className="mb-6 rounded-2xl border border-white/5 bg-[#050814] p-4">
                    <div className="mb-4">
                      <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                        Investment
                      </p>
                      <p className="mt-1 text-2xl font-black text-white">
                        Rs. {Number(plan.investmentAmount).toLocaleString("en-PK")}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <div>
                        <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                          Reward
                        </p>
                        <p className="mt-1 text-lg font-bold text-pink-400">
                          Rs. {Number(plan.rewardAmount).toLocaleString("en-PK")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                          Duration
                        </p>
                        <p className="mt-1 text-sm font-bold text-gray-300">
                          {plan.durationDays ? `${plan.durationDays} Days` : "Flexible"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="mb-8 space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#4020bd]" />
                      <span className="text-sm font-medium text-gray-400 leading-snug">
                        2% direct referral commission
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#4020bd]" />
                      <span className="text-sm font-medium text-gray-400 leading-snug">
                        Secure account dashboard
                      </span>
                    </div>
                  </div>
                </div>

                {/* Call to Action Button */}
                <Link
                  href={`/dashboard/deposit?planId=${plan.id}`}
                  className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4020bd] via-[#3520a8] to-[#063d82] px-5 py-4 text-sm font-bold text-white shadow-[0_4px_15px_rgba(64,32,189,0.3)] transition-all hover:to-pink-600 hover:scale-[1.02]"
                >
                  Select Plan
                  <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                </Link>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-12 text-center shadow-xl">
      <Clock3 className="mx-auto text-gray-500" size={40} />
      
      <h2 className="mt-5 text-2xl font-black text-white">
        No plans available
      </h2>
      
      <p className="mt-3 text-base text-gray-400 max-w-md mx-auto">
        You have already invested in all currently available plans, or there are no active plans right now.
      </p>

      <Link
        href="/dashboard/investments"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4020bd] via-[#3520a8] to-[#063d82] hover:to-pink-600 px-6 py-3.5 text-sm font-bold text-white shadow-[0_4px_15px_rgba(64,32,189,0.3)] transition-all hover:scale-105"
      >
        View My Investments
        <ArrowRight size={17} />
      </Link>
    </div>
  );
}