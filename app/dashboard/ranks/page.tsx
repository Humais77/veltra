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

  const ranks =
    await db.orm.public.Rank
      .where({
        isActive: true,
      })
      .orderBy((rank) =>
        rank.level.asc()
      )
      .all();

  /*
   * Own investment.
   */
  const ownInvestments =
    await db.orm.public.Investment
      .where({
        userId: user.id,
      })
      .all();

  const ownInvestment =
    ownInvestments.reduce(
      (total, investment) =>
        total + investment.amount,
      0n
    );

  /*
   * Build five-level network.
   */
  const allUsers =
    await db.orm.public.User
      .select(
        "id",
        "referredById"
      )
      .all();

  let parentIds = [user.id];
  const networkIds: string[] = [];

  for (
    let level = 1;
    level <= 5;
    level++
  ) {
    const children =
      allUsers.filter(
        (item) =>
          item.referredById &&
          parentIds.includes(
            item.referredById
          )
      );

    const ids = children.map(
      (item) => item.id
    );

    networkIds.push(...ids);
    parentIds = ids;

    if (parentIds.length === 0) {
      break;
    }
  }

  /*
   * Referral investment volume.
   */
  let referralInvestment = 0n;

  if (networkIds.length > 0) {
    const investments =
      await db.orm.public.Investment
        .where((investment) =>
          investment.userId.in(
            networkIds
          )
        )
        .all();

    referralInvestment =
      investments.reduce(
        (total, investment) =>
          total + investment.amount,
        0n
      );
  }

  /*
   * Current rank.
   */
  const currentRank =
    [...ranks]
      .reverse()
      .find(
        (rank) =>
          referralInvestment >=
          rank.minReferralInvestment
      ) ?? null;

  const nextRank =
    ranks.find(
      (rank) =>
        referralInvestment <
        rank.minReferralInvestment
    ) ?? null;

  const referralProgress =
    nextRank &&
    nextRank.minReferralInvestment > 0n
      ? Math.min(
          100,
          Number(
            (referralInvestment *
              100n) /
              nextRank.minReferralInvestment
          )
        )
      : 100;

  const ownProgress =
    nextRank &&
    nextRank.minOwnInvestment > 0n
      ? Math.min(
          100,
          Number(
            (ownInvestment *
              100n) /
              nextRank.minOwnInvestment
          )
        )
      : 100;

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-pink-400">
            Rewards
          </p>

          <h1 className="mt-2 text-3xl font-black">
            My Ranks
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Earn rewards as you level up in
            Veltra.
          </p>
        </div>

        <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Online
        </div>

        {/* Current Rank */}
        <div className="rounded-3xl border border-pink-500/20 bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-yellow-400/10 p-4 text-yellow-400">
                <Crown size={28} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Current rank
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  {currentRank?.name ||
                    "No Rank"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Level{" "}
                  {currentRank?.level ||
                    0}
                </p>

                {nextRank && (
                  <p className="mt-2 text-sm text-gray-400">
                    Next milestone:{" "}
                    <span className="font-bold text-white">
                      {nextRank.name}
                    </span>{" "}
                    · reward Rs.{" "}
                    {Number(
                      nextRank.bonus
                    ).toLocaleString(
                      "en-PK"
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        {nextRank && (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <ProgressCard
              title="Own investment"
              percentage={
                ownProgress
              }
              current={ownInvestment}
              target={
                nextRank.minOwnInvestment
              }
            />

            <ProgressCard
              title="Referral investment"
              percentage={
                referralProgress
              }
              current={
                referralInvestment
              }
              target={
                nextRank.minReferralInvestment
              }
            />
          </div>
        )}

        {/* Ladder */}
        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-xl font-bold">
              Rank ladder
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Build your network investment
              to unlock higher rewards.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {ranks.map((rank) => {
              const unlocked =
                referralInvestment >=
                rank.minReferralInvestment;

              const isCurrent =
                currentRank?.id ===
                rank.id;

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

                    {isCurrent && (
                      <span className="rounded-full bg-pink-500/10 px-3 py-1 text-xs font-bold text-pink-400">
                        Current
                      </span>
                    )}

                    {!isCurrent &&
                      unlocked && (
                        <span className="text-xs font-bold text-emerald-400">
                          Unlocked
                        </span>
                      )}
                  </div>

                  <p className="mt-5 text-xs uppercase text-gray-500">
                    Level {rank.level}
                  </p>

                  <h3 className="mt-1 text-xl font-black">
                    {rank.name}
                  </h3>

                  <div className="mt-6 space-y-4">
                    <Requirement
                      icon={TrendingUp}
                      label="Referral invest"
                      value={`Rs. ${Number(
                        rank.minReferralInvestment
                      ).toLocaleString(
                        "en-PK"
                      )}`}
                    />

                    <Requirement
                      icon={Users}
                      label="Own investment"
                      value={`Rs. ${Number(
                        rank.minOwnInvestment
                      ).toLocaleString(
                        "en-PK"
                      )}`}
                    />

                    <Requirement
                      icon={Gift}
                      label="Reward"
                      value={`Rs. ${Number(
                        rank.bonus
                      ).toLocaleString(
                        "en-PK"
                      )}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

function ProgressCard({
  title,
  percentage,
  current,
  target,
}: {
  title: string;
  percentage: number;
  current: bigint;
  target: bigint;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-6">
      <div className="flex items-center justify-between">
        <p className="font-bold">
          {title}
        </p>

        <p className="text-sm font-bold text-pink-400">
          {percentage.toFixed(1)}%
        </p>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-600"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-gray-500">
          Rs.{" "}
          {Number(
            current
          ).toLocaleString("en-PK")}
        </span>

        <span className="font-bold">
          Rs.{" "}
          {Number(
            target
          ).toLocaleString("en-PK")}
        </span>
      </div>
    </div>
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

        <span className="text-xs">
          {label}
        </span>
      </div>

      <span className="text-sm font-bold">
        {value}
      </span>
    </div>
  );
}