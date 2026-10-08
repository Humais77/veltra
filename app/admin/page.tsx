import {
  Users,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Gift,
  TrendingUp,
} from "lucide-react";

import { db } from "@/src/prisma/db";

export default async function AdminDashboard() {
  const [
    totalUsers,
    activeUsers,
    pendingDeposits,
    pendingWithdrawals,
    totalDeposits,
    totalWithdrawals,
  ] = await Promise.all([
    // Count all users: .aggregate returns the number directly
    db.orm.public.User.aggregate((agg) => ({ count: agg.count() })),
    
    // Count active users
    db.orm.public.User
      .where({ status: "ACTIVE" })
      .aggregate((agg) => ({ count: agg.count() })),

    // Count pending deposits
    db.orm.public.Deposit
      .where({ status: "PENDING" })
      .aggregate((agg) => ({ count: agg.count() })),

    // Count pending withdrawals
    db.orm.public.Withdrawal
      .where({ status: "PENDING" })
      .aggregate((agg) => ({ count: agg.count() })),

    // Sum approved deposits: returns the sum value directly
    db.orm.public.Deposit
      .where({ status: "APPROVED" })
      .aggregate((agg) => ({ sum: agg.sum("amount") })),

    // Sum approved withdrawals
    db.orm.public.Withdrawal
      .where({ status: "APPROVED" })
      .aggregate((agg) => ({ sum: agg.sum("amount") })),
  ]);

  // The result is a number or bigint, fallback to 0
  const depositsAmount = totalDeposits.sum ?? BigInt(0);
  const withdrawalsAmount = totalWithdrawals.sum ?? BigInt(0);

  return (
    <main className="min-h-screen p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm text-pink-400">Administration</p>
          <h1 className="mt-1 text-3xl font-black">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage users, plans, deposits, withdrawals and platform settings.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminCard title="Total Users" value={totalUsers.count.toString()} icon={Users} />
          <AdminCard title="Active Users" value={activeUsers.count.toString()} icon={TrendingUp} />
          <AdminCard title="Pending Deposits" value={pendingDeposits.count.toString()} icon={ArrowDownToLine} />
          <AdminCard title="Pending Withdrawals" value={pendingWithdrawals.count.toString()} icon={ArrowUpFromLine} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <AdminCard
            title="Approved Deposits"
            value={`Rs. ${Number(depositsAmount).toLocaleString("en-PK")}`}
            icon={Wallet}
          />
          <AdminCard
            title="Approved Withdrawals"
            value={`Rs. ${Number(withdrawalsAmount).toLocaleString("en-PK")}`}
            icon={ArrowUpFromLine}
          />
          <AdminCard title="Platform" value="Active" icon={Gift} />
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
    <div className="rounded-2xl border border-white/10 bg-[#080b1f] p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-gray-500">
          {title}
        </p>

        <div className="rounded-xl bg-pink-500/10 p-3 text-pink-400">
          <Icon size={19} />
        </div>
      </div>

      <p className="mt-5 text-2xl font-black">
        {value}
      </p>
    </div>
  );
}