"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, User, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import AuthLayout from "@/src/components/AuthLayout";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState(searchParams.get("username") ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    setRegistered(searchParams.get("registered") === "1");
  }, [searchParams]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === "EMAIL_NOT_VERIFIED") {
          router.push(`/verify-email?email=${encodeURIComponent(data.email ?? "")}`);
          return;
        }
        setError(data.error || "Invalid username or password.");
        return;
      }

      router.replace(data.role === "ADMIN" ? "/admin" : "/dashboard");
      router.refresh();
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-[#050814] py-4 pl-11 pr-4 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30";

  return (
    <AuthLayout
      eyebrow="Welcome Back"
      title="Good to see"
      accentTitle="you again."
      description="Sign in to securely access your Veltra account, manage your dashboard, and keep track of your activity."
      cardTitle="Welcome back"
      cardDescription="Enter your login details to access your account."
      footer={
        <p className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-pink-400 transition hover:text-pink-300">
            Create account
          </Link>
        </p>
      }
    >
      {registered && (
        <div role="status" className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          Account created successfully. Please log in.
        </div>
      )}
      {error && (
        <div role="alert" className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="username" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Username</label>
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              className={inputClass}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              className={`${inputClass} pr-12`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="mt-3 text-right">
            <Link href="/forgot-password" className="text-xs font-medium text-pink-400 transition hover:text-pink-300">
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4020bd] via-[#3520a8] to-[#063d82] py-4 text-sm font-bold shadow-lg shadow-violet-950/20 transition hover:from-pink-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : <>Login <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></>}
        </button>
      </form>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#050814] text-white"><Loader2 className="animate-spin text-pink-400" size={30} /></div>}>
      <LoginForm />
    </Suspense>
  );
}
