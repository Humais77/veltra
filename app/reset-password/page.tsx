"use client";

import {
  FormEvent,
  Suspense,
  useState,
} from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Lock,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState(
    searchParams.get("email") ?? ""
  );

  const [code, setCode] = useState("");
  const [password, setPassword] =
    useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            code,
            password,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to reset password."
        );
        return;
      }

      setMessage(
        "Password reset successfully. Redirecting to login..."
      );

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch {
      setError(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050814] px-4 text-white">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-10 flex items-center justify-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-[#4020bd]">
            <div className="h-4 w-4 rounded-full bg-[#050814]" />
          </div>

          <span className="text-2xl font-bold">
            Veltra
          </span>
        </Link>

        <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-7 shadow-2xl sm:p-9">
          <h1 className="text-3xl font-black">
            Reset password
          </h1>

          <p className="mt-3 text-sm text-gray-400">
            Enter the code sent to your email
            and choose a new password.
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
              {message}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >
            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-[#050814] px-4 py-3.5 text-sm outline-none focus:border-pink-500/50"
              required
            />

            <input
              value={code}
              onChange={(e) =>
                setCode(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6)
                )
              }
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit reset code"
              className="w-full rounded-xl border border-white/10 bg-[#050814] px-4 py-4 text-center text-xl font-bold tracking-[0.4em] outline-none focus:border-pink-500/50"
              required
            />

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="New password"
                className="w-full rounded-xl border border-white/10 bg-[#050814] py-4 pl-11 pr-12 text-sm outline-none focus:border-pink-500/50"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (value) => !value
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Confirm new password"
                className="w-full rounded-xl border border-white/10 bg-[#050814] py-4 pl-11 pr-12 text-sm outline-none focus:border-pink-500/50"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (value) => !value
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#4020bd] to-[#063d82] py-4 font-bold disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="mt-7 text-center">
            <Link
              href="/login"
              className="text-sm text-gray-500 hover:text-white"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#050814] text-white">
          <Loader2
            size={30}
            className="animate-spin"
          />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}