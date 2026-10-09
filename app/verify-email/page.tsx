"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MailCheck, Loader2, ArrowRight, Mail } from "lucide-react";
import AuthLayout from "@/src/components/AuthLayout";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to verify email.");
        return;
      }

      setMessage("Email verified successfully. Redirecting to login...");
      window.setTimeout(() => router.push("/login"), 1200);
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email || cooldown > 0 || resending) return;
    setError("");
    setMessage("");
    setResending(true);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to resend code.");
        return;
      }

      setMessage("A new verification code has been sent.");
      setCooldown(60);
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setResending(false);
    }
  }

  const inputClass = "w-full rounded-xl border border-white/10 bg-[#050814] px-4 py-3.5 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30";

  return (
    <AuthLayout
      eyebrow="Email Verification"
      title="One more"
      accentTitle="step."
      description="Confirm your email address to finish securing your Veltra account and continue to your dashboard."
      cardTitle="Verify your email"
      cardDescription="Enter the 6-digit verification code sent to your email address."
      footer={<p className="text-center text-sm text-gray-500">Already verified? <Link href="/login" className="font-semibold text-pink-400 hover:text-pink-300">Back to login</Link></p>}
    >
      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-pink-500/10 bg-pink-500/[0.05] p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/10 text-pink-300">
          <MailCheck size={21} />
        </div>
        <p className="text-xs leading-5 text-gray-400">Check your inbox and enter the code below. If you don&apos;t see it, check your spam folder.</p>
      </div>

      {error && <div role="alert" className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
      {message && <div role="status" className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</div>}

      <form onSubmit={handleVerify} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Email address</label>
          <div className="relative">
            <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className={`${inputClass} pl-11`} required />
          </div>
        </div>

        <div>
          <label htmlFor="code" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Verification code</label>
          <input
            id="code"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            className="w-full rounded-xl border border-white/10 bg-[#050814] px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] text-white placeholder:text-gray-700 outline-none transition focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30"
            required
          />
        </div>

        <button type="submit" disabled={loading || code.length !== 6} className="group flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4020bd] via-[#3520a8] to-[#063d82] py-4 text-sm font-bold shadow-lg transition hover:from-pink-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? <><Loader2 size={18} className="animate-spin" /> Verifying...</> : <>Verify Email <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></>}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">Didn&apos;t receive the code?</p>
        <button type="button" onClick={handleResend} disabled={resending || cooldown > 0 || !email} className="mt-2 text-sm font-semibold text-pink-400 transition hover:text-pink-300 disabled:cursor-not-allowed disabled:opacity-50">
          {resending ? "Sending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend verification code"}
        </button>
      </div>
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#050814] text-white"><Loader2 size={30} className="animate-spin text-pink-400" /></div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
