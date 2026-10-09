"use client";

import { useEffect, useState } from "react";

type ReferralPlan = {
  level: number;
  investmentPercentageBps: number;
  profitPercentageBps: number;
  isActive: boolean;
};

const defaults: ReferralPlan[] = [
  { level: 1, investmentPercentageBps: 500, profitPercentageBps: 500, isActive: true },
  { level: 2, investmentPercentageBps: 400, profitPercentageBps: 400, isActive: true },
  { level: 3, investmentPercentageBps: 300, profitPercentageBps: 300, isActive: true },
  { level: 4, investmentPercentageBps: 200, profitPercentageBps: 200, isActive: true },
  { level: 5, investmentPercentageBps: 100, profitPercentageBps: 100, isActive: true },
];

export default function AdminReferralPlansPage() {
  const [plans, setPlans] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch("/api/admin/referral-plans", {
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Could not load plans.");

        setPlans(data.plans);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Request failed.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function updatePlan(
    level: number,
    field: keyof ReferralPlan,
    value: number | boolean
  ) {
    setPlans((current) =>
      current.map((plan) =>
        plan.level === level ? { ...plan, [field]: value } : plan
      )
    );
  }

  async function save() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/referral-plans", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plans }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Could not save plans.");

      setPlans(data.plans);
      setMessage("Referral settings saved successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Request failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Referral Plans</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure commissions for investment deposits and profit payouts.
          Enter percentages such as 5 for 5%, not 500.
        </p>
      </div>

      {message && <p className="rounded-lg bg-gray-100 p-3">{message}</p>}

      {loading ? (
        <p>Loading referral plans…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Level</th>
                <th className="p-3">Investment commission (%)</th>
                <th className="p-3">Profit commission (%)</th>
                <th className="p-3">Active</th>
              </tr>
            </thead>
            <tbody>
              {plans
                .slice()
                .sort((a, b) => a.level - b.level)
                .map((plan) => (
                  <tr key={plan.level} className="border-t">
                    <td className="p-3 font-medium">Level {plan.level}</td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={plan.investmentPercentageBps / 100}
                        onChange={(e) => {
                          const percentage = Number(e.target.value);
                          if (percentage < 0 || percentage > 100) return;

                          updatePlan(
                            plan.level,
                            "investmentPercentageBps",
                            Math.round(percentage * 100)
                          );
                        }}
                        className="w-32 rounded-lg border p-2"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={plan.profitPercentageBps / 100}
                        onChange={(e) => {
                          const percentage = Number(e.target.value);
                          if (percentage < 0 || percentage > 100) return;

                          updatePlan(
                            plan.level,
                            "profitPercentageBps",
                            Math.round(percentage * 100)
                          );
                        }}
                        className="w-32 rounded-lg border p-2"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={plan.isActive}
                        onChange={(e) =>
                          updatePlan(plan.level, "isActive", e.target.checked)
                        }
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={() => void save()}
        disabled={saving || loading}
        className="rounded-lg bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save referral settings"}
      </button>
    </main>
  );
}