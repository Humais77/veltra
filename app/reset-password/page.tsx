"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2, Eye, EyeOff, ArrowRight, KeyRound, Mail } from "lucide-react";
import AuthLayout from "@/src/components/AuthLayout";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password, confirmPassword }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to reset password.");
        return;
      }

      setMessage("Password reset successfully. Redirecting to login...");
      window.setTimeout(() => router.push("/login"), 1200);
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full rounded-xl border border-white/10 bg-[#050814] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30";

  return (
    <AuthLayout
      eyebrow="Account Recovery"
      title="A fresh"
      accentTitle="start."
      description="Choose a new password to restore access to your Veltra account. Keep your login details private and secure."
      cardTitle="Reset password"
      cardDescription="Enter the code from your email and choose a new password."
      footer={<p className="text-center text-sm text-gray-500">Remember your password? <Link href="/login" className="font-semibold text-pink-400 transition hover:text-pink-300">Back to login</Link></p>}
    >
      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-violet-500/10 bg-violet-500/[0.05] p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
          <KeyRound size={20} />
        </div>
        <p className="text-xs leading-5 text-gray-400">Use the reset code sent to your email. Your new password should be difficult for others to guess.</p>
      </div>

      {error && <div role="alert" className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}
      {message && <div role="status" className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Email address</label>
          <div className="relative">
            <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className={`${inputClass} pl-11`} required />
          </div>
        </div>

        <div>
          <label htmlFor="code" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Reset code</label>
          <input id="code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="6-digit reset code" className="w-full rounded-xl border border-white/10 bg-[#050814] px-4 py-4 text-center text-lg font-bold tracking-[0.35em] text-white placeholder:text-gray-600 outline-none transition focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30" required />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">New password</label>
          <div className="relative">
            <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" placeholder="Enter new password" className={`${inputClass} pr-12`} required />
            <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide new password" : "Show new password"} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white">
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Confirm new password</label>
          <div className="relative">
            <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" placeholder="Re-enter new password" className={`${inputClass} pr-12`} required />
            <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white">
              {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="group flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4020bd] via-[#3520a8] to-[#063d82] py-4 text-sm font-bold shadow-lg transition hover:from-pink-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? <><Loader2 size={18} className="animate-spin" /> Resetting password...</> : <>Reset Password <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></>}
        </button>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#050814] text-white"><Loader2 size={30} className="animate-spin text-pink-400" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
