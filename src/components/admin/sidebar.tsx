
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BriefcaseBusiness,
  ArrowDownToLine,
  ArrowUpFromLine,
  Receipt,
  Trophy,
  Newspaper,
  Wallet,
  LifeBuoy,
  Menu,
  X,
  LogOut,
  Loader2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const links = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Plans", href: "/admin/plans", icon: CreditCard },
  { label: "Investments", href: "/admin/investments", icon: BriefcaseBusiness },
  { label: "Deposits", href: "/admin/deposits", icon: ArrowDownToLine },
  { label: "Withdrawals", href: "/admin/withdrawals", icon: ArrowUpFromLine },
  { label: "Transactions", href: "/admin/transactions", icon: Receipt },
  { label: "Ranks", href: "/admin/ranks", icon: Trophy },
  { label: "News", href: "/admin/news", icon: Newspaper },
  { label: "Payment Methods", href: "/admin/payment-methods", icon: Wallet },
  { label: "Support", href: "/admin/support", icon: LifeBuoy },
];

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Continue to login even if the request fails.
    } finally {
      setMobileOpen(false);
      router.replace("/login");
      router.refresh();
    }
  }

  function isActive(href: string) {
    return href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex h-[68px] items-center justify-between border-b border-white/[0.08] bg-[#070918]/95 px-4 backdrop-blur-xl lg:hidden sm:px-6">
        <Link href="/admin" className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 via-fuchsia-500 to-violet-700 shadow-lg shadow-fuchsia-900/20">
            <span className="text-lg font-black text-white">V</span>
          </div>
          <div className="min-w-0">
            <p className="text-lg font-extrabold tracking-tight text-white">
              Veltra
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
              Administration
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-gray-200 transition hover:border-pink-400/40 hover:bg-pink-500/10"
        >
          <Menu size={21} />
        </button>
      </header>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 cursor-default bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar drawer / desktop sidebar */}
      <aside
        id="admin-sidebar"
        aria-label="Admin navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(288px,88vw)] flex-col border-r border-white/[0.08] bg-[#090b1d] shadow-2xl shadow-black/30 transition-transform duration-300 ease-out lg:z-30 lg:w-[260px] lg:translate-x-0 lg:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-[84px] shrink-0 items-center justify-between border-b border-white/[0.07] px-5">
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 via-fuchsia-500 to-violet-700 shadow-lg shadow-fuchsia-900/20">
              <span className="text-xl font-black text-white">V</span>
            </div>

            <div>
              <p className="text-xl font-extrabold tracking-tight text-white">
                Veltra
              </p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-pink-300">
                  Admin Panel
                </span>
              </div>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Admin identity */}
        <div className="mx-4 mt-5 flex shrink-0 items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-violet-500/20 text-pink-300">
            <ShieldCheck size={21} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              Administrator
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              Platform management
            </p>
          </div>
          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.4)]" />
        </div>

        {/* Navigation */}
        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-4 pt-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
            Workspace
          </p>

          <div className="space-y-1">
            {links.map(({ label, href, icon: Icon }) => {
              const active = isActive(href);

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`group relative flex min-h-11 items-center gap-3 overflow-hidden rounded-xl px-3.5 py-3 text-[13px] font-medium transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-pink-500/15 to-violet-500/[0.07] text-white shadow-sm"
                      : "text-gray-400 hover:bg-white/[0.045] hover:text-gray-100"
                  }`}
                >
                  {active && (
                    <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-gradient-to-b from-pink-400 to-violet-500" />
                  )}

                  <Icon
                    size={18}
                    strokeWidth={active ? 2.2 : 1.8}
                    className={`shrink-0 transition-colors ${
                      active
                        ? "text-pink-300"
                        : "text-gray-500 group-hover:text-gray-300"
                    }`}
                  />

                  <span className="min-w-0 flex-1">{label}</span>

                  {active && (
                    <ChevronRight
                      size={15}
                      className="shrink-0 text-pink-300"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-white/[0.07] p-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-gray-400 transition hover:bg-red-500/[0.09] hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loggingOut ? (
              <Loader2 size={18} className="shrink-0 animate-spin" />
            ) : (
              <LogOut size={18} className="shrink-0" />
            )}
            <span>{loggingOut ? "Logging out..." : "Logout"}</span>
          </button>

          <p className="mt-3 px-3 text-[10px] text-gray-600">
            Veltra · Secure Administration
          </p>
        </div>
      </aside>
    </>
  );
}
