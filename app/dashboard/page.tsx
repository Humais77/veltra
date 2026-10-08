import Link from "next/link";
import {
  Wallet,
  ArrowDownToLine,
  Gift,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";

function formatPKR(value: string) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  // Use Promise.all with the correct aggregate syntax
  const [activeInvestmentsResult, referralCountResult] = await Promise.all([
    db.orm.public.Investment
      .where({ userId: user.id, status: "ACTIVE" })
      .aggregate((agg) => ({ count: agg.count() })),

    db.orm.public.User
      .where({ referredById: user.id })
      .aggregate((agg) => ({ count: agg.count() })),
  ]);

  const activeInvestments = activeInvestmentsResult.count ?? 0;
  const referralCount = referralCountResult.count ?? 0;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-sm text-pink-400">Dashboard</p>
        <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
          Welcome, {user.fullName}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Manage your account, plans and activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Available Balance" value={formatPKR(user.balance.toString())} icon={Wallet} />
        <StatCard title="Total Deposit" value={formatPKR(user.totalDeposit.toString())} icon={ArrowDownToLine} />
        <StatCard title="Total Reward" value={formatPKR(user.totalReward.toString())} icon={Gift} />
        <StatCard title="Referral Commission" value={formatPKR(user.totalCommission.toString())} icon={Users} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#080b1f] p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold">Account Overview</h3>
              <p className="mt-1 text-xs text-gray-500">Your current account activity</p>
            </div>
            <TrendingUp className="text-pink-400" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <OverviewItem label="Active Investments" value={activeInvestments.toString()} />
            <OverviewItem label="Direct Referrals" value={referralCount.toString()} />
            <OverviewItem label="Total Withdrawal" value={formatPKR(user.totalWithdrawal.toString())} />
            <OverviewItem label="Referral Commission" value={formatPKR(user.totalCommission.toString())} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#121036] to-[#080b1f] p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Referral Code</p>
          <p className="mt-4 break-all text-2xl font-black text-pink-400">{user.referralCode}</p>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            Invite people using your referral code and earn your configured referral commission.
          </p>
          <Link
            href="/dashboard/referrals"
            className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold transition hover:bg-white/10"
          >
            View Referrals
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <QuickAction href="/dashboard/plans" title="View Plans" description="Choose an available plan" />
        <QuickAction href="/dashboard/deposit" title="Make Deposit" description="Submit a deposit request" />
        <QuickAction href="/dashboard/withdraw" title="Withdraw" description="Request a withdrawal" />
      </div>
    </div>
  );
}

// StatCard, OverviewItem, QuickAction components remain the same...

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#080b1f] p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
          {title}
        </p>

        <div className="rounded-xl bg-pink-500/10 p-2.5 text-pink-400">
          <Icon size={18} />
        </div>
      </div>

      <p className="mt-5 text-2xl font-black">
        {value}
      </p>
    </div>
  );
}

function OverviewItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-bold">
        {value}
      </p>
    </div>
  );
}

function QuickAction({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/10 bg-[#080b1f] p-5 transition hover:border-pink-500/30 hover:bg-[#0b0f29]"
    >
      <h3 className="font-bold group-hover:text-pink-400">
        {title}
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        {description}
      </p>
    </Link>
  );
}