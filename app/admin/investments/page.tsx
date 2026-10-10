import {
  CalendarDays,
  CircleDollarSign,
  TrendingUp,
} from "lucide-react";

import { db } from "@/src/prisma/db";

export default async function AdminInvestmentsPage() {
  const investments = await db.orm.public.Investment
    .orderBy((investment) => investment.createdAt.desc())
    .include("user")
    .include("plan")
    .limit(200)
    .all();

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-pink-400">
            Investment Management
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Investments
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Monitor investments created by users.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#080b1f]">
          {investments.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500">
              No investments found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase text-gray-500">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Plan</th>
                    <th className="px-6 py-4">Investment</th>
                    <th className="px-6 py-4">Reward</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Started</th>
                    <th className="px-6 py-4">Completed</th>
                  </tr>
                </thead>

                <tbody>
                  {investments.map((investment) => (
                    <tr
                      key={investment.id}
                      className="border-b border-white/5"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold">
                          {investment.user.fullName}
                        </p>

                        <p className="text-xs text-gray-500">
                          @{investment.user.username}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        {investment.plan.name}
                      </td>

                      <td className="px-6 py-5 font-bold">
                        Rs.{" "}
                        {Number(
                          investment.amount
                        ).toLocaleString("en-PK")}
                      </td>

                      <td className="px-6 py-5 font-bold text-emerald-400">
                        Rs.{" "}
                        {Number(
                          investment.reward
                        ).toLocaleString("en-PK")}
                      </td>

                      <td className="px-6 py-5">
                        <Status status={investment.status} />
                      </td>

                      <td className="px-6 py-5 text-xs text-gray-500">
                        {new Date(
                          investment.startedAt
                        ).toLocaleDateString("en-PK")}
                      </td>

                      <td className="px-6 py-5 text-xs text-gray-500">
                        {investment.completedAt
                          ? new Date(
                              investment.completedAt
                            ).toLocaleDateString("en-PK")
                          : "-"}
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

function Status({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: "bg-emerald-400/10 text-emerald-400",
    COMPLETED: "bg-blue-400/10 text-blue-400",
    CANCELLED: "bg-red-400/10 text-red-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] || "bg-white/10 text-gray-400"
      }`}
    >
      {status}
    </span>
  );
}