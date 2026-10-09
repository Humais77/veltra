
"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  CheckCircle2,
  Copy,
  Loader2,
  Wallet,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

type PaymentMethod = {
  id: string;
  name: string;
  type: string;
  accountName: string | null;
  accountNumber: string;
  instructions: string | null;
  isAvailable: boolean;
};

type Deposit = {
  id: string;
  amount: string;
  method: string;
  transactionId: string | null;
  status: string;
  createdAt: string;
};

export default function DepositPage() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");

  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethodType, setSelectedMethodType] = useState("");
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [methodsLoading, setMethodsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const selectedMethod =
    paymentMethods.find((method) => method.type === selectedMethodType) ??
    paymentMethods[0];

  const loadDeposits = useCallback(async () => {
    try {
      const response = await fetch("/api/deposits", {
        cache: "no-store",
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setDeposits(data.deposits ?? []);
      }
    } catch (error) {
      console.error("Failed to load deposit history:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPaymentMethods = useCallback(async () => {
    try {
      const response = await fetch("/api/payment-methods", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load payment methods.");
      }

      const methods: PaymentMethod[] = Array.isArray(data)
        ? data
        : data.paymentMethods ?? data.methods ?? [];

      const availableMethods = methods.filter(
        (method) => method.isAvailable !== false
      );

      setPaymentMethods(availableMethods);

      setSelectedMethodType((current) => {
        if (availableMethods.some((method) => method.type === current)) {
          return current;
        }
        return availableMethods[0]?.type ?? "";
      });
    } catch (error) {
      console.error("Failed to load payment methods:", error);
      setMessage("Unable to load payment methods. Please refresh the page.");
      setMessageType("error");
    } finally {
      setMethodsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDeposits();
    void loadPaymentMethods();
  }, [loadDeposits, loadPaymentMethods]);

  async function submitDeposit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedMethod) {
      setMessage("Please select an available payment method.");
      setMessageType("error");
      return;
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setMessage("Please enter a valid deposit amount.");
      setMessageType("error");
      return;
    }

    if (!transactionId.trim()) {
      setMessage("Please enter your payment transaction ID.");
      setMessageType("error");
      return;
    }

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
          method: selectedMethod.type,
          transactionId: transactionId.trim(),
          ...(planId ? { planId } : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        setMessage(data.error || "Deposit request failed.");
        setMessageType("error");
        return;
      }

      setMessage("Deposit request submitted successfully. Awaiting approval.");
      setMessageType("success");
      setAmount("");
      setTransactionId("");

      await loadDeposits();
    } catch {
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  }

  async function copyAccountNumber() {
    if (!selectedMethod?.accountNumber) return;

    try {
      await navigator.clipboard.writeText(selectedMethod.accountNumber);
      setMessage(`${selectedMethod.name} account number copied.`);
      setMessageType("success");
    } catch {
      setMessage("Unable to copy automatically. Please copy the number manually.");
      setMessageType("error");
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Header />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Payment methods */}
          <section className="rounded-3xl border border-white/10 bg-[#080b1f] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-green-500/10 p-3 text-green-400">
                <Wallet size={22} />
              </div>

              <div>
                <h2 className="font-bold">Payment Methods</h2>
                <p className="text-xs text-gray-500">
                  Select where you sent your payment.
                </p>
              </div>
            </div>

            {methodsLoading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
                <Loader2 size={18} className="animate-spin" />
                Loading payment methods...
              </div>
            ) : paymentMethods.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5 text-sm text-yellow-300">
                No payment methods are currently available. Please contact
                support or try again later.
              </div>
            ) : (
              <>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {paymentMethods.map((method) => {
                    const isSelected = selectedMethod?.id === method.id;

                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => {
                          setSelectedMethodType(method.type);
                          setMessage("");
                        }}
                        className={`flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition ${
                          isSelected
                            ? "border-pink-500/60 bg-pink-500/10"
                            : "border-white/10 bg-white/[0.02] hover:border-white/20"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="rounded-xl bg-white/5 p-2 text-gray-300">
                            <Wallet size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold">
                              {method.name}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {method.type}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <CheckCircle2
                            size={19}
                            className="shrink-0 text-pink-400"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedMethod && (
                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                    <p className="text-xs text-gray-500">
                      Send payment to
                    </p>

                    <h3 className="mt-1 text-lg font-bold">
                      {selectedMethod.name}
                    </h3>

                    {selectedMethod.accountName && (
                      <div className="mt-4">
                        <p className="text-xs text-gray-500">Account Name</p>
                        <p className="mt-1 font-medium">
                          {selectedMethod.accountName}
                        </p>
                      </div>
                    )}

                    <div className="mt-4">
                      <p className="text-xs text-gray-500">Account Number</p>

                      <div className="mt-2 flex items-center justify-between gap-3">
                        <p className="break-all text-lg font-black tracking-wide">
                          {selectedMethod.accountNumber}
                        </p>

                        <button
                          type="button"
                          onClick={copyAccountNumber}
                          aria-label="Copy account number"
                          className="shrink-0 rounded-xl bg-white/5 p-2 text-gray-300 hover:bg-white/10"
                        >
                          <Copy size={17} />
                        </button>
                      </div>
                    </div>

                    {selectedMethod.instructions && (
                      <div className="mt-4 rounded-xl bg-white/[0.03] p-3">
                        <p className="text-xs leading-5 text-gray-400">
                          {selectedMethod.instructions}
                        </p>
                      </div>
                    )}

                    <p className="mt-4 text-xs leading-5 text-gray-500">
                      Complete your payment using the details above. Then
                      submit the amount and transaction ID in the form.
                    </p>
                  </div>
                )}
              </>
            )}
          </section>

          {/* Deposit form */}
          <form
            onSubmit={submitDeposit}
            className="rounded-3xl border border-white/10 bg-[#080b1f] p-6"
          >
            <h2 className="text-xl font-bold">Submit Deposit</h2>

            <p className="mt-2 text-sm text-gray-500">
              Enter the amount you paid and the transaction ID from your
              payment confirmation.
            </p>

            {planId && (
              <div className="mt-5 rounded-2xl border border-purple-500/20 bg-purple-500/10 p-4 text-sm leading-6 text-purple-200">
                Your deposit is linked to your selected investment plan. The
                investment will be created after the deposit is approved,
                subject to the plan remaining active and the server-side
                investment requirements being met.
              </div>
            )}

            {message && (
              <div
                role="status"
                className={`mt-5 rounded-2xl border p-4 text-sm ${
                  messageType === "success"
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                    : "border-red-500/20 bg-red-500/10 text-red-300"
                }`}
              >
                {message}
              </div>
            )}

            <div className="mt-6 space-y-5">
              <Field
                label="Amount (PKR)"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={setAmount}
              />

              <Field
                label="Transaction ID"
                placeholder="Enter payment transaction ID"
                value={transactionId}
                onChange={setTransactionId}
              />

              {selectedMethod && (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-sm">
                  <span className="text-gray-500">Selected method: </span>
                  <span className="font-semibold text-gray-200">
                    {selectedMethod.name}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  submitting ||
                  methodsLoading ||
                  !selectedMethod ||
                  paymentMethods.length === 0
                }
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3.5 text-sm font-bold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={17} />
                ) : (
                  <ArrowDownToLine size={17} />
                )}
                {submitting ? "Submitting..." : "Submit Deposit"}
              </button>

              <p className="text-xs leading-5 text-gray-500">
                Your deposit will remain pending until an administrator
                reviews and approves it. Do not submit a transaction ID for a
                payment you have not completed.
              </p>
            </div>
          </form>
        </div>

        {/* Deposit history */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-[#080b1f] p-6">
          <div className="flex items-center justify-between gap-3">
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
                Loading deposits...
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
                        Rs.{" "}
                        {Number(deposit.amount).toLocaleString("en-PK")}
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
        </section>
      </div>
    </main>
  );
}

function Header() {
  return (
    <div className="mb-8">
      <p className="text-sm font-semibold text-pink-400">Wallet</p>
      <h1 className="mt-2 text-3xl font-black">Make a Deposit</h1>
      <p className="mt-2 text-sm text-gray-500">
        Add funds to your Veltra balance using an available payment method.
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
        step={type === "number" ? "any" : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
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