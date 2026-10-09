import Link from "next/link";
import type { ReactNode } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";

type AuthLayoutProps = {
  eyebrow: string;
  title: string;
  accentTitle?: string;
  description: string;
  cardTitle: string;
  cardDescription: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthLayout({
  eyebrow,
  title,
  accentTitle,
  description,
  cardTitle,
  cardDescription,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050814] text-white">
      <header className="relative z-10 flex items-center justify-between px-4 py-5 sm:px-6 md:px-12 md:py-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-[#4020bd] shadow-[0_0_20px_rgba(236,72,153,0.25)]">
            <div className="h-4 w-4 rounded-full bg-[#050814]" />
            <div className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-white" />
          </div>
          <span className="text-xl font-bold tracking-wide">Veltra</span>
        </Link>
        <Link
          href="/"
          className="text-xs text-gray-500 transition hover:text-white sm:text-sm"
        >
          Back to home
        </Link>
      </header>

      <section className="relative px-4 pb-10 pt-4 sm:px-6 sm:pb-14 md:px-8 lg:px-12 lg:pt-6">
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-16 h-[360px] w-[360px] rounded-full bg-pink-500/[0.09] blur-[130px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-40 h-[380px] w-[380px] rounded-full bg-violet-600/[0.09] blur-[140px]" />

        <div className="relative mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="hidden pt-12 lg:block xl:pt-16">
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-pink-400">
              <Sparkles size={14} />
              {eyebrow}
            </p>
            <h1 className="text-5xl font-black leading-tight xl:text-6xl">
              {title}
              {accentTitle && (
                <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  {accentTitle}
                </span>
              )}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-400">
              {description}
            </p>

            <div className="mt-12 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 xl:p-5">
                <p className="text-[10px] font-semibold tracking-wider text-gray-500">PLANS</p>
                <p className="mt-2 text-xl font-bold">Flexible</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 xl:p-5">
                <p className="text-[10px] font-semibold tracking-wider text-gray-500">ACCOUNT</p>
                <p className="mt-2 text-xl font-bold text-pink-400">Secure</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 xl:p-5">
                <p className="text-[10px] font-semibold tracking-wider text-gray-500">SUPPORT</p>
                <p className="mt-2 text-xl font-bold">Help center</p>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl">
            <div className="rounded-3xl border border-white/10 bg-[#080b1f]/90 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8">
              <div className="mb-7">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-pink-400 lg:hidden">
                  {eyebrow}
                </p>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {cardTitle}
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                  {cardDescription}
                </p>
              </div>

              {children}

              <div className="mt-7 flex items-center justify-center gap-2 text-[10px] text-gray-600">
                <ShieldCheck size={13} className="text-emerald-500" />
                Secure account access
              </div>
              {footer && <div className="mt-6">{footer}</div>}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
