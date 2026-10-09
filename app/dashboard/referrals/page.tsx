"use client";

import { useEffect, useState } from "react";

type Referral = {
  id: string;
  fullName: string;
  username: string;
  referralCode: string;
  level: number;
  investmentAmount: string;
  hasInvested: boolean;
  createdAt: string;
};

type ReferralData = {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  directReferrals: number;
  networkInvestment: string;
  totalCommission: string;
  levelBreakdown: {
    level: number;
    count: number;
    investedMembers: number;
    investment: string;
  }[];
  referrals: Referral[];
};

const money = (value: string | number) =>
  `Rs. ${(Number(value) / 100).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function ReferralsPage() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [filter, setFilter] = useState("ALL");
  const [level, setLevel] = useState("ALL");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch("/api/referrals", { cache: "no-store" });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Could not load referrals.");
        }

        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Request failed.");
      }
    })();
  }, []);

  async function copyLink() {
    if (!data) return;
    const link = `${window.location.origin}${data.referralLink}`;

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      setError("Could not copy the link. Please copy it from your browser.");
    }
  }

  if (error) return <main className="p-6">{error}</main>;
  if (!data) return <main className="p-6">Loading referrals…</main>;

  const filtered = data.referrals.filter((referral) => {
    const matchesInvestment =
      filter === "ALL" ||
      (filter === "INVESTED" && referral.hasInvested) ||
      (filter === "NOT_INVESTED" && !referral.hasInvested);

    const matchesLevel =
      level === "ALL" || referral.level === Number(level);

    return matchesInvestment && matchesLevel;
  });

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">My Referrals</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your five-level referral network.
        </p>
      </div>

      <section className="rounded-xl border p-5">
        <p className="text-sm text-gray-500">Your referral link</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            readOnly
            value={`${typeof window !== "undefined" ? window.location.origin : ""}${data.referralLink}`}
            className="min-w-0 flex-1 rounded-lg border p-3"
          />
          <button
            onClick={() => void copyLink()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total referrals", data.totalReferrals],
          ["Direct referrals", data.directReferrals],
          ["Network investment", money(data.networkInvestment)],
          ["Commissions earned", money(data.totalCommission)],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Level breakdown</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {data.levelBreakdown.map((item) => (
            <div key={item.level} className="rounded-xl border p-4">
              <p className="font-semibold">Level {item.level}</p>
              <p className="mt-2 text-sm">{item.count} members</p>
              <p className="text-sm text-gray-500">
                {item.investedMembers} invested
              </p>
              <p className="mt-2 font-medium">{money(item.investment)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Referral members</h2>
        <div className="flex flex-wrap gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border p-2"
          >
            <option value="ALL">All members</option>
            <option value="INVESTED">Invested</option>
            <option value="NOT_INVESTED">Not invested</option>
          </select>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-lg border p-2"
          >
            <option value="ALL">All levels</option>
            {[1, 2, 3, 4, 5].map((item) => (
              <option key={item} value={item}>
                Level {item}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Member</th>
                <th className="p-3">Level</th>
                <th className="p-3">Investment</th>
                <th className="p-3">Status</th>
                <th className="p-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((referral) => (
                <tr key={referral.id} className="border-t">
                  <td className="p-3">
                    <p className="font-medium">{referral.fullName}</p>
                    <p className="text-gray-500">@{referral.username}</p>
                  </td>
                  <td className="p-3">{referral.level}</td>
                  <td className="p-3">{money(referral.investmentAmount)}</td>
                  <td className="p-3">
                    {referral.hasInvested ? "Invested" : "Not invested"}
                  </td>
                  <td className="p-3">
                    {new Date(referral.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-gray-500">
                    No referrals match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}