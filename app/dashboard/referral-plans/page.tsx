"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Percent,
  TrendingUp,
  Users,
  Info,
} from "lucide-react";

import DashboardHeader from "@/src/components/dashboard/DashboardHeader";
import { getCurrentUser } from "@/src/lib/auth";

type ReferralPlan = {
  level: number;
  investmentPercentageBps: number;
  profitPercentageBps: number;
};

export default function UserReferralPlansPage() {
  const [plans, setPlans] = useState<ReferralPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPlans() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/referral-plans", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to load referral rates."
        );
      }

      setPlans(data.plans ?? []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load referral rates."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlans();
  }, []);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-pink-400">
            Referral Program
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Referral Rates
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Earn commission on every investment made by
            people you refer — up to five levels deep.
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-8 rounded-3xl border border-white/10 bg-[#080b1f] p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-pink-500/10 p-2.5 text-pink-400">
              <Info size={18} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-white">
                How it works
              </h2>

              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                When someone in your network makes an
                investment, you earn a percentage of that
                investment based on their level relative to
                you. You also earn a percentage of their
                profits over time. The deeper your network,
                the more levels you earn from.
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center gap-2 rounded-3xl border border-white/10 bg-[#080b1f] p-12 text-sm text-gray-500">
            <Loader2 size={18} className="animate-spin" />
            Loading referral rates...
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-12 text-center text-sm text-gray-500">
            No referral rates are currently available.
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SummaryCard
                icon={<Users size={19} />}
                label="Active Levels"
                value={String(plans.length)}
              />

              <SummaryCard
                icon={<TrendingUp size={19} />}
                label="Top Investment Rate"
                value={`${formatBps(
                  plans[0]?.investmentPercentageBps
                )}%`}
              />

              <SummaryCard
                icon={<Percent size={19} />}
                label="Top Profit Rate"
                value={`${formatBps(
                  plans[0]?.profitPercentageBps
                )}%`}
              />
            </div>

            {/* Plans Table */}
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#080b1f]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase text-gray-500">
                      <th className="px-6 py-4">Level</th>
                      <th className="px-6 py-4">
                        Investment Commission
                      </th>
                      <th className="px-6 py-4">
                        Profit Commission
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {plans.map((plan) => (
                      <tr
                        key={plan.level}
                        className="border-b border-white/5"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/10 text-xs font-bold text-pink-400">
                              {plan.level}
                            </div>

                            <span className="font-semibold">
                              Level {plan.level}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="font-bold text-emerald-400">
                            {formatBps(
                              plan.investmentPercentageBps
                            )}
                            %
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span className="font-bold text-purple-400">
                            {formatBps(
                              plan.profitPercentageBps
                            )}
                            %
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-6 rounded-3xl border border-white/10 bg-[#080b1f] p-5">
              <p className="text-xs leading-relaxed text-gray-500">
                <strong className="text-gray-300">
                  Note:
                </strong>{" "}
                Investment commission is paid when a
                referred member invests. Profit commission
                is paid when their investment generates
                profit. Rates shown are per level from you
                (Level 1 = direct referrals, Level 2 =
                their referrals, and so on).
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-pink-500/10 p-2.5 text-pink-400">
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-500">
          {label}
        </span>
      </div>

      <p className="mt-4 text-xl font-black text-white">
        {value}
      </p>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
| Percentage values are stored in basis points (bps).
| 500 bps = 5.00%
| 425 bps = 4.25%
|--------------------------------------------------------------------------
*/

function formatBps(bps: number | undefined): string {
  if (bps === undefined || bps === null) {
    return "0.00";
  }

  return (bps / 100).toFixed(2);
}