"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Mail, Loader2, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to process request."
        );
        return;
      }

      setMessage(
        "If an account exists with this email, a reset code has been sent."
      );
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
            Forgot password?
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            Enter your email and we'll send you
            a 6-digit password reset code.
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
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-[#050814] py-4 pl-11 pr-4 text-sm outline-none focus:border-pink-500/50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4020bd] to-[#063d82] py-4 font-bold disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Code
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-7 text-center">
            <Link
              href="/reset-password"
              className="text-sm font-semibold text-pink-400"
            >
              Already have a reset code?
            </Link>
          </div>

          <div className="mt-4 text-center">
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