"use client";

import { useEffect, useState } from "react";

type ReferralRow = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  referralCode: string;
  referredByName: string | null;
  ownInvestment: string;
  commissionTotal: string;
  createdAt: string;
};

type CommissionRow = {
  id: string;
  userId: string;
  sourceUserId: string;
  investmentId: string | null;
  level: number;
  type: string;
  percentageBps: number;
  amount: string;
  createdAt: string;
};

const money = (paisa: string | number) =>
  `Rs. ${(Number(paisa) / 100).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<ReferralRow[]>([]);
  const [commissions, setCommissions] = useState<CommissionRow[]>([]);
  const [summary, setSummary] = useState({
    totalUsers: 0,
    usersWithReferrer: 0,
    totalCommissionRecords: 0,
    totalCommissionAmount: "0",
  });
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch("/api/admin/referrals", {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Could not load referrals.");

        setReferrals(data.referrals);
        setCommissions(data.commissions);
        setSummary(data.summary);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Request failed.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = referrals.filter((user) => {
    const term = query.toLowerCase();
    return (
      user.fullName.toLowerCase().includes(term) ||
      user.username.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.referralCode.toLowerCase().includes(term)
    );
  });

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Referral Administration</h1>
        <p className="mt-1 text-sm text-gray-500">
          Inspect referral relationships and commission records.
        </p>
      </div>

      {message && <p className="rounded-lg bg-gray-100 p-3">{message}</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total users", summary.totalUsers],
          ["Users with referrer", summary.usersWithReferrer],
          ["Commission records", summary.totalCommissionRecords],
          ["Total commissions", money(summary.totalCommissionAmount)],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Users and referral relationships</h2>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, username, email or referral code"
          className="w-full rounded-lg border p-3"
        />

        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Referral code</th>
                <th className="p-3">Referred by</th>
                <th className="p-3">Investment</th>
                <th className="p-3">Commission earned</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="p-4" colSpan={6}>Loading…</td></tr>
              ) : filtered.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-3">
                    <div className="font-medium">{user.fullName}</div>
                    <div className="text-gray-500">@{user.username}</div>
                  </td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.referralCode}</td>
                  <td className="p-3">{user.referredByName || "—"}</td>
                  <td className="p-3">{money(user.ownInvestment)}</td>
                  <td className="p-3">{money(user.commissionTotal)}</td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td className="p-4" colSpan={6}>No matching users.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Commission history</h2>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Recipient ID</th>
                <th className="p-3">Source user ID</th>
                <th className="p-3">Level</th>
                <th className="p-3">Type</th>
                <th className="p-3">Rate</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">{item.userId}</td>
                  <td className="p-3">{item.sourceUserId}</td>
                  <td className="p-3">{item.level}</td>
                  <td className="p-3">{item.type}</td>
                  <td className="p-3">{item.percentageBps / 100}%</td>
                  <td className="p-3">{money(item.amount)}</td>
                  <td className="p-3">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {!loading && commissions.length === 0 && (
                <tr><td className="p-4" colSpan={7}>No commissions recorded.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}