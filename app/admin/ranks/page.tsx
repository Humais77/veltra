"use client";

import { useEffect, useState } from "react";
import {
  Crown,
  Gift,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";

type Rank = {
  id: string;
  name: string;
  minReferral: number;
  minVolume: string;
  bonus: string;
  isActive: boolean;
};

export default function AdminRanksPage() {
  const [ranks, setRanks] = useState<Rank[]>([]);

  useEffect(() => {
    // Connect this to your ranks API when implemented.
  }, []);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-pink-400">
              Rewards Management
            </p>

            <h1 className="mt-2 text-3xl font-black">
              Ranks
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Configure referral and volume-based ranks.
            </p>
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 text-sm font-bold">
            <Plus size={17} />
            Add Rank
          </button>
        </div>

        {ranks.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-12 text-center">
            <Crown
              className="mx-auto text-gray-500"
              size={36}
            />

            <h2 className="mt-4 font-bold">
              No ranks configured
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Rank management API can be connected here.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {ranks.map((rank) => (
              <div
                key={rank.id}
                className="rounded-3xl border border-white/10 bg-[#080b1f] p-6"
              >
                <div className="rounded-2xl bg-yellow-400/10 p-3 text-yellow-400 w-fit">
                  <Crown size={22} />
                </div>

                <h2 className="mt-5 text-xl font-bold">
                  {rank.name}
                </h2>

                <div className="mt-5 space-y-4">
                  <Stat
                    icon={Users}
                    label="Minimum Referrals"
                    value={rank.minReferral.toString()}
                  />

                  <Stat
                    icon={TrendingUp}
                    label="Minimum Volume"
                    value={`Rs. ${Number(
                      rank.minVolume
                    ).toLocaleString("en-PK")}`}
                  />

                  <Stat
                    icon={Gift}
                    label="Bonus"
                    value={`Rs. ${Number(
                      rank.bonus
                    ).toLocaleString("en-PK")}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function Stat({
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