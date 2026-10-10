import {
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  RefreshCcw,
  TrendingUp,
} from "lucide-react";

import { db } from "@/src/prisma/db";

export default async function AdminTransactionsPage() {
  const transactions = await db.orm.public.Transaction
    .orderBy((transaction) => transaction.createdAt.desc())
    .include("user")
    .limit(200)
    .all();

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-pink-400">
            Financial Records
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Transactions
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            View platform-wide transaction activity.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#080b1f]">
          {transactions.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500">
              No transactions found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase text-gray-500">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Note</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-white/5"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold">
                          {transaction.user.fullName}
                        </p>

                        <p className="text-xs text-gray-500">
                          @{transaction.user.username}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <TransactionIcon
                            type={transaction.type}
                          />

                          <span className="text-sm">
                            {formatType(transaction.type)}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 font-bold">
                        Rs.{" "}
                        {Number(
                          transaction.amount
                        ).toLocaleString("en-PK")}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-500">
                        {transaction.note || "-"}
                      </td>

                      <td className="px-6 py-5 text-xs text-gray-500">
                        {new Date(
                          transaction.createdAt
                        ).toLocaleString("en-PK")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function TransactionIcon({ type }: { type: string }) {
  if (type === "DEPOSIT") {
    return (
      <ArrowDownLeft
        size={16}
        className="text-emerald-400"
      />
    );
  }

  if (type === "WITHDRAWAL") {
    return (
      <ArrowUpRight
        size={16}
        className="text-red-400"
      />
    );
  }

  if (type === "INVESTMENT") {
    return (
      <TrendingUp
        size={16}
        className="text-purple-400"
      />
    );
  }

  if (
    type === "REWARD" ||
    type === "REFERRAL_COMMISSION"
  ) {
    return (
      <Gift
        size={16}
        className="text-pink-400"
      />
    );
  }

  return (
    <RefreshCcw
      size={16}
      className="text-gray-400"
    />
  );
}

function formatType(type: string) {
  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}