"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  Copy,
  Loader2,
  Wallet,
} from "lucide-react";

type PaymentMethod = {
  id: string;
  name: string;
  type: string;
  accountName: string | null;
  accountNumber: string | null;
  instructions: string | null;
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
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod | null>(null);

  const [deposits, setDeposits] = useState<Deposit[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      const [
        paymentResponse,
        depositsResponse,
      ] = await Promise.all([
        fetch("/api/payment-methods", {
          cache: "no-store",
        }),
        fetch("/api/deposits", {
          cache: "no-store",
        }),
      ]);

      const paymentData =
        await paymentResponse.json();

      const depositData =
        await depositsResponse.json();

      if (paymentData.success) {
        setPaymentMethod(
          paymentData.paymentMethods?.[0] ?? null
        );
      }

      if (depositData.success) {
        setDeposits(
          depositData.deposits ?? []
        );
      }
    } catch {
      setMessage(
        "Failed to load deposit information."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function submitDeposit(
    event: FormEvent
  ) {
    event.preventDefault();

    if (!paymentMethod) {
      setMessage(
        "No payment method is currently available."
      );
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/deposits",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            transactionId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error ||
            "Deposit request failed."
        );
        return;
      }

      setMessage(
        "Deposit request submitted successfully."
      );

      setAmount("");
      setTransactionId("");

      await loadData();
    } catch {
      setMessage(
        "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function copyAccount() {
    if (!paymentMethod?.accountNumber) {
      return;
    }

    await navigator.clipboard.writeText(
      paymentMethod.accountNumber
    );

    setMessage(
      `${paymentMethod.name} account number copied.`
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <Header />

        {message && (
          <div className="mb-6 rounded-2xl border border-pink-500/20 bg-pink-500/10 p-4 text-sm text-pink-300">
            {message}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-12 text-center text-sm text-gray-500">
            Loading payment method...
          </div>
        ) : !paymentMethod ? (
          <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-8 text-center">
            <Wallet
              size={36}
              className="mx-auto text-yellow-400"
            />

            <h2 className="mt-4 text-xl font-bold">
              Deposits temporarily unavailable
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              No payment account is currently active.
              Please try again later.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-green-500/10 p-3 text-green-400">
                    <Wallet size={22} />
                  </div>

                  <div>
                    <h2 className="font-bold">
                      {paymentMethod.name}
                    </h2>

                    <p className="text-xs text-gray-500">
                      Available deposit method
                    </p>
                  </div>
                </div>

                <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <p className="text-xs text-gray-500">
                    Account Name
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {paymentMethod.accountName ||
                      "-"}
                  </p>

                  <p className="mt-5 text-xs text-gray-500">
                    Account Number
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-xl font-black tracking-wider">
                      {paymentMethod.accountNumber ||
                        "-"}
                    </p>

                    {paymentMethod.accountNumber && (
                      <button
                        type="button"
                        onClick={copyAccount}
                        className="rounded-xl bg-white/5 p-2 text-gray-300 hover:bg-white/10"
                      >
                        <Copy size={17} />
                      </button>
                    )}
                  </div>

                  {paymentMethod.instructions && (
                    <div className="mt-5 rounded-2xl bg-white/[0.03] p-4">
                      <p className="text-xs leading-5 text-gray-400">
                        {paymentMethod.instructions}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
                  <p className="text-xs leading-5 text-gray-400">
                    Send your payment to the account above,
                    then enter the exact amount and transaction
                    ID in the form.
                  </p>
                </div>
              </div>

              <form
                onSubmit={submitDeposit}
                className="rounded-3xl border border-white/10 bg-[#080b1f] p-6"
              >
                <h2 className="text-xl font-bold">
                  Submit Deposit
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Submit your {paymentMethod.name} payment
                  details for admin verification.
                </p>

                <div className="mt-6 space-y-5">
                  <Field
                    label="Amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={setAmount}
                  />

                  <Field
                    label={`${paymentMethod.name} Transaction ID`}
                    placeholder="Enter transaction ID"
                    value={transactionId}
                    onChange={setTransactionId}
                  />

                  <button
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3.5 text-sm font-bold disabled:opacity-50"
                  >
                    {submitting && (
                      <Loader2
                        className="animate-spin"
                        size={17}
                      />
                    )}

                    Submit Deposit

                    <ArrowDownToLine size={17} />
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-[#080b1f] p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  Deposit History
                </h2>

                <Link
                  href="/dashboard/transactions"
                  className="text-sm text-pink-400 hover:text-pink-300"
                >
                  Transactions
                </Link>
              </div>

              <div className="mt-5 overflow-x-auto">
                {deposits.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-500">
                    No deposits yet.
                  </p>
                ) : (
                  <table className="w-full min-w-[650px] text-left">
                    <thead>
                      <tr className="border-b border-white/10 text-xs uppercase text-gray-500">
                        <th className="pb-4">
                          Amount
                        </th>

                        <th className="pb-4">
                          Method
                        </th>

                        <th className="pb-4">
                          Transaction ID
                        </th>

                        <th className="pb-4">
                          Status
                        </th>

                        <th className="pb-4">
                          Date
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {deposits.map(
                        (deposit) => (
                          <tr
                            key={deposit.id}
                            className="border-b border-white/5 text-sm"
                          >
                            <td className="py-4 font-bold">
                              Rs.{" "}
                              {Number(
                                deposit.amount
                              ).toLocaleString(
                                "en-PK"
                              )}
                            </td>

                            <td className="py-4">
                              {formatType(
                                deposit.method
                              )}
                            </td>

                            <td className="py-4 text-gray-400">
                              {deposit.transactionId ||
                                "-"}
                            </td>

                            <td className="py-4">
                              <Status
                                status={
                                  deposit.status
                                }
                              />
                            </td>

                            <td className="py-4 text-gray-500">
                              {new Date(
                                deposit.createdAt
                              ).toLocaleDateString(
                                "en-PK"
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
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

      <h1 className="mt-2 text-3xl font-black">
        Make a Deposit
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        Add funds to your Veltra balance using the
        currently available payment method.
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
        min={
          type === "number"
            ? "1"
            : undefined
        }
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-[#050814] px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-600 focus:border-pink-500/50"
      />
    </label>
  );
}

function Status({
  status,
}: {
  status: string;
}) {
  const styles: Record<
    string,
    string
  > = {
    APPROVED:
      "bg-emerald-400/10 text-emerald-400",
    REJECTED:
      "bg-red-400/10 text-red-400",
    PENDING:
      "bg-yellow-400/10 text-yellow-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] ||
        "bg-white/10 text-gray-400"
      }`}
    >
      {status}
    </span>
  );
}

function formatType(type: string) {
  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}