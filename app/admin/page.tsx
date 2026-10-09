
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BriefcaseBusiness,
  CreditCard,
  Receipt,
  TrendingUp,
  Users,
  Wallet,
  ArrowRight,
  Activity,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";

async function AdminDashboardContent() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  const [
    totalUsers,
    activeUsers,
    pendingDeposits,
    pendingWithdrawals,
    totalDeposits,
    totalWithdrawals,
    totalInvestments,
    activeInvestments,
    totalTransactions,
    activePlans,
  ] = await Promise.all([
    db.orm.public.User.aggregate((agg) => ({
      count: agg.count(),
    })),

    db.orm.public.User.where({ status: "ACTIVE" }).aggregate((agg) => ({
      count: agg.count(),
    })),

    db.orm.public.Deposit.where({ status: "PENDING" }).aggregate((agg) => ({
      count: agg.count(),
    })),

    db.orm.public.Withdrawal.where({ status: "PENDING" }).aggregate((agg) => ({
      count: agg.count(),
    })),

    db.orm.public.Deposit.where({ status: "APPROVED" }).aggregate((agg) => ({
      sum: agg.sum("amount"),
    })),

    db.orm.public.Withdrawal.where({ status: "APPROVED" }).aggregate((agg) => ({
      sum: agg.sum("amount"),
    })),

    db.orm.public.Investment.aggregate((agg) => ({
      count: agg.count(),
    })),

    db.orm.public.Investment.where({ status: "ACTIVE" }).aggregate((agg) => ({
      count: agg.count(),
    })),

    db.orm.public.Transaction.aggregate((agg) => ({
      count: agg.count(),
    })),

    db.orm.public.Plan.where({ isActive: true }).aggregate((agg) => ({
      count: agg.count(),
    })),
  ]);

  const depositAmount = totalDeposits.sum ?? BigInt(0);
  const withdrawalAmount = totalWithdrawals.sum ?? BigInt(0);

  const stats = [
    {
      title: "Total Users",
      value: totalUsers.count,
      icon: Users,
      color: "pink",
      description: "Registered accounts",
      href: "/admin/users",
    },
    {
      title: "Active Users",
      value: activeUsers.count,
      icon: TrendingUp,
      color: "emerald",
      description: "Currently active",
      href: "/admin/users",
    },
    {
      title: "Pending Deposits",
      value: pendingDeposits.count,
      icon: ArrowDownToLine,
      color: "amber",
      description: "Awaiting review",
      href: "/admin/deposits",
    },
    {
      title: "Pending Withdrawals",
      value: pendingWithdrawals.count,
      icon: ArrowUpFromLine,
      color: "violet",
      description: "Awaiting review",
      href: "/admin/withdrawals",
    },
    {
      title: "Total Investments",
      value: totalInvestments.count,
      icon: BriefcaseBusiness,
      color: "blue",
      description: "All investment records",
      href: "/admin/investments",
    },
    {
      title: "Active Investments",
      value: activeInvestments.count,
      icon: Activity,
      color: "emerald",
      description: "Currently running",
      href: "/admin/investments",
    },
    {
      title: "Active Plans",
      value: activePlans.count,
      icon: CreditCard,
      color: "pink",
      description: "Available plans",
      href: "/admin/plans",
    },
    {
      title: "Transactions",
      value: totalTransactions.count,
      icon: Receipt,
      color: "blue",
      description: "All recorded transactions",
      href: "/admin/transactions",
    },
  ] as const;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Subtle ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-violet-600/[0.07] blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-96 h-64 w-64 rounded-full bg-pink-500/[0.04] blur-[100px]"
      />

      <div className="relative mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 xl:px-10">
        {/* Page heading */}
        <header className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-pink-300">
                Administration
              </p>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Dashboard Overview
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
              Monitor platform activity, manage investments, and review
              transactions from one place.
            </p>
          </div>

          <div className="flex w-fit shrink-0 items-center gap-3 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
              <ShieldCheck size={19} />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">
                Admin workspace
              </p>
              <p className="mt-1 text-[11px] text-emerald-300">
                Authorized access
              </p>
            </div>
          </div>
        </header>

        {/* Statistics */}
        <section aria-label="Platform statistics">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-white sm:text-base">
              Platform Statistics
            </h2>
            <span className="text-[11px] text-gray-500">
              Current totals
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            {stats.map((stat) => (
              <AdminCard key={stat.title} {...stat} />
            ))}
          </div>
        </section>

        {/* Financial summaries */}
        <section className="mt-8 sm:mt-10" aria-label="Financial summaries">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-white sm:text-base">
              Financial Overview
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Total amounts from approved transactions
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <MoneyCard
              title="Approved Deposits"
              amount={depositAmount}
              icon={Wallet}
              tone="emerald"
              description="Total approved deposit amount"
            />

            <MoneyCard
              title="Approved Withdrawals"
              amount={withdrawalAmount}
              icon={ArrowUpFromLine}
              tone="violet"
              description="Total approved withdrawal amount"
            />
          </div>
        </section>

        {/* Quick actions */}
        <section className="mt-8 rounded-3xl border border-white/[0.07] bg-[#0a0d20]/90 p-4 shadow-xl shadow-black/10 sm:mt-10 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500/10 text-pink-300">
                  <Sparkles size={18} />
                </div>
                <h2 className="text-base font-bold text-white sm:text-lg">
                  Quick Management
                </h2>
              </div>
              <p className="mt-2 text-xs leading-5 text-gray-500 sm:ml-11">
                Jump directly to the sections you manage most.
              </p>
            </div>

            <span className="hidden text-xs text-gray-500 sm:block">
              6 shortcuts
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3">
            <QuickLink
              href="/admin/users"
              label="Manage Users"
              icon={Users}
            />
            <QuickLink
              href="/admin/plans"
              label="Manage Plans"
              icon={CreditCard}
            />
            <QuickLink
              href="/admin/investments"
              label="Manage Investments"
              icon={BriefcaseBusiness}
            />
            <QuickLink
              href="/admin/deposits"
              label="Review Deposits"
              icon={ArrowDownToLine}
            />
            <QuickLink
              href="/admin/withdrawals"
              label="Review Withdrawals"
              icon={ArrowUpFromLine}
            />
            <QuickLink
              href="/admin/transactions"
              label="View Transactions"
              icon={Receipt}
            />
          </div>
        </section>

        <footer className="pb-2 pt-8 text-center text-[11px] text-gray-600">
          Veltra Administration
        </footer>
      </div>
    </div>
  );
}

type CardTone = "pink" | "emerald" | "amber" | "violet" | "blue";

const cardTones: Record<
  CardTone,
  { icon: string; glow: string; hover: string }
> = {
  pink: {
    icon: "bg-pink-400/10 text-pink-300",
    glow: "bg-pink-500/[0.07]",
    hover: "group-hover:border-pink-400/20",
  },
  emerald: {
    icon: "bg-emerald-400/10 text-emerald-300",
    glow: "bg-emerald-500/[0.06]",
    hover: "group-hover:border-emerald-400/20",
  },
  amber: {
    icon: "bg-amber-400/10 text-amber-300",
    glow: "bg-amber-500/[0.06]",
    hover: "group-hover:border-amber-400/20",
  },
  violet: {
    icon: "bg-violet-400/10 text-violet-300",
    glow: "bg-violet-500/[0.07]",
    hover: "group-hover:border-violet-400/20",
  },
  blue: {
    icon: "bg-sky-400/10 text-sky-300",
    glow: "bg-sky-500/[0.06]",
    hover: "group-hover:border-sky-400/20",
  },
};

function AdminCard({
  title,
  value,
  icon: Icon,
  color,
  description,
  href,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: CardTone;
  description: string;
  href: string;
}) {
  const tone = cardTones[color];

  return (
    <Link
      href={href}
      className={`group relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0d20] p-4 transition duration-200 hover:-translate-y-0.5 hover:bg-[#0d1025] sm:rounded-3xl sm:p-5 ${tone.hover}`}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl ${tone.glow}`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <p className="min-w-0 pt-1 text-[10px] font-bold uppercase leading-5 tracking-[0.12em] text-gray-500 sm:text-[11px]">
          {title}
        </p>

        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone.icon}`}>
          <Icon size={19} strokeWidth={1.9} />
        </div>
      </div>

      <p className="relative mt-5 break-words text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        {value.toLocaleString("en-PK")}
      </p>

      <div className="relative mt-3 flex items-center justify-between gap-2">
        <p className="min-w-0 text-[11px] leading-5 text-gray-500">
          {description}
        </p>
        <ArrowRight
          size={15}
          className="shrink-0 text-gray-600 transition group-hover:translate-x-1 group-hover:text-gray-300"
        />
      </div>
    </Link>
  );
}

function MoneyCard({
  title,
  amount,
  icon: Icon,
  tone,
  description,
}: {
  title: string;
  amount: number | bigint;
  icon: React.ElementType;
  tone: "emerald" | "violet";
  description: string;
}) {
  const styles =
    tone === "emerald"
      ? {
          icon: "bg-emerald-400/10 text-emerald-300",
          border: "hover:border-emerald-400/20",
          glow: "bg-emerald-500/[0.07]",
        }
      : {
          icon: "bg-violet-400/10 text-violet-300",
          border: "hover:border-violet-400/20",
          glow: "bg-violet-500/[0.07]",
        };

  const formattedAmount = Number(amount).toLocaleString("en-PK");

  return (
    <div className={`relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0d20] p-5 transition sm:rounded-3xl sm:p-6 ${styles.border}`}>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full blur-3xl ${styles.glow}`}
      />

      <div className="relative flex items-center gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${styles.icon}`}>
          <Icon size={21} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
          <p className="mt-1 text-[11px] leading-5 text-gray-500">
            {description}
          </p>
        </div>
      </div>

      <p className="relative mt-6 break-words text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
        <span className="mr-1 text-sm font-semibold text-gray-500 sm:text-base">
          Rs.
        </span>
        {formattedAmount}
      </p>
    </div>
  );
}

function QuickLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-[64px] min-w-0 items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3.5 transition duration-200 hover:border-pink-400/20 hover:bg-pink-500/[0.045] sm:p-4"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.035] text-gray-400 transition group-hover:border-pink-400/10 group-hover:bg-pink-400/10 group-hover:text-pink-300">
        <Icon size={19} />
      </div>

      <span className="min-w-0 flex-1 text-xs font-semibold leading-5 text-gray-300 group-hover:text-white sm:text-sm">
        {label}
      </span>

      <ArrowRight
        size={16}
        className="shrink-0 text-gray-600 transition group-hover:translate-x-0.5 group-hover:text-pink-300"
      />
    </Link>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<AdminDashboardLoading />}>
      <AdminDashboardContent />
    </Suspense>
  );
}

function AdminDashboardLoading() {
  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 xl:px-10">
      <div className="mx-auto max-w-[1600px] animate-pulse">
        <div className="mb-8">
          <div className="h-3 w-28 rounded bg-white/10" />
          <div className="mt-4 h-9 w-64 max-w-full rounded-lg bg-white/10" />
          <div className="mt-3 h-4 w-80 max-w-full rounded bg-white/[0.06]" />
        </div>

        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="h-40 rounded-2xl border border-white/[0.04] bg-white/[0.035] sm:rounded-3xl"
            />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-36 rounded-3xl bg-white/[0.035]" />
          <div className="h-36 rounded-3xl bg-white/[0.035]" />
        </div>
      </div>
    </div>
  );
}
