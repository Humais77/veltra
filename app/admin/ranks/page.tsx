"use client";

import { useEffect, useState } from "react";

type Rank = {
  id: string;
  level: number;
  name: string;
  minOwnInvestment: string;
  minReferralInvestment: string;
  bonus: string;
  isActive: boolean;
};

const emptyForm = {
  level: "1",
  name: "",
  minOwnInvestment: "0",
  minReferralInvestment: "0",
  bonus: "0",
  isActive: true,
};

export default function AdminRanksPage() {
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadRanks() {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/ranks", {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Could not load ranks.");

      setRanks(data.ranks);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRanks();
  }, []);

  function editRank(rank: Rank) {
    setEditingId(rank.id);
    setForm({
      level: String(rank.level),
      name: rank.name,
      minOwnInvestment: String(Number(rank.minOwnInvestment) / 100),
      minReferralInvestment: String(
        Number(rank.minReferralInvestment) / 100
      ),
      bonus: String(Number(rank.bonus) / 100),
      isActive: rank.isActive,
    });
    setMessage("");
  }

  async function saveRank(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      ...form,
      level: Number(form.level),
      minOwnInvestment: Number(form.minOwnInvestment),
      minReferralInvestment: Number(form.minReferralInvestment),
      bonus: Number(form.bonus),
    };

    try {
      const response = await fetch(
        editingId ? `/api/admin/ranks/${editingId}` : "/api/admin/ranks",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Could not save rank.");

      setMessage(editingId ? "Rank updated." : "Rank created.");
      setEditingId(null);
      setForm(emptyForm);
      await loadRanks();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Request failed.");
    } finally {
      setSaving(false);
    }
  }

  async function deactivateRank(id: string) {
    if (!confirm("Deactivate this rank?")) return;

    const response = await fetch(`/api/admin/ranks/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Could not deactivate rank.");
      return;
    }

    setMessage("Rank deactivated.");
    await loadRanks();
  }

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Rank Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Users must meet both their own-investment and network-investment
          requirements.
        </p>
      </div>

      {message && (
        <p className="rounded-lg bg-gray-100 p-3 text-sm">{message}</p>
      )}

      <form
        onSubmit={saveRank}
        className="grid gap-4 rounded-xl border p-5 md:grid-cols-2"
      >
        <h2 className="font-semibold md:col-span-2">
          {editingId ? "Edit rank" : "Create rank"}
        </h2>

        <label className="space-y-1 text-sm">
          <span>Rank level</span>
          <input
            required
            type="number"
            min="1"
            max="100"
            className="w-full rounded-lg border p-2"
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
          />
        </label>

        <label className="space-y-1 text-sm">
          <span>Rank name</span>
          <input
            required
            maxLength={80}
            className="w-full rounded-lg border p-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>

        <label className="space-y-1 text-sm">
          <span>Minimum own investment (Rs.)</span>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            className="w-full rounded-lg border p-2"
            value={form.minOwnInvestment}
            onChange={(e) =>
              setForm({ ...form, minOwnInvestment: e.target.value })
            }
          />
        </label>

        <label className="space-y-1 text-sm">
          <span>Minimum referral investment (Rs.)</span>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            className="w-full rounded-lg border p-2"
            value={form.minReferralInvestment}
            onChange={(e) =>
              setForm({ ...form, minReferralInvestment: e.target.value })
            }
          />
        </label>

        <label className="space-y-1 text-sm">
          <span>Rank bonus (Rs.)</span>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            className="w-full rounded-lg border p-2"
            value={form.bonus}
            onChange={(e) => setForm({ ...form, bonus: e.target.value })}
          />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              setForm({ ...form, isActive: e.target.checked })
            }
          />
          Active rank
        </label>

        <div className="flex flex-wrap gap-2 md:col-span-2">
          <button
            disabled={saving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : editingId ? "Update rank" : "Create rank"}
          </button>

          {editingId && (
            <button
              type="button"
              className="rounded-lg border px-4 py-2"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <section className="overflow-x-auto rounded-xl border">
        {loading ? (
          <p className="p-5">Loading ranks…</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Level</th>
                <th className="p-3">Name</th>
                <th className="p-3">Own investment</th>
                <th className="p-3">Referral investment</th>
                <th className="p-3">Bonus</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ranks.map((rank) => (
                <tr key={rank.id} className="border-t">
                  <td className="p-3">{rank.level}</td>
                  <td className="p-3">{rank.name}</td>
                  <td className="p-3">
                    Rs. {(Number(rank.minOwnInvestment) / 100).toLocaleString()}
                  </td>
                  <td className="p-3">
                    Rs.{" "}
                    {(
                      Number(rank.minReferralInvestment) / 100
                    ).toLocaleString()}
                  </td>
                  <td className="p-3">
                    Rs. {(Number(rank.bonus) / 100).toLocaleString()}
                  </td>
                  <td className="p-3">
                    {rank.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="space-x-3 whitespace-nowrap p-3">
                    <button
                      className="text-blue-600"
                      onClick={() => editRank(rank)}
                    >
                      Edit
                    </button>
                    {rank.isActive && (
                      <button
                        className="text-red-600"
                        onClick={() => void deactivateRank(rank.id)}
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!ranks.length && (
                <tr>
                  <td colSpan={7} className="p-5 text-gray-500">
                    No ranks created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}