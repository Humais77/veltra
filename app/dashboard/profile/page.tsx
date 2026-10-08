"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  UserRound,
} from "lucide-react";

type Profile = {
  fullName: string;
  username: string;
  email: string;
  phone: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/profile", {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.user);
          setFullName(data.user.fullName);
          setEmail(data.user.email);
          setPhone(data.user.phone);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function updateProfile(event: FormEvent) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Unable to update profile.");
        return;
      }

      setProfile(data.user);
      setMessage("Profile updated successfully.");
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="p-10 text-center text-sm text-gray-500">
        Loading profile...
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-pink-400">
            Account
          </p>

          <h1 className="mt-2 text-3xl font-black">
            My Profile
          </h1>
        </div>

        <form
          onSubmit={updateProfile}
          className="rounded-3xl border border-white/10 bg-[#080b1f] p-6 sm:p-8"
        >
          <div className="mb-7 flex items-center gap-4">
            <div className="rounded-2xl bg-pink-500/10 p-4 text-pink-400">
              <UserRound size={26} />
            </div>

            <div>
              <h2 className="font-bold">{profile?.username}</h2>
              <p className="text-sm text-gray-500">
                Update your account information
              </p>
            </div>
          </div>

          {message && (
            <div className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-400">
              <CheckCircle2 size={17} />
              {message}
            </div>
          )}

          <div className="space-y-5">
            <Field
              label="Username"
              value={profile?.username || ""}
              disabled
            />

            <Field
              label="Full Name"
              value={fullName}
              onChange={setFullName}
            />

            <Field
              label="Email"
              value={email}
              onChange={setEmail}
              type="email"
            />

            <Field
              label="Phone"
              value={phone}
              onChange={setPhone}
            />

            <button
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3.5 text-sm font-bold disabled:opacity-50"
            >
              {saving && (
                <Loader2 className="animate-spin" size={17} />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-gray-300">
        {label}
      </span>

      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-[#050814] px-4 py-3.5 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-pink-500/50"
      />
    </label>
  );
}