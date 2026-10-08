"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ArrowUpFromLine,
  Loader2,
  Wallet,
} from "lucide-react";

type Withdrawal = {
  id: string;
  amount: string;
  method: string;
  accountName: string | null;
  accountNumber: string;
  status: string;
  createdAt: string;
};

export default function WithdrawalsPage() {
  const [amount, setAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function loadWithdrawals() {
    try {
      const response = await fetch("/api/withdrawals", {
        cache: "no-store",
      });

      const data = await response.json();

      if (data.success) {
        setWithdrawals(data.withdrawals ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWithdrawals();
  }, []);

  async function submitWithdrawal(event: FormEvent) {
    event.preventDefault();

    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/withdrawals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          method: "EASYPAISA",
          accountName,
          accountNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Withdrawal request failed.");
        return;
      }

      setMessage("Withdrawal request submitted successfully.");

      setAmount("");
      await loadWithdrawals();
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-pink-400">
            Wallet
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Withdraw Funds
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Request a withdrawal from your available balance.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <form
            onSubmit={submitWithdrawal}
            className="rounded-3xl border border-white/10 bg-[#080b1f] p-6"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-purple-500/10 p-3 text-purple-400">
                <Wallet size={22} />
              </div>

              <div>
                <h2 className="font-bold">EasyPaisa Withdrawal</h2>
                <p className="text-xs text-gray-500">
                  Available withdrawal method
                </p>
              </div>
            </div>

            {message && (
              <div className="mt-5 rounded-2xl border border-pink-500/20 bg-pink-500/10 p-4 text-sm text-pink-300">
                {message}
              </div>
            )}

            <div className="mt-6 space-y-5">
              <Field
                label="Amount"
                type="number"
                placeholder="Enter withdrawal amount"
                value={amount}
                onChange={setAmount}
              />

              <Field
                label="Account Name"
                placeholder="EasyPaisa account name"
                value={accountName}
                onChange={setAccountName}
              />

              <Field
                label="EasyPaisa Number"
                placeholder="03XXXXXXXXX"
                value={accountNumber}
                onChange={setAccountNumber}
              />

              <button
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-3.5 text-sm font-bold disabled:opacity-50"
              >
                {submitting && (
                  <Loader2 className="animate-spin" size={17} />
                )}
                Request Withdrawal
                <ArrowUpFromLine size={17} />
              </button>
            </div>
          </form>

          <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-6">
            <h2 className="text-xl font-bold">
              Withdrawal Information
            </h2>

            <div className="mt-6 space-y-4">
              <Info text="Only EasyPaisa withdrawals are currently available." />
              <Info text="Your balance is reserved when the request is submitted." />
              <Info text="Rejected requests automatically return the reserved amount." />
              <Info text="Admin approval is required before completion." />
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-[#080b1f] p-6">
          <h2 className="text-xl font-bold">Withdrawal History</h2>

          <div className="mt-5 overflow-x-auto">
            {loading ? (
              <p className="py-8 text-center text-sm text-gray-500">
                Loading...
              </p>
            ) : withdrawals.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                No withdrawals yet.
              </p>
            ) : (
              <table className="w-full min-w-[650px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase text-gray-500">
                    <th className="pb-4">Amount</th>
                    <th className="pb-4">Method</th>
                    <th className="pb-4">Account</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {withdrawals.map((withdrawal) => (
                    <tr
                      key={withdrawal.id}
                      className="border-b border-white/5 text-sm"
                    >
                      <td className="py-4 font-bold">
                        Rs.{" "}
                        {Number(withdrawal.amount).toLocaleString(
                          "en-PK"
                        )}
                      </td>

                      <td className="py-4">
                        {withdrawal.method}
                      </td>

                      <td className="py-4 text-gray-400">
                        {withdrawal.accountNumber}
                      </td>

                      <td className="py-4">
                        <Status status={withdrawal.status} />
                      </td>

                      <td className="py-4 text-gray-500">
                        {new Date(
                          withdrawal.createdAt
                        ).toLocaleDateString("en-PK")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-gray-300">
        {label}
      </span>

      <input
        required
        type={type}
        min={type === "number" ? "1" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-[#050814] px-4 py-3.5 text-sm outline-none focus:border-pink-500/50"
      />
    </label>
  );
}

function Info({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-sm text-gray-400">
      {text}
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