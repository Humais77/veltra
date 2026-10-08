"use client";

import {
  FormEvent,
  Suspense,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import {
  MailCheck,
  Loader2,
  ArrowRight,
} from "lucide-react";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState(
    searchParams.get("email") ?? ""
  );

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] =
    useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [cooldown, setCooldown] =
    useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((value) =>
        value > 0 ? value - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleVerify(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/verify-email",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            code,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to verify email."
        );
        return;
      }

      setMessage(
        "Email verified successfully. Redirecting to login..."
      );

      setTimeout(() => {
        router.push(
          `/login?username=`
        );
      }, 1200);
    } catch {
      setError(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email || cooldown > 0) return;

    setError("");
    setMessage("");
    setResending(true);

    try {
      const response = await fetch(
        "/api/auth/resend-verification",
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
            "Unable to resend code."
        );
        return;
      }

      setMessage(
        "A new verification code has been sent."
      );

      setCooldown(60);
    } catch {
      setError(
        "Unable to connect to the server."
      );
    } finally {
      setResending(false);
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
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-500/10">
              <MailCheck
                size={28}
                className="text-pink-400"
              />
            </div>

            <h1 className="text-3xl font-black">
              Verify your email
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Enter the 6-digit code we sent to
              your email address.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
              {message}
            </div>
          )}

          <form
            onSubmit={handleVerify}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-[#050814] px-4 py-3.5 text-sm outline-none focus:border-pink-500/50"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Verification Code
              </label>

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
                placeholder="000000"
                className="w-full rounded-xl border border-white/10 bg-[#050814] px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] outline-none focus:border-pink-500/50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={
                loading || code.length !== 6
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4020bd] to-[#063d82] py-4 font-bold disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Email
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Didn't receive the code?
            </p>

            <button
              type="button"
              onClick={handleResend}
              disabled={
                resending || cooldown > 0
              }
              className="mt-2 text-sm font-semibold text-pink-400 hover:text-pink-300 disabled:opacity-50"
            >
              {resending
                ? "Sending..."
                : cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : "Resend verification code"}
            </button>
          </div>

          <div className="mt-6 text-center">
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

export default function VerifyEmailPage() {
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
      <VerifyEmailForm />
    </Suspense>
  );
}