import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BriefcaseBusiness,
  CreditCard,
  Receipt,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { Suspense } from "react";

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

    db.orm.public.User
      .where({ status: "ACTIVE" })
      .aggregate((agg) => ({
        count: agg.count(),
      })),

    db.orm.public.Deposit
      .where({ status: "PENDING" })
      .aggregate((agg) => ({
        count: agg.count(),
      })),

    db.orm.public.Withdrawal
      .where({ status: "PENDING" })
      .aggregate((agg) => ({
        count: agg.count(),
      })),

    db.orm.public.Deposit
      .where({ status: "APPROVED" })
      .aggregate((agg) => ({
        sum: agg.sum("amount"),
      })),

    db.orm.public.Withdrawal
      .where({ status: "APPROVED" })
      .aggregate((agg) => ({
        sum: agg.sum("amount"),
      })),

    db.orm.public.Investment.aggregate((agg) => ({
      count: agg.count(),
    })),

    db.orm.public.Investment
      .where({ status: "ACTIVE" })
      .aggregate((agg) => ({
        count: agg.count(),
      })),

    db.orm.public.Transaction.aggregate((agg) => ({
      count: agg.count(),
    })),

    db.orm.public.Plan
      .where({ isActive: true })
      .aggregate((agg) => ({
        count: agg.count(),
      })),
  ]);

  const depositAmount = totalDeposits.sum ?? BigInt(0);
  const withdrawalAmount = totalWithdrawals.sum ?? BigInt(0);

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-pink-400">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Monitor and manage the Veltra investment platform.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminCard
            title="Total Users"
            value={totalUsers.count.toString()}
            icon={Users}
          />

          <AdminCard
            title="Active Users"
            value={activeUsers.count.toString()}
            icon={TrendingUp}
          />

          <AdminCard
            title="Pending Deposits"
            value={pendingDeposits.count.toString()}
            icon={ArrowDownToLine}
          />

          <AdminCard
            title="Pending Withdrawals"
            value={pendingWithdrawals.count.toString()}
            icon={ArrowUpFromLine}
          />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminCard
            title="Total Investments"
            value={totalInvestments.count.toString()}
            icon={BriefcaseBusiness}
          />

          <AdminCard
            title="Active Investments"
            value={activeInvestments.count.toString()}
            icon={TrendingUp}
          />

          <AdminCard
            title="Active Plans"
            value={activePlans.count.toString()}
            icon={CreditCard}
          />

          <AdminCard
            title="Transactions"
            value={totalTransactions.count.toString()}
            icon={Receipt}
          />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <MoneyCard
            title="Approved Deposits"
            amount={depositAmount}
            icon={Wallet}
          />

          <MoneyCard
            title="Approved Withdrawals"
            amount={withdrawalAmount}
            icon={ArrowUpFromLine}
          />
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-[#080b1f] p-6">
          <h2 className="text-xl font-bold">
            Quick Management
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <QuickLink href="/admin/users" label="Manage Users" />
            <QuickLink href="/admin/plans" label="Manage Plans" />
            <QuickLink
              href="/admin/investments"
              label="Manage Investments"
            />
            <QuickLink
              href="/admin/deposits"
              label="Review Deposits"
            />
            <QuickLink
              href="/admin/withdrawals"
              label="Review Withdrawals"
            />
            <QuickLink
              href="/admin/transactions"
              label="View Transactions"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function AdminCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-gray-500">
          {title}
        </p>

        <div className="rounded-2xl bg-pink-500/10 p-3 text-pink-400">
          <Icon size={19} />
        </div>
      </div>

      <p className="mt-5 text-2xl font-black">{value}</p>
    </div>
  );
}

function MoneyCard({
  title,
  amount,
  icon: Icon,
}: {
  title: string;
  amount: number | bigint;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-6">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400">
          <Icon size={21} />
        </div>

        <p className="text-sm text-gray-500">{title}</p>
      </div>

      <p className="mt-5 text-2xl font-black">
  Rs. {Number(amount).toLocaleString("en-PK")}
</p>
    </div>
  );
}

function QuickLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 text-sm font-semibold transition hover:border-pink-500/30 hover:bg-pink-500/5"
    >
      {label}
    </a>
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
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-pink-400">Administration</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">Loading…</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-3xl bg-white/5" />
          ))}
        </div>
      </div>
    </main>
  );
}