"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState(
    searchParams.get("username") ?? ""
  );

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [registered, setRegistered] =
    useState(false);

  useEffect(() => {
    if (searchParams.get("registered") === "1") {
      setRegistered(true);
    }
  }, [searchParams]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Invalid username or password."
        );
        return;
      }

      if (data.role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }

      router.refresh();
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
      <div className="pointer-events-none absolute left-0 top-1/4 h-[400px] w-[400px] rounded-full bg-pink-500/10 blur-[130px]" />

      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-10 flex items-center justify-center gap-3"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-[#4020bd]">
            <div className="h-4 w-4 rounded-full bg-[#050814]" />
          </div>

          <span className="text-2xl font-bold">
            Veltra
          </span>
        </Link>

        <div className="rounded-3xl border border-white/10 bg-[#080b1f]/90 p-7 shadow-2xl sm:p-9">
          <div className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-pink-400">
              Welcome Back
            </p>

            <h1 className="text-3xl font-black">
              Login
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Access your account dashboard.
            </p>
          </div>

          {registered && (
            <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
              Account created successfully.
              Please login.
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Username
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  placeholder="Enter username"
                  autoComplete="username"
                  className="w-full rounded-xl border border-white/10 bg-[#050814] py-4 pl-11 pr-4 text-sm outline-none transition focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                Password
              </label>

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
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/10 bg-[#050814] py-4 pl-11 pr-12 text-sm outline-none transition focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30"
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
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4020bd] to-[#063d82] py-4 font-bold shadow-lg transition hover:from-pink-600 hover:to-purple-700 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Signing in...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          <div className="mt-7 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?
              <Link
                href="/register"
                className="ml-1 font-semibold text-pink-400 hover:text-pink-300"
              >
                Register
              </Link>
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-gray-600">
            <ShieldCheck
              size={13}
              className="text-green-500"
            />
            Secure HTTP-only session
          </div>
        </div>
      </div>
    </main>
  );
}