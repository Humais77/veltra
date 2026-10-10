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
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";

export default async function InvestmentsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const investments = await db.orm.public.Investment.where({
    userId: user.id,
  })
    .orderBy((investment) => investment.createdAt.desc())
    .include("plan")
    .all();

  const runningInvestments = investments.filter(
    (investment) => investment.status === "ACTIVE"
  );

  const completedInvestments = investments.filter(
    (investment) => investment.status === "COMPLETED"
  );

  const totalInvested = investments.reduce(
    (total, investment) => total + Number(investment.amount),
    0
  );

  const totalRewards = investments.reduce(
    (total, investment) => total + Number(investment.reward),
    0
  );

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Updated Header */}
        <div className="mb-8">
          <DashboardHeader
            userName={user.fullName}
            pageTitle="My Investments"
            subtitle="All your active investments in one place."
            isOnline={true}
          />
        </div>

        {/* Summary */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={<TrendingUp size={19} />}
            label="Running Plans"
            value={String(runningInvestments.length)}
          />

          <SummaryCard
            icon={<CircleDollarSign size={19} />}
            label="Total Invested"
            value={`Rs. ${totalInvested.toLocaleString("en-PK")}`}
          />

          <SummaryCard
            icon={<Wallet size={19} />}
            label="Expected Rewards"
            value={`Rs. ${totalRewards.toLocaleString("en-PK")}`}
          />

          <SummaryCard
            icon={<CheckCircle2 size={19} />}
            label="Completed"
            value={String(completedInvestments.length)}
          />
        </div>

        {/* Running Investments */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Running Investments</h2>
              <p className="mt-1 text-sm text-gray-500">
                Your currently active investment plans.
              </p>
            </div>
          </div>

          {runningInvestments.length === 0 ? (
            <EmptyRunning />
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {runningInvestments.map((investment) => (
                <InvestmentCard key={investment.id} investment={investment} />
              ))}
            </div>
          )}
        </section>

        {/* Completed */}
        {completedInvestments.length > 0 && (
          <section className="mt-12">
            <div className="mb-5">
              <h2 className="text-xl font-bold">Completed Investments</h2>
              <p className="mt-1 text-sm text-gray-500">
                Your previously completed investment plans.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {completedInvestments.map((investment) => (
                <InvestmentCard key={investment.id} investment={investment} />
              ))}
            </div>
          </section>
        )}

        {/* Explore Plans */}
        <div className="mt-10 pb-12">
          <Link
            href="/dashboard/plans"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#4020bd] via-[#3520a8] to-[#063d82] hover:to-pink-600 px-6 py-4 text-sm font-bold shadow-[0_4px_15px_rgba(64,32,189,0.3)] transition-all hover:scale-105"
          >
            Explore Available Plans
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ============================================================ */
/* NEW INVESTMENT CARD DESIGN (Matches the provided image)      */
/* ============================================================ */

function InvestmentCard({ investment }: { investment: any }) {
  const isActive = investment.status === "ACTIVE";

  return (
    <div className="relative w-full rounded-3xl border border-white/10 bg-[#080b1f]/80 p-3 shadow-2xl backdrop-blur-xl md:p-5 transition-all hover:border-pink-500/30">
      
      <div className="mb-4 flex items-center justify-between px-2 pt-2 text-[10px] font-bold tracking-widest text-gray-500">
        <div className="flex items-center gap-2">
          <div className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-pink-500 animate-pulse" : "bg-blue-500"}`} />
          <span className="uppercase">
            {investment.plan?.name || "Plan"} · {investment.status}
          </span>
        </div>
        <span>ID: {String(investment.id).slice(0, 8)}</span>
      </div>

      <div className="relative mb-3 overflow-hidden rounded-2xl border border-white/5 bg-[#0c102a] p-5 h-48 flex flex-col justify-between">
        <div className="flex justify-between relative z-10">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Investment
            </p>
            <p className="text-2xl sm:text-3xl font-black text-pink-400 mt-1">
              Rs. {Number(investment.amount).toLocaleString("en-PK")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Reward
            </p>
            <p className="text-lg font-bold text-purple-400 mt-1">
              Rs. {Number(investment.reward).toLocaleString("en-PK")}
            </p>
          </div>
        </div>

        <svg
          className="absolute bottom-0 left-0 w-full h-[60%] preserve-3d"
          viewBox="0 0 400 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={`gradient-${investment.id}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 0 80 Q 100 60 180 70 T 300 20 T 400 30 L 400 100 L 0 100 Z"
            fill={`url(#gradient-${investment.id})`}
          />
          <path
            d="M 0 80 Q 100 60 180 70 T 300 20 T 400 30"
            fill="none"
            stroke={isActive ? "#d8b4fe" : "#4b5563"}
            strokeWidth="2"
          />
          {isActive && (
            <circle
              cx="300"
              cy="20"
              r="4"
              fill="#fbcfe8"
              className="animate-pulse shadow-[0_0_10px_#fbcfe8]"
            />
          )}
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-[#050814]">
        <Info
          icon={<CalendarDays size={14} />}
          label="Started"
          value={formatDate(investment.startedAt)}
        />
        <Info
          icon={<Clock3 size={14} />}
          label="Completed"
          value={investment.completedAt ? formatDate(investment.completedAt) : "Running"}
        />
      </div>

      <div className="mt-4 flex items-center justify-between px-2 pb-1 text-[10px] font-bold tracking-widest text-gray-500">
        <div className="flex items-center gap-2">
          <div className={`h-1 w-1 rounded-full ${isActive ? "bg-purple-500" : "bg-blue-500"}`} />
          <span>{isActive ? "INVERTERS SYNC · YIELDING" : "SETTLED"}</span>
        </div>
      </div>
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col justify-center rounded-lg border border-white/5 bg-[#0c102a]/50 p-3">
      <div className="flex items-center gap-1.5 text-gray-500 mb-1">
        {icon}
        <span className="text-[9px] uppercase tracking-wider font-bold">
          {label}
        </span>
      </div>
      <p className="text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-pink-500/10 p-2.5 text-pink-400">
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-500">{label}</span>
      </div>
      <p className="mt-4 text-xl font-black text-white">{value}</p>
    </div>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
  }).format(date);
}

function EmptyRunning() {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-10 text-center">
      <TrendingUp className="mx-auto text-gray-500" size={38} />
      <h3 className="mt-4 text-lg font-bold text-white">
        No running investments
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        Choose an available plan to start your first investment.
      </p>
      <Link
        href="/dashboard/plans"
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#4020bd] via-[#3520a8] to-[#063d82] px-6 py-3 text-sm font-bold text-white transition-all hover:scale-105"
      >
        View Plans
        <ArrowRight size={17} />
      </Link>
    </div>
  );
}