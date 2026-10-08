"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownToLine,
  Check,
  ExternalLink,
  Loader2,
  X,
} from "lucide-react";

type Deposit = {
  id: string;
  amount: string;
  method: string;
  transactionId: string | null;
  screenshotUrl: string | null;
  status: string;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    username: string;
    email: string;
  };
};

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(
    null
  );
  const [message, setMessage] = useState("");

  async function loadDeposits() {
    try {
      const response = await fetch("/api/admin/deposits", {
        cache: "no-store",
      });

      const data = await response.json();

      if (data.success) {
        setDeposits(data.deposits ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDeposits();
  }, []);

  async function updateDeposit(
    id: string,
    status: "APPROVED" | "REJECTED"
  ) {
    setProcessing(id);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/deposits/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Unable to update deposit.");
        return;
      }

      setMessage(
        status === "APPROVED"
          ? "Deposit approved."
          : "Deposit rejected."
      );

      await loadDeposits();
    } finally {
      setProcessing(null);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Header />

        {message && (
          <div className="mb-5 rounded-2xl border border-pink-500/20 bg-pink-500/10 p-4 text-sm text-pink-300">
            {message}
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#080b1f]">
          {loading ? (
            <Loading />
          ) : deposits.length === 0 ? (
            <Empty />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase text-gray-500">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {deposits.map((deposit) => (
                    <tr
                      key={deposit.id}
                      className="border-b border-white/5"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold">
                          {deposit.user.fullName}
                        </p>
                        <p className="text-xs text-gray-500">
                          @{deposit.user.username}
                        </p>
                      </td>

                      <td className="px-6 py-5 font-bold">
                        Rs.{" "}
                        {Number(deposit.amount).toLocaleString(
                          "en-PK"
                        )}
                      </td>

                      <td className="px-6 py-5 text-sm">
                        {deposit.method}
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-400">
                        {deposit.transactionId || "-"}
                      </td>

                      <td className="px-6 py-5">
                        <Status status={deposit.status} />
                      </td>

                      <td className="px-6 py-5 text-xs text-gray-500">
                        {new Date(
                          deposit.createdAt
                        ).toLocaleString("en-PK")}
                      </td>

                      <td className="px-6 py-5">
                        {deposit.status === "PENDING" ? (
                          <div className="flex gap-2">
                            <button
                              disabled={processing === deposit.id}
                              onClick={() =>
                                updateDeposit(
                                  deposit.id,
                                  "APPROVED"
                                )
                              }
                              className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-50"
                              title="Approve"
                            >
                              {processing === deposit.id ? (
                                <Loader2
                                  size={17}
                                  className="animate-spin"
                                />
                              ) : (
                                <Check size={17} />
                              )}
                            </button>

                            <button
                              disabled={processing === deposit.id}
                              onClick={() =>
                                updateDeposit(
                                  deposit.id,
                                  "REJECTED"
                                )
                              }
                              className="rounded-xl bg-red-500/10 p-2.5 text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                              title="Reject"
                            >
                              <X size={17} />
                            </button>

                            {deposit.screenshotUrl && (
                              <a
                                href={deposit.screenshotUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-xl bg-white/5 p-2.5 text-gray-300"
                              >
                                <ExternalLink size={17} />
                              </a>
                            )}
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

function Header() {
  return (
    <div className="mb-8">
      <p className="text-sm font-semibold text-pink-400">
        Wallet Management
      </p>

      <h1 className="mt-2 text-3xl font-black">
        Deposits
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        Review and approve user deposit requests.
      </p>
    </div>
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
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] || "bg-white/10 text-gray-400"
      }`}
    >
      {status}
    </span>
  );
}

function Loading() {
  return (
    <div className="p-12 text-center text-sm text-gray-500">
      Loading deposits...
    </div>
  );
}

function Empty() {
  return (
    <div className="p-12 text-center text-sm text-gray-500">
      No deposit requests found.
    </div>
  );
}