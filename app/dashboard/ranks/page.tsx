"use client";

import { useEffect, useState } from "react";

type Rank = {
  id: string;
  level: number;
  name: string;
  minOwnInvestment: string;
  minReferralInvestment: string;
  bonus: string;
  isActive: boolean;
};

type RankData = {
  ownInvestment: string;
  networkInvestment: string;
  currentRank: Rank | null;
  nextRank: Rank | null;
  ownProgress: number;
  referralProgress: number;
  ranks: Rank[];
};

const money = (value: string | number) =>
  `Rs. ${(Number(value) / 100).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function Progress({
  label,
  current,
  target,
  percentage,
}: {
  label: string;
  current: string;
  target: string;
  percentage: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between gap-3 text-sm">
        <span>{label}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-green-600"
          style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
        />
      </div>
      <p className="text-xs text-gray-500">
        {money(current)} of {money(target)}
      </p>
    </div>
  );
}

export default function RanksPage() {
  const [data, setData] = useState<RankData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch("/api/ranks", { cache: "no-store" });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to load ranks.");
        }

        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Request failed.");
      }
    })();
  }, []);

  if (error) return <main className="p-6">{error}</main>;
  if (!data) return <main className="p-6">Loading your rank progress…</main>;

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">My Ranks</h1>
        <p className="mt-1 text-sm text-gray-500">
          Both your personal investment and your referral network must meet
          the next rank's requirements.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border p-5">
          <p className="text-sm text-gray-500">Own investment</p>
          <p className="mt-2 text-2xl font-bold">{money(data.ownInvestment)}</p>
        </div>
        <div className="rounded-xl border p-5">
          <p className="text-sm text-gray-500">Network investment</p>
          <p className="mt-2 text-2xl font-bold">
            {money(data.networkInvestment)}
          </p>
        </div>
      </div>

      <section className="rounded-xl border p-5">
        <p className="text-sm text-gray-500">Current rank</p>
        <h2 className="mt-1 text-xl font-semibold">
          {data.currentRank?.name ?? "No rank yet"}
        </h2>
        {data.currentRank && (
          <p className="mt-1 text-sm text-gray-500">
            Rank level {data.currentRank.level}
          </p>
        )}
      </section>

      {data.nextRank ? (
        <section className="space-y-5 rounded-xl border p-5">
          <div>
            <p className="text-sm text-gray-500">Next rank</p>
            <h2 className="text-xl font-semibold">{data.nextRank.name}</h2>
          </div>

          <Progress
            label="Own investment requirement"
            current={data.ownInvestment}
            target={data.nextRank.minOwnInvestment}
            percentage={data.ownProgress}
          />

          <Progress
            label="Referral network requirement"
            current={data.networkInvestment}
            target={data.nextRank.minReferralInvestment}
            percentage={data.referralProgress}
          />

          <p className="text-sm text-gray-500">
            Rank bonus: {money(data.nextRank.bonus)}
          </p>
        </section>
      ) : (
        <p className="rounded-xl border p-5">
          You have qualified for every currently active rank.
        </p>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Rank ladder</h2>
        {data.ranks.map((rank) => {
          const eligible =
            BigInt(data.ownInvestment) >= BigInt(rank.minOwnInvestment) &&
            BigInt(data.networkInvestment) >=
              BigInt(rank.minReferralInvestment);

          return (
            <div key={rank.id} className="rounded-xl border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">
                    {rank.level}. {rank.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Own: {money(rank.minOwnInvestment)} · Network:{" "}
                    {money(rank.minReferralInvestment)}
                  </p>
                </div>
                <span
                  className={
                    eligible
                      ? "rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
                      : "rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                  }
                >
                  {eligible ? "Qualified" : "In progress"}
                </span>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}