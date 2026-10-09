"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  CheckCircle2,
  Copy,
  Loader2,
  Wallet,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
type Deposit = {
  id: string;
  amount: string;
  method: string;
  transactionId: string | null;
  status: string;
  createdAt: string;
};

export default function DepositPage() {
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
const planId = searchParams.get("planId");

  async function loadDeposits() {
    try {
      const response = await fetch("/api/deposits", {
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

  async function submitDeposit(event: FormEvent) {
    event.preventDefault();

    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/deposits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  amount,
  method: "EASYPAISA",
  transactionId,
  ...(planId ? { planId } : {}),
}),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Deposit request failed.");
        return;
      }

      setMessage("Deposit request submitted successfully.");
      setAmount("");
      setTransactionId("");

      await loadDeposits();
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function copyNumber() {
    await navigator.clipboard.writeText("03001234567");
    setMessage("EasyPaisa account number copied.");
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Header />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-green-500/10 p-3 text-green-400">
                <Wallet size={22} />
              </div>

              <div>
                <h2 className="font-bold">EasyPaisa</h2>
                <p className="text-xs text-gray-500">
                  Available payment method
                </p>
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <p className="text-xs text-gray-500">
                EasyPaisa Account
              </p>

              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-xl font-black tracking-wider">
                  0300 1234567
                </p>

                <button
                  type="button"
                  onClick={copyNumber}
                  className="rounded-xl bg-white/5 p-2 text-gray-300 hover:bg-white/10"
                >
                  <Copy size={17} />
                </button>
              </div>

              <p className="mt-3 text-xs leading-5 text-gray-500">
                Send your deposit to this EasyPaisa account and then submit
                your transaction ID below.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              <Unavailable label="JazzCash" />
              <Unavailable label="Bank" />
              <Unavailable label="Crypto" />
            </div>
          </div>
          {planId && (
  <div className="mt-5 rounded-2xl border border-purple-500/20 bg-purple-500/10 p-4 text-sm text-purple-200">
    Your deposit is linked to your selected investment plan.
    The investment will be created after the deposit is approved,
    provided the plan is still active and the available balance
    covers the investment amount.
  </div>
)}

          <form
            onSubmit={submitDeposit}
            className="rounded-3xl border border-white/10 bg-[#080b1f] p-6"
          >
            <h2 className="text-xl font-bold">Submit Deposit</h2>

            <p className="mt-2 text-sm text-gray-500">
              Enter the amount and transaction ID after completing your
              EasyPaisa payment.
            </p>

            {message && (
              <div className="mt-5 rounded-2xl border border-pink-500/20 bg-pink-500/10 p-4 text-sm text-pink-300">
                {message}
              </div>
            )}

            <div className="mt-6 space-y-5">
              <Field
                label="Amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={setAmount}
              />

              <Field
                label="EasyPaisa Transaction ID"
                placeholder="Enter transaction ID"
                value={transactionId}
                onChange={setTransactionId}
              />

              <button
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3.5 text-sm font-bold disabled:opacity-50"
              >
                {submitting && <Loader2 className="animate-spin" size={17} />}
                Submit Deposit
                <ArrowDownToLine size={17} />
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-[#080b1f] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Deposit History</h2>

            <Link
              href="/dashboard/transactions"
              className="text-sm text-pink-400 hover:text-pink-300"
            >
              Transactions
            </Link>
          </div>

          <div className="mt-5 overflow-x-auto">
            {loading ? (
              <p className="py-8 text-center text-sm text-gray-500">
                Loading...
              </p>
            ) : deposits.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                No deposits yet.
              </p>
            ) : (
              <table className="w-full min-w-[650px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase text-gray-500">
                    <th className="pb-4">Amount</th>
                    <th className="pb-4">Method</th>
                    <th className="pb-4">Transaction ID</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {deposits.map((deposit) => (
                    <tr
                      key={deposit.id}
                      className="border-b border-white/5 text-sm"
                    >
                      <td className="py-4 font-bold">
                        Rs. {Number(deposit.amount).toLocaleString("en-PK")}
                      </td>

                      <td className="py-4">{deposit.method}</td>

                      <td className="py-4 text-gray-400">
                        {deposit.transactionId || "-"}
                      </td>

                      <td className="py-4">
                        <Status status={deposit.status} />
                      </td>

                      <td className="py-4 text-gray-500">
                        {new Date(deposit.createdAt).toLocaleDateString(
                          "en-PK"
                        )}
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

function Header() {
  return (
    <div className="mb-8">
      <p className="text-sm font-semibold text-pink-400">
        Wallet
      </p>
      <h1 className="mt-2 text-3xl font-black">Make a Deposit</h1>
      <p className="mt-2 text-sm text-gray-500">
        Add funds to your Veltra balance through EasyPaisa.
      </p>
    </div>
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
      <span className="mb-2 block text-sm font-medium text-gray-300">
        {label}
      </span>

      <input
        required
        type={type}
        min={type === "number" ? "1" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-[#050814] px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-600 focus:border-pink-500/50"
      />
    </label>
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

function Unavailable({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3 text-center text-xs text-gray-600">
      {label}
      <div className="mt-1">Unavailable</div>
    </div>
  );
}