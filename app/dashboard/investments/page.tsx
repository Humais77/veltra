import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  TrendingUp,
} from "lucide-react";

import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";

export default async function InvestmentsPage() {
  const user = await getCurrentUser();

  if (!user) return null;

  const investments = await db.orm.public.Investment
    .where({ userId: user.id })
    .orderBy((investment) => investment.createdAt.desc())
    .include("plan")
    .all();

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Header />

        {investments.length === 0 ? (
          <EmptyInvestments />
        ) : (
          <div className="space-y-4">
            {investments.map((investment) => (
              <div
                key={investment.id}
                className="rounded-3xl border border-white/10 bg-[#080b1f] p-5 sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-purple-500/10 p-3 text-purple-400">
                      <TrendingUp size={22} />
                    </div>

                    <div>
                      <h2 className="font-bold">
                        {investment.plan.name}
                      </h2>

                      <p className="mt-1 text-xs text-gray-500">
                        ID: {investment.id}
                      </p>
                    </div>
                  </div>

                  <Status status={investment.status} />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Info
                    icon={<CircleDollarSign size={17} />}
                    label="Investment"
                    value={`Rs. ${Number(
                      investment.amount
                    ).toLocaleString("en-PK")}`}
                  />

                  <Info
                    icon={<TrendingUp size={17} />}
                    label="Reward"
                    value={`Rs. ${Number(
                      investment.reward
                    ).toLocaleString("en-PK")}`}
                  />

                  <Info
                    icon={<CalendarDays size={17} />}
                    label="Started"
                    value={formatDate(investment.startedAt)}
                  />

                  <Info
                    icon={<Clock3 size={17} />}
                    label="Completed"
                    value={
                      investment.completedAt
                        ? formatDate(investment.completedAt)
                        : "Pending"
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/dashboard/plans"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 text-sm font-bold"
          >
            Explore Plans
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </main>
  );
}

function Header() {
  return (
    <div className="mb-8">
      <p className="text-sm font-semibold text-pink-400">Portfolio</p>
      <h1 className="mt-2 text-3xl font-black">My Investments</h1>
      <p className="mt-2 text-sm text-gray-500">
        Track all your active and completed investments.
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
        <span className="text-xs">{label}</span>
      </div>

      <p className="mt-2 text-sm font-bold">{value}</p>
    </div>
  );
}

function Status({ status }: { status: string }) {
  const active = status === "ACTIVE";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        active
          ? "bg-emerald-400/10 text-emerald-400"
          : status === "COMPLETED"
          ? "bg-blue-400/10 text-blue-400"
          : "bg-red-400/10 text-red-400"
      }`}
    >
      {status}
    </span>
  );
}

function formatDate(date: Temporal.Instant) {
  // Convert Temporal.Instant -> Date for Intl formatting
  const jsDate = new Date(date.epochMilliseconds);

  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
  }).format(jsDate);
}

function EmptyInvestments() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-12 text-center">
      <TrendingUp className="mx-auto text-gray-500" size={36} />

      <h2 className="mt-4 text-xl font-bold">
        No investments yet
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        Choose an investment plan to get started.
      </p>
    </div>
  );
}