import {
  ArrowDownLeft,
  ArrowUpRight,
  CircleDollarSign,
  Gift,
  RefreshCcw,
  TrendingUp,
} from "lucide-react";

import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";

export default async function TransactionsPage() {
  const user = await getCurrentUser();

  if (!user) return null;

  const transactions = await db.orm.public.Transaction
    .where({ userId: user.id })
    .orderBy((transaction) => transaction.createdAt.desc())
    .all();

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Updated Header */}
        <div className="mb-8">
          <DashboardHeader
            userName={user.fullName}
            pageTitle="Transactions"
            subtitle="A full history of your account activity."
            isOnline={true}
          />
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#080b1f]">
          {transactions.length === 0 ? (
            <div className="p-12 text-center">
              <CircleDollarSign
                className="mx-auto text-gray-500"
                size={36}
              />
              <p className="mt-4 text-sm text-gray-500">
                No transactions yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-white/5 p-3">
                      <TransactionIcon type={transaction.type} />
                    </div>

                    <div>
                      <p className="font-semibold">
                        {formatType(transaction.type)}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {transaction.note || "Account transaction"}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p
                      className={`font-black ${
                        isPositive(transaction.type)
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {isPositive(transaction.type) ? "+" : "-"} Rs.{" "}
                      {Number(transaction.amount).toLocaleString(
                        "en-PK"
                      )}
                    </p>

                    <p className="mt-1 text-xs text-gray-600">
                      {new Date(
                        transaction.createdAt
                      ).toLocaleString("en-PK")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function TransactionIcon({ type }: { type: string }) {
  if (type === "DEPOSIT") {
    return <ArrowDownLeft className="text-emerald-400" size={20} />;
  }

  if (type === "WITHDRAWAL") {
    return <ArrowUpRight className="text-red-400" size={20} />;
  }

  if (type === "INVESTMENT") {
    return <TrendingUp className="text-purple-400" size={20} />;
  }

  if (type === "REWARD") {
    return <Gift className="text-pink-400" size={20} />;
  }

  if (type === "REFERRAL_COMMISSION") {
    return <Gift className="text-yellow-400" size={20} />;
  }

  return <RefreshCcw className="text-gray-400" size={20} />;
}

function formatType(type: string) {
  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function isPositive(type: string) {
  return [
    "DEPOSIT",
    "REWARD",
    "REFERRAL_COMMISSION",
    "REFUND",
    "ADJUSTMENT",
  ].includes(type);
}