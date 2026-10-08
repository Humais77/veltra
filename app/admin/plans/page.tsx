
"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Edit3,
  Loader2,
  Plus,
  Power,
  Sparkles,
  Trash2,
} from "lucide-react";

type Plan = {
  id: string;
  name: string;
  investmentAmount: string;
  rewardAmount: string;
  durationDays: number | null;
  isActive: boolean;
};

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [rewardAmount, setRewardAmount] = useState("");
  const [durationDays, setDurationDays] = useState("");

  const [message, setMessage] = useState("");

  async function loadPlans() {
  try {
    setLoading(true);

    const response = await fetch(
      "/api/admin/plans",
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to load plans."
      );
    }

    setPlans(data.plans ?? []);
  } catch (error) {
    console.error("LOAD_ADMIN_PLANS_ERROR", error);

    setPlans([]);

    setMessage(
      error instanceof Error
        ? error.message
        : "Failed to load plans."
    );
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    loadPlans();
  }, []);

  async function createPlan(event: FormEvent) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          investmentAmount,
          rewardAmount,
          durationDays: durationDays || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Unable to create plan.");
        return;
      }

      setMessage("Plan created successfully.");

      setName("");
      setInvestmentAmount("");
      setRewardAmount("");
      setDurationDays("");

      await loadPlans();
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function togglePlan(plan: Plan) {
    const response = await fetch(`/api/admin/plans/${plan.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isActive: !plan.isActive,
      }),
    });

    if (response.ok) {
      await loadPlans();
    }
  }

  async function deletePlan(id: string) {
    const confirmed = window.confirm(
      "Deactivate this investment plan?"
    );

    if (!confirmed) return;

    const response = await fetch(`/api/admin/plans/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      await loadPlans();
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-pink-400">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Investment Plans
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create and manage the plans available to users.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
          <form
            onSubmit={createPlan}
            className="h-fit rounded-3xl border border-white/10 bg-[#080b1f] p-6"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-pink-500/10 p-3 text-pink-400">
                <Plus size={20} />
              </div>

              <h2 className="text-lg font-bold">
                Create Plan
              </h2>
            </div>

            {message && (
              <div className="mt-5 rounded-2xl bg-pink-500/10 p-4 text-sm text-pink-300">
                {message}
              </div>
            )}

            <div className="mt-6 space-y-4">
              <Field
                label="Plan Name"
                value={name}
                onChange={setName}
                placeholder="Starter Plan"
              />

              <Field
                label="Investment Amount"
                value={investmentAmount}
                onChange={setInvestmentAmount}
                placeholder="1600"
                type="number"
              />

              <Field
                label="Reward Amount"
                value={rewardAmount}
                onChange={setRewardAmount}
                placeholder="80"
                type="number"
              />

              <Field
                label="Duration Days"
                value={durationDays}
                onChange={setDurationDays}
                placeholder="30"
                type="number"
                required={false}
              />

              <button
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3.5 text-sm font-bold disabled:opacity-50"
              >
                {saving && (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                )}

                Create Plan
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {loading ? (
              <Loading />
            ) : plans.length === 0 ? (
              <Empty />
            ) : (
              plans.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-3xl border border-white/10 bg-[#080b1f] p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-2xl bg-purple-500/10 p-3 text-purple-400">
                        <Sparkles size={22} />
                      </div>

                      <div>
                        <h2 className="font-bold">
                          {plan.name}
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                          {plan.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => togglePlan(plan)}
                        className="rounded-xl bg-white/5 p-2.5 text-gray-300 hover:bg-white/10"
                        title="Toggle active status"
                      >
                        <Power size={17} />
                      </button>

                      <button
                        className="rounded-xl bg-white/5 p-2.5 text-gray-300 hover:bg-white/10"
                        title="Edit plan"
                      >
                        <Edit3 size={17} />
                      </button>

                      <button
                        onClick={() => deletePlan(plan.id)}
                        className="rounded-xl bg-red-500/10 p-2.5 text-red-400 hover:bg-red-500/20"
                        title="Deactivate plan"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <Stat
                      label="Investment"
                      value={`Rs. ${Number(
                        plan.investmentAmount
                      ).toLocaleString("en-PK")}`}
                    />

                    <Stat
                      label="Reward"
                      value={`Rs. ${Number(
                        plan.rewardAmount
                      ).toLocaleString("en-PK")}`}
                    />

                    <Stat
                      label="Duration"
                      value={
                        plan.durationDays
                          ? `${plan.durationDays} Days`
                          : "Flexible"
                      }
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-gray-300">
        {label}
      </span>

      <input
        required={required}
        type={type}
        min={type === "number" ? "0" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-[#050814] px-4 py-3.5 text-sm outline-none focus:border-pink-500/50"
      />
    </label>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-2 font-bold">{value}</p>
    </div>
  );
}

function Loading() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-12 text-center text-sm text-gray-500">
      Loading plans...
    </div>
  );
}

function Empty() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-12 text-center text-sm text-gray-500">
      No plans created yet.
    </div>
  );
}