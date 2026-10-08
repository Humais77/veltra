import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CircleDollarSign,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";

export default async function InvestmentsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const investments =
    await db.orm.public.Investment
      .where({
        userId: user.id,
      })
      .orderBy((investment) =>
        investment.createdAt.desc()
      )
      .include("plan")
      .all();

  const runningInvestments =
    investments.filter(
      (investment) =>
        investment.status === "ACTIVE"
    );

  const completedInvestments =
    investments.filter(
      (investment) =>
        investment.status === "COMPLETED"
    );

  const totalInvested =
    investments.reduce(
      (total, investment) =>
        total + Number(investment.amount),
      0
    );

  const totalRewards =
    investments.reduce(
      (total, investment) =>
        total + Number(investment.reward),
      0
    );

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-pink-400">
            Portfolio
          </p>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            My Investments
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Track your active and completed
            investment plans.
          </p>
        </div>

        {/* Summary */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <SummaryCard
            icon={
              <TrendingUp size={19} />
            }
            label="Running Plans"
            value={String(
              runningInvestments.length
            )}
          />

          <SummaryCard
            icon={
              <CircleDollarSign size={19} />
            }
            label="Total Invested"
            value={`Rs. ${totalInvested.toLocaleString(
              "en-PK"
            )}`}
          />

          <SummaryCard
            icon={<Wallet size={19} />}
            label="Expected Rewards"
            value={`Rs. ${totalRewards.toLocaleString(
              "en-PK"
            )}`}
          />

          <SummaryCard
            icon={
              <CheckCircle2 size={19} />
            }
            label="Completed"
            value={String(
              completedInvestments.length
            )}
          />
        </div>

        {/* Running Investments */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Running Investments
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your currently active investment
                plans.
              </p>
            </div>
          </div>

          {runningInvestments.length === 0 ? (
            <EmptyRunning />
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {runningInvestments.map(
                (investment) => (
                  <InvestmentCard
                    key={investment.id}
                    investment={investment}
                  />
                )
              )}
            </div>
          )}
        </section>

        {/* Completed */}
        {completedInvestments.length > 0 && (
          <section className="mt-10">
            <div className="mb-5">
              <h2 className="text-xl font-bold">
                Completed Investments
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your previously completed
                investment plans.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {completedInvestments.map(
                (investment) => (
                  <InvestmentCard
                    key={investment.id}
                    investment={investment}
                  />
                )
              )}
            </div>
          </section>
        )}

        {/* Explore Plans */}
        <div className="mt-10">
          <Link
            href="/dashboard/plans"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3.5 text-sm font-bold transition hover:opacity-90"
          >
            Explore Available Plans
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </main>
  );
}

function InvestmentCard({
  investment,
}: {
  investment: any;
}) {
  const isActive =
    investment.status === "ACTIVE";

  return (
    <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-5 sm:p-6">

      {/* Top */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-purple-500/10 p-3 text-purple-400">
            <TrendingUp size={22} />
          </div>

          <div>
            <h3 className="font-bold">
              {investment.plan?.name ||
                "Investment Plan"}
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              ID: {investment.id}
            </p>
          </div>
        </div>

        <Status
          status={investment.status}
        />
      </div>

      {/* Values */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">

        <Info
          icon={
            <CircleDollarSign size={16} />
          }
          label="Investment"
          value={`Rs. ${Number(
            investment.amount
          ).toLocaleString("en-PK")}`}
        />

        <Info
          icon={
            <TrendingUp size={16} />
          }
          label="Reward"
          value={`Rs. ${Number(
            investment.reward
          ).toLocaleString("en-PK")}`}
        />

        <Info
          icon={
            <CalendarDays size={16} />
          }
          label="Started"
          value={formatDate(
            investment.startedAt
          )}
        />

        <Info
          icon={
            <Clock3 size={16} />
          }
          label="Completed"
          value={
            investment.completedAt
              ? formatDate(
                  investment.completedAt
                )
              : "Running"
          }
        />
      </div>

      {/* Status message */}
      <div
        className={`mt-5 rounded-2xl border p-4 text-sm ${
          isActive
            ? "border-emerald-400/10 bg-emerald-400/5 text-emerald-400"
            : "border-blue-400/10 bg-blue-400/5 text-blue-400"
        }`}
      >
        <div className="flex items-center gap-2">
          {isActive ? (
            <TrendingUp size={16} />
          ) : (
            <CheckCircle2 size={16} />
          )}

          <span>
            {isActive
              ? "This investment is currently running."
              : "This investment has been completed."}
          </span>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-pink-500/10 p-2.5 text-pink-400">
          {icon}
        </div>

        <span className="text-sm text-gray-500">
          {label}
        </span>
      </div>

      <p className="mt-4 text-xl font-black">
        {value}
      </p>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 text-gray-500">
        {icon}

        <span className="text-xs">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-bold">
        {value}
      </p>
    </div>
  );
}

function Status({
  status,
}: {
  status: string;
}) {
  const styles: Record<
    string,
    string
  > = {
    ACTIVE:
      "bg-emerald-400/10 text-emerald-400",
    COMPLETED:
      "bg-blue-400/10 text-blue-400",
    CANCELLED:
      "bg-red-400/10 text-red-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] ||
        "bg-white/10 text-gray-400"
      }`}
    >
      {status}
    </span>
  );
}

function formatDate(
  date: Temporal.Instant
) {
  const jsDate = new Date(
    date.epochMilliseconds
  );

  return new Intl.DateTimeFormat(
    "en-PK",
    {
      dateStyle: "medium",
    }
  ).format(jsDate);
}

function EmptyRunning() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-10 text-center">
      <TrendingUp
        className="mx-auto text-gray-500"
        size={38}
      />

      <h3 className="mt-4 text-lg font-bold">
        No running investments
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        Choose an available plan to start
        your first investment.
      </p>

      <Link
        href="/dashboard/plans"
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 text-sm font-bold"
      >
        View Plans
        <ArrowRight size={17} />
      </Link>
    </div>
  );
}