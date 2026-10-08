"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  User,
  Mail,
  Lock,
  Phone,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  Gift,
  Loader2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: form.fullName,
            username: form.username,
            email: form.email,
            phone: form.phone,
            password: form.password,
            confirmPassword: form.confirmPassword,
            referralCode:
              form.referralCode || undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to create your account."
        );
        return;
      }

      router.push(
        `/login?registered=1&username=${encodeURIComponent(
          form.username.toLowerCase()
        )}`
      );
    } catch {
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050814] text-white">
      <header className="flex items-center justify-between px-6 py-6 md:px-12">
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-[#4020bd] shadow-[0_0_20px_rgba(236,72,153,0.25)]">
            <div className="h-4 w-4 rounded-full bg-[#050814]" />
            <div className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-white" />
          </div>

          <span className="text-xl font-bold tracking-wide">
            Veltra
          </span>
        </Link>

        <Link
          href="/login"
          className="text-sm text-gray-400 transition hover:text-white"
        >
          Already have an account?
          <span className="ml-1 font-semibold text-pink-400">
            Login
          </span>
        </Link>
      </header>

      <section className="relative px-4 py-8 md:px-8 lg:px-12">
        <div className="pointer-events-none absolute left-0 top-20 h-[400px] w-[400px] rounded-full bg-pink-500/10 blur-[130px]" />

        <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2">
          <div className="hidden pt-16 lg:block">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-pink-400">
              Create Account
            </p>

            <h1 className="text-5xl font-black leading-tight xl:text-6xl">
              Start your
              <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                journey.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-400">
              Create your account and manage your
              investments, rewards and referral activity
              from one secure dashboard.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs text-gray-500">
                  PLANS
                </p>
                <p className="mt-2 text-xl font-bold">
                  3
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs text-gray-500">
                  REFERRAL
                </p>
                <p className="mt-2 text-xl font-bold text-pink-400">
                  2%
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs text-gray-500">
                  SUPPORT
                </p>
                <p className="mt-2 text-xl font-bold">
                  24/7
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl">
            <div className="rounded-3xl border border-white/10 bg-[#080b1f]/90 p-6 shadow-2xl sm:p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold">
                  Create your account
                </h2>

                <p className="mt-2 text-sm text-gray-400">
                  Enter your details to create your
                  account.
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />

                    <input
                      value={form.fullName}
                      onChange={(e) =>
                        updateField(
                          "fullName",
                          e.target.value
                        )
                      }
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-white/10 bg-[#050814] py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Username
                  </label>

                  <div className="relative">
                    <User
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />

                    <input
                      value={form.username}
                      onChange={(e) =>
                        updateField(
                          "username",
                          e.target.value
                        )
                      }
                      placeholder="username"
                      autoComplete="username"
                      className="w-full rounded-xl border border-white/10 bg-[#050814] py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Email
                    </label>

                    <div className="relative">
                      <Mail
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                      />

                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          updateField(
                            "email",
                            e.target.value
                          )
                        }
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="w-full rounded-xl border border-white/10 bg-[#050814] py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Phone Number
                    </label>

                    <div className="relative">
                      <Phone
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                      />

                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          updateField(
                            "phone",
                            e.target.value
                          )
                        }
                        placeholder="+92 300 1234567"
                        autoComplete="tel"
                        className="w-full rounded-xl border border-white/10 bg-[#050814] py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Password
                    </label>

                    <div className="relative">
                      <Lock
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                      />

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={form.password}
                        onChange={(e) =>
                          updateField(
                            "password",
                            e.target.value
                          )
                        }
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="w-full rounded-xl border border-white/10 bg-[#050814] py-3.5 pl-11 pr-11 text-sm outline-none transition focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30"
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            (value) => !value
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Confirm Password
                    </label>

                    <div className="relative">
                      <Lock
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                      />

                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={form.confirmPassword}
                        onChange={(e) =>
                          updateField(
                            "confirmPassword",
                            e.target.value
                          )
                        }
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="w-full rounded-xl border border-white/10 bg-[#050814] py-3.5 pl-11 pr-11 text-sm outline-none transition focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30"
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (value) => !value
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Referral Code
                    <span className="ml-2 normal-case text-gray-600">
                      Optional
                    </span>
                  </label>

                  <div className="relative">
                    <Gift
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />

                    <input
                      value={form.referralCode}
                      onChange={(e) =>
                        updateField(
                          "referralCode",
                          e.target.value
                        )
                      }
                      placeholder="Enter referral code"
                      className="w-full rounded-xl border border-white/10 bg-[#050814] py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4020bd] via-[#3520a8] to-[#063d82] py-4 text-sm font-bold shadow-lg transition hover:from-pink-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-gray-600">
                <ShieldCheck
                  size={13}
                  className="text-green-500"
                />
                Your password is securely encrypted.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}