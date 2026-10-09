"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpFromLine,
  Check,
  Loader2,
  X,
} from "lucide-react";

type Withdrawal = {
  id: string;
  amount: string;
  method: string;
  accountName: string | null;
  accountNumber: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    username: string;
    email: string;
  };
};

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(
    null
  );
  const [message, setMessage] = useState("");

  async function loadWithdrawals() {
    try {
      const response = await fetch("/api/admin/withdrawals", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to load withdrawals."
        );
      }

      setWithdrawals(data.withdrawals ?? []);
    } catch (error) {
      console.error("Failed to load withdrawals:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load withdrawals."
      );
    } finally {
      setLoading(false);
    }
  }



  useEffect(() => {
    loadWithdrawals();
  }, []);

  async function updateWithdrawal(
    id: string,
    status: "APPROVED" | "REJECTED"
  ) {
    setProcessing(id);
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/withdrawals/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error || "Unable to update withdrawal."
        );
        return;
      }

      setMessage(
        status === "APPROVED"
          ? "Withdrawal approved."
          : "Withdrawal rejected and balance returned."
      );

      await loadWithdrawals();
    } finally {
      setProcessing(null);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-pink-400">
            Wallet Management
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Withdrawals
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Review and process user withdrawal requests.
          </p>
        </div>

        {message && (
          <div className="mb-5 rounded-2xl bg-pink-500/10 p-4 text-sm text-pink-300">
            {message}
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#080b1f]">
          {loading ? (
            <Loading />
          ) : withdrawals.length === 0 ? (
            <Empty />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase text-gray-500">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Account</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {withdrawals.map((withdrawal) => (
                    <tr
                      key={withdrawal.id}
                      className="border-b border-white/5"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold">
                          {withdrawal.user.fullName}
                        </p>
                        <p className="text-xs text-gray-500">
                          @{withdrawal.user.username}
                        </p>
                      </td>

                      <td className="px-6 py-5 font-bold">
                        Rs.{" "}
                        {Number(
                          withdrawal.amount
                        ).toLocaleString("en-PK")}
                      </td>

                      <td className="px-6 py-5 text-sm">
                        {withdrawal.method}
                      </td>

                      <td className="px-6 py-5">
                        <p className="text-sm">
                          {withdrawal.accountName || "-"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {withdrawal.accountNumber}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <Status status={withdrawal.status} />
                      </td>

                      <td className="px-6 py-5 text-xs text-gray-500">
                        {new Date(
                          withdrawal.createdAt
                        ).toLocaleString("en-PK")}
                      </td>

                      <td className="px-6 py-5">
                        {withdrawal.status === "PENDING" ? (
                          <div className="flex gap-2">
                            <button
                              disabled={
                                processing === withdrawal.id
                              }
                              onClick={() =>
                                updateWithdrawal(
                                  withdrawal.id,
                                  "APPROVED"
                                )
                              }
                              className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400 hover:bg-emerald-500/20"
                            >
                              {processing === withdrawal.id ? (
                                <Loader2
                                  size={17}
                                  className="animate-spin"
                                />
                              ) : (
                                <Check size={17} />
                              )}
                            </button>

                            <button
                              disabled={
                                processing === withdrawal.id
                              }
                              onClick={() =>
                                updateWithdrawal(
                                  withdrawal.id,
                                  "REJECTED"
                                )
                              }
                              className="rounded-xl bg-red-500/10 p-2.5 text-red-400 hover:bg-red-500/20"
                            >
                              <X size={17} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-600">
                            Processed
                          </span>
                        )}
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
    APPROVED: "bg-emerald-400/10 text-emerald-400",
    REJECTED: "bg-red-400/10 text-red-400",
    PENDING: "bg-yellow-400/10 text-yellow-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${styles[status] || "bg-white/10 text-gray-400"
        }`}
    >
      {status}
    </span>
  );
}

function Loading() {
  return (
    <div className="p-12 text-center text-sm text-gray-500">
      Loading withdrawals...
    </div>
  );
}

function Empty() {
  return (
    <div className="p-12 text-center text-sm text-gray-500">
      No withdrawal requests found.
    </div>
  );
}