"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Check,
  CreditCard,
  Loader2,
  Plus,
  Trash2,
  Power,
  PowerOff,
} from "lucide-react";

type PaymentMethod = {
  id: string;
  name: string;
  type: string;
  accountName: string | null;
  accountNumber: string | null;
  instructions: string | null;
  isAvailable: boolean;
  createdAt: string;
};

const PAYMENT_TYPES = [
  "SADAPAY",
  "EASYPAISA",
  "JAZZCASH",
  "BANK",
  "CRYPTO",
];

export default function AdminPaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [name, setName] = useState("SadaPay");
  const [type, setType] = useState("SADAPAY");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [instructions, setInstructions] = useState("");
  const [activate, setActivate] = useState(true);

  async function loadMethods() {
    try {
      const response = await fetch(
        "/api/admin/payment-methods",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (data.success) {
        setMethods(data.paymentMethods ?? []);
      }
    } catch {
      setMessage("Failed to load payment methods.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMethods();
  }, []);

  async function createMethod(
    event: FormEvent
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/admin/payment-methods",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            type,
            accountName,
            accountNumber,
            instructions,
            isAvailable: activate,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error ||
            "Failed to create payment method."
        );
        return;
      }

      setMessage(
        "Payment method created successfully."
      );

      setAccountName("");
      setAccountNumber("");
      setInstructions("");

      await loadMethods();
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleMethod(
    method: PaymentMethod
  ) {
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/payment-methods/${method.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isAvailable: !method.isAvailable,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error ||
            "Failed to update payment method."
        );
        return;
      }

      await loadMethods();
    } catch {
      setMessage("Something went wrong.");
    }
  }

  async function deleteMethod(
    method: PaymentMethod
  ) {
    const confirmed = window.confirm(
      `Delete ${method.name}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/admin/payment-methods/${method.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.error ||
            "Failed to delete payment method."
        );
        return;
      }

      await loadMethods();
    } catch {
      setMessage("Something went wrong.");
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-pink-400">
            Wallet Settings
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Payment Methods
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage the payment account users can use
            for deposits.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-pink-500/20 bg-pink-500/10 p-4 text-sm text-pink-300">
            {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <form
            onSubmit={createMethod}
            className="rounded-3xl border border-white/10 bg-[#080b1f] p-6"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-pink-500/10 p-3 text-pink-400">
                <Plus size={20} />
              </div>

              <div>
                <h2 className="font-bold">
                  Add Payment Account
                </h2>

                <p className="text-xs text-gray-500">
                  Create a deposit account
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <Field
                label="Display Name"
                value={name}
                onChange={setName}
                placeholder="SadaPay"
              />

              <label className="block">
                <span className="mb-2 block text-sm text-gray-300">
                  Payment Type
                </span>

                <select
                  value={type}
                  onChange={(event) =>
                    setType(event.target.value)
                  }
                  className="w-full rounded-2xl border border-white/10 bg-[#050814] px-4 py-3.5 text-sm outline-none focus:border-pink-500/50"
                >
                  {PAYMENT_TYPES.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {formatType(item)}
                    </option>
                  ))}
                </select>
              </label>

              <Field
                label="Account Name"
                value={accountName}
                onChange={setAccountName}
                placeholder="Account holder name"
              />

              <Field
                label="Account Number"
                value={accountNumber}
                onChange={setAccountNumber}
                placeholder="03XXXXXXXXX / IBAN"
              />

              <label className="block">
                <span className="mb-2 block text-sm text-gray-300">
                  Instructions
                </span>

                <textarea
                  value={instructions}
                  onChange={(event) =>
                    setInstructions(
                      event.target.value
                    )
                  }
                  placeholder="Send payment and enter the transaction ID..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-[#050814] px-4 py-3.5 text-sm outline-none focus:border-pink-500/50"
                />
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <input
                  type="checkbox"
                  checked={activate}
                  onChange={(event) =>
                    setActivate(
                      event.target.checked
                    )
                  }
                />

                <div>
                  <p className="text-sm font-semibold">
                    Make active
                  </p>

                  <p className="text-xs text-gray-500">
                    Activating this will disable every
                    other payment method.
                  </p>
                </div>
              </label>

              <button
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3.5 text-sm font-bold disabled:opacity-50"
              >
                {saving && (
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                )}

                Create Payment Account
              </button>
            </div>
          </form>

          <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Payment Accounts
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Only one account can be active at a
                  time.
                </p>
              </div>

              <CreditCard className="text-gray-500" />
            </div>

            {loading ? (
              <div className="py-12 text-center text-sm text-gray-500">
                Loading payment methods...
              </div>
            ) : methods.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-500">
                No payment accounts created yet.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {methods.map((method) => (
                  <div
                    key={method.id}
                    className={`rounded-2xl border p-5 ${
                      method.isAvailable
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">
                            {method.name}
                          </h3>

                          {method.isAvailable && (
                            <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-400">
                              Active
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                          {formatType(method.type)}
                        </p>

                        <p className="mt-3 text-sm text-gray-300">
                          {method.accountName || "-"}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {method.accountNumber || "-"}
                        </p>

                        {method.instructions && (
                          <p className="mt-3 text-xs leading-5 text-gray-500">
                            {method.instructions}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            toggleMethod(method)
                          }
                          className={`rounded-xl p-2.5 ${
                            method.isAvailable
                              ? "bg-red-500/10 text-red-400"
                              : "bg-emerald-500/10 text-emerald-400"
                          }`}
                          title={
                            method.isAvailable
                              ? "Disable"
                              : "Activate"
                          }
                        >
                          {method.isAvailable ? (
                            <PowerOff size={17} />
                          ) : (
                            <Power size={17} />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteMethod(method)
                          }
                          className="rounded-xl bg-red-500/10 p-2.5 text-red-400"
                          title="Delete"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-gray-300">
        {label}
      </span>

      <input
        required={label !== "Account Name"}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-[#050814] px-4 py-3.5 text-sm outline-none focus:border-pink-500/50"
      />
    </label>
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