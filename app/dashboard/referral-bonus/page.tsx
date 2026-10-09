"use client";

import { useEffect, useState } from "react";

type Plan = {
  level: number;
  investmentPercentageBps: number;
  profitPercentageBps: number;
};

export default function ReferralBonusPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch("/api/referral-plans", {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load referral rates.");
        }

        setPlans(data.plans);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Request failed.");
      }
    })();
  }, []);

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Referral Bonuses</h1>
        <p className="mt-1 text-sm text-gray-500">
          Your commission rates for qualifying investment and profit events.
        </p>
      </div>

      {error && <p className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {plans.map((plan) => (
          <div key={plan.level} className="rounded-xl border p-5">
            <p className="text-sm text-gray-500">Level {plan.level}</p>
            <p className="mt-2 text-2xl font-bold">
              {plan.investmentPercentageBps / 100}%
            </p>
            <p className="text-sm text-gray-500">Investment commission</p>
            <div className="my-4 border-t" />
            <p className="text-xl font-semibold">
              {plan.profitPercentageBps / 100}%
            </p>
            <p className="text-sm text-gray-500">Profit commission</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-500">
        Commissions are calculated using the rates active when the qualifying
        event is processed. Previous commission records are not recalculated
        when rates change.
      </p>
    </main>
  );
}