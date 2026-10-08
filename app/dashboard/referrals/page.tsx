"use client";

import { useEffect, useState } from "react";
import {
  Copy,
  Gift,
  Network,
  Users,
  Wallet,
} from "lucide-react";

type ReferralData = {
  referralCode: string;
  totalReferrals: number;
  directReferrals: number;
  networkInvestment: string;
  totalCommission: string;
  commissions: {
    id: string;
    sourceUserId: string;
    investmentId: string | null;
    percentageBps: number;
    amount: string;
    createdAt: string;
  }[];
};

export default function ReferralsPage() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/referrals", {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setData(result);
        }
      });
  }, []);

  async function copyReferral() {
    if (!data) return;

    const url = `${window.location.origin}/register?ref=${data.referralCode}`;

    await navigator.clipboard.writeText(url);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  if (!data) {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-7xl py-20 text-center text-sm text-gray-500">
          Loading referral information...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-pink-400">
            Referral Program
          </p>

          <h1 className="mt-2 text-3xl font-black">
            My Referrals
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Invite users and earn 2% direct referral commission.
          </p>
        </div>

        <div className="rounded-3xl border border-pink-500/20 bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-6">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Your Referral Code
          </p>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-2xl border border-white/10 bg-[#050814] px-5 py-4 font-black tracking-widest">
              {data.referralCode}
            </div>

            <button
              onClick={copyReferral}
              className="flex items-center justify-center gap-2 rounded-2xl bg-pink-500 px-5 py-4 text-sm font-bold"
            >
              <Copy size={17} />
              {copied ? "Copied!" : "Copy Referral Link"}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card
            icon={Users}
            label="Direct Referrals"
            value={data.directReferrals.toString()}
          />

          <Card
            icon={Network}
            label="Total Network"
            value={data.totalReferrals.toString()}
          />

          <Card
            icon={Wallet}
            label="Network Investment"
            value={`Rs. ${Number(
              data.networkInvestment
            ).toLocaleString("en-PK")}`}
          />

          <Card
            icon={Gift}
            label="Total Commission"
            value={`Rs. ${Number(
              data.totalCommission
            ).toLocaleString("en-PK")}`}
          />
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-[#080b1f] p-6">
          <h2 className="text-xl font-bold">
            Commission History
          </h2>

          <div className="mt-5 overflow-x-auto">
            {data.commissions.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                No commissions yet.
              </p>
            ) : (
              <table className="w-full min-w-[650px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase text-gray-500">
                    <th className="pb-4">Source</th>
                    <th className="pb-4">Rate</th>
                    <th className="pb-4">Commission</th>
                    <th className="pb-4">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {data.commissions.map((commission) => (
                    <tr
                      key={commission.id}
                      className="border-b border-white/5 text-sm"
                    >
                      <td className="py-4 text-gray-400">
                        {commission.sourceUserId}
                      </td>

                      <td className="py-4">
                        {commission.percentageBps / 100}%
                      </td>

                      <td className="py-4 font-bold text-emerald-400">
                        + Rs.{" "}
                        {Number(
                          commission.amount
                        ).toLocaleString("en-PK")}
                      </td>

                      <td className="py-4 text-gray-500">
                        {new Date(
                          commission.createdAt
                        ).toLocaleDateString("en-PK")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Card({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-gray-500">
          {label}
        </p>

        <div className="rounded-xl bg-pink-500/10 p-2.5 text-pink-400">
          <Icon size={18} />
        </div>
      </div>

      <p className="mt-5 text-2xl font-black">{value}</p>
    </div>
  );
}