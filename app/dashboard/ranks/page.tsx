import {
  Crown,
  Gift,
  TrendingUp,
  Users,
} from "lucide-react";

import { db } from "@/src/prisma/db";
import { getCurrentUser } from "@/src/lib/auth";

export default async function RanksPage() {
  const user = await getCurrentUser();

  if (!user) return null;

  const ranks = await db.orm.public.Rank
    .where({ isActive: true })
    .orderBy((rank) => rank.minReferral.asc())
    .all();

  const directReferrals = await db.orm.public.User
    .where({ referredById: user.id })
    .aggregate((agg) => ({
      count: agg.count(),
    }));

  const currentReferrals = directReferrals.count ?? 0;

  const currentRank =
    [...ranks]
      .reverse()
      .find((rank) => currentReferrals >= rank.minReferral) ?? null;

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-pink-400">
            Rewards
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Ranks
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Build your network and unlock higher ranks.
          </p>
        </div>

        <div className="mb-8 rounded-3xl border border-pink-500/20 bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-yellow-400/10 p-4 text-yellow-400">
              <Crown size={28} />
            </div>

            <div>
              <p className="text-xs uppercase text-gray-500">
                Current Rank
              </p>

              <h2 className="mt-1 text-2xl font-black">
                {currentRank?.name || "Starter"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {currentReferrals} direct referrals
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {ranks.map((rank) => {
            const unlocked =
              currentReferrals >= rank.minReferral;

            return (
              <div
                key={rank.id}
                className={`rounded-3xl border p-6 ${
                  unlocked
                    ? "border-yellow-400/20 bg-yellow-400/5"
                    : "border-white/10 bg-[#080b1f]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`rounded-2xl p-3 ${
                      unlocked
                        ? "bg-yellow-400/10 text-yellow-400"
                        : "bg-white/5 text-gray-500"
                    }`}
                  >
                    <Crown size={22} />
                  </div>

                  {unlocked && (
                    <span className="text-xs font-bold text-emerald-400">
                      Unlocked
                    </span>
                  )}
                </div>

                <h2 className="mt-6 text-xl font-black">
                  {rank.name}
                </h2>

                <div className="mt-6 space-y-4">
                  <Requirement
                    icon={Users}
                    label="Minimum Referrals"
                    value={rank.minReferral.toString()}
                  />

                  <Requirement
                    icon={TrendingUp}
                    label="Minimum Volume"
                    value={`Rs. ${Number(
                      rank.minVolume
                    ).toLocaleString("en-PK")}`}
                  />

                  <Requirement
                    icon={Gift}
                    label="Rank Bonus"
                    value={`Rs. ${Number(
                      rank.bonus
                    ).toLocaleString("en-PK")}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function Requirement({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-gray-500">
        <Icon size={16} />
        <span className="text-xs">{label}</span>
      </div>

      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}