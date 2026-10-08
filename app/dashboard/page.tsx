import Link from "next/link";

import {
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Gift,
  Users,
  TrendingUp,
  ArrowRight,
  BriefcaseBusiness,
  Receipt,
} from "lucide-react";

import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";

function formatPKR(value: bigint | number) {
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

  const [
    referralCountResult,
    activeInvestmentCountResult,
    totalInvestmentCountResult,
    recentInvestments,
    recentTransactions,
  ] = await Promise.all([
    // Direct referrals
    db.orm.public.User
      .where({
        referredById: user.id,
      })
      .aggregate((agg) => ({
        count: agg.count(),
      })),

    // Active investments
    db.orm.public.Investment
      .where({
        userId: user.id,
        status: "ACTIVE",
      })
      .aggregate((agg) => ({
        count: agg.count(),
      })),

    // All investments
    db.orm.public.Investment
      .where({
        userId: user.id,
      })
      .aggregate((agg) => ({
        count: agg.count(),
      })),

    // Recent investments
    db.orm.public.Investment
      .where({
        userId: user.id,
      })
      .orderBy((investment) =>
        investment.createdAt.desc()
      )
      .limit(5)
      .include("plan")
      .all(),

    // Recent transactions
    db.orm.public.Transaction
      .where({
        userId: user.id,
      })
      .orderBy((transaction) =>
        transaction.createdAt.desc()
      )
      .limit(5)
      .all(),
  ]);

  const referralCount =
    referralCountResult.count ?? 0;

  const activeInvestments =
    activeInvestmentCountResult.count ?? 0;

  const totalInvestments =
    totalInvestmentCountResult.count ?? 0;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-pink-400">
          Dashboard
        </p>

        <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
          Welcome, {user.fullName}
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Manage your investments, balance and account
          activity.
        </p>
      </div>

      {/* Main statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Available Balance"
          value={formatPKR(user.balance)}
          icon={Wallet}
        />

        <StatCard
          title="Total Deposit"
          value={formatPKR(user.totalDeposit)}
          icon={ArrowDownToLine}
        />

        <StatCard
          title="Total Reward"
          value={formatPKR(user.totalReward)}
          icon={Gift}
        />

        <StatCard
          title="Referral Commission"
          value={formatPKR(user.totalCommission)}
          icon={Users}
        />
      </div>

      {/* Account overview + referral */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#080b1f] p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold">
                Account Overview
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Your current account activity
              </p>
            </div>

            <TrendingUp className="text-pink-400" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <OverviewItem
              label="Active Investments"
              value={activeInvestments.toString()}
            />

            <OverviewItem
              label="Total Investments"
              value={totalInvestments.toString()}
            />

            <OverviewItem
              label="Direct Referrals"
              value={referralCount.toString()}
            />

            <OverviewItem
              label="Total Withdrawal"
              value={formatPKR(
                user.totalWithdrawal
              )}
            />
          </div>
        </div>

        {/* Referral */}
        <div className="rounded-2xl border border-pink-500/10 bg-gradient-to-br from-[#121036] to-[#080b1f] p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Your Referral Code
          </p>

          <p className="mt-4 break-all text-2xl font-black text-pink-400">
            {user.referralCode}
          </p>

          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            Invite users using your referral code and
            receive your configured 2% direct referral
            commission.
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

      {/* Quick actions */}
      <div>
        <h3 className="text-lg font-bold">
          Quick Actions
        </h3>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction
            href="/dashboard/plans"
            title="Investment Plans"
            description="View available investment plans"
            icon={TrendingUp}
          />

          <QuickAction
            href="/dashboard/deposit"
            title="Make Deposit"
            description="Submit an EasyPaisa deposit"
            icon={ArrowDownToLine}
          />

          <QuickAction
            href="/dashboard/withdrawals"
            title="Withdraw"
            description="Request a withdrawal"
            icon={ArrowUpFromLine}
          />

          <QuickAction
            href="/dashboard/transactions"
            title="Transactions"
            description="View your account history"
            icon={Receipt}
          />
        </div>
      </div>

      {/* Recent investments */}
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">
              My Investments
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Your latest investment activity
            </p>
          </div>

          <Link
            href="/dashboard/investments"
            className="text-sm font-semibold text-pink-400 hover:text-pink-300"
          >
            View all
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#080b1f]">
          {recentInvestments.length === 0 ? (
            <div className="p-8 text-center">
              <BriefcaseBusiness
                className="mx-auto text-gray-600"
                size={32}
              />

              <p className="mt-3 text-sm text-gray-500">
                You don't have any investments yet.
              </p>

              <Link
                href="/dashboard/plans"
                className="mt-4 inline-flex rounded-xl bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600"
              >
                View Plans
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentInvestments.map(
                (investment) => (
                  <div
                    key={investment.id}
                    className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold">
                        {investment.plan.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Investment:{" "}
                        {formatPKR(
                          investment.amount
                        )}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="font-bold text-emerald-400">
                        +
                        {formatPKR(
                          investment.reward
                        )}
                      </p>

                      <span
                        className={`mt-1 inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          investment.status ===
                          "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : investment.status ===
                              "COMPLETED"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {investment.status}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Recent transactions */}
      <section>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">
              Recent Transactions
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Latest balance activity
            </p>
          </div>

          <Link
            href="/dashboard/transactions"
            className="text-sm font-semibold text-pink-400 hover:text-pink-300"
          >
            View all
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#080b1f]">
          {recentTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <Receipt
                className="mx-auto text-gray-600"
                size={32}
              />

              <p className="mt-3 text-sm text-gray-500">
                No transactions yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentTransactions.map(
                (transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-5"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {formatTransactionType(
                          transaction.type
                        )}
                      </p>

                      {transaction.note && (
                        <p className="mt-1 max-w-[220px] truncate text-xs text-gray-500">
                          {transaction.note}
                        </p>
                      )}
                    </div>

                    <p
                      className={`font-bold ${
                        isPositiveTransaction(
                          transaction.type
                        )
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {isPositiveTransaction(
                        transaction.type
                      )
                        ? "+"
                        : "-"}
                      {formatPKR(
                        transaction.amount
                      )}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function formatTransactionType(
  type: string
) {
  switch (type) {
    case "DEPOSIT":
      return "Deposit";

    case "WITHDRAWAL":
      return "Withdrawal";

    case "INVESTMENT":
      return "Investment";

    case "REWARD":
      return "Investment Reward";

    case "REFERRAL_COMMISSION":
      return "Referral Commission";

    case "REFUND":
      return "Refund";

    case "ADJUSTMENT":
      return "Balance Adjustment";

    default:
      return type;
  }
}

function isPositiveTransaction(
  type: string
) {
  return [
    "DEPOSIT",
    "REWARD",
    "REFERRAL_COMMISSION",
    "REFUND",
    "ADJUSTMENT",
  ].includes(type);
}

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
    <div className="rounded-2xl border border-white/10 bg-[#080b1f] p-5 transition hover:border-pink-500/20">
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
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/10 bg-[#080b1f] p-5 transition hover:border-pink-500/30 hover:bg-[#0b0f29]"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-bold group-hover:text-pink-400">
          {title}
        </h3>

        <Icon
          size={18}
          className="text-gray-600 transition group-hover:text-pink-400"
        />
      </div>

      <p className="mt-2 text-sm text-gray-500">
        {description}
      </p>
    </Link>
  );
}