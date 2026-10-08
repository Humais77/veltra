"use client";

import { useState } from "react";
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
} from "lucide-react";

const links = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Plans",
    href: "/admin/plans",
    icon: CreditCard,
  },
  {
    label: "Investments",
    href: "/admin/investments",
    icon: BriefcaseBusiness,
  },
  {
    label: "Deposits",
    href: "/admin/deposits",
    icon: ArrowDownToLine,
  },
  {
    label: "Withdrawals",
    href: "/admin/withdrawals",
    icon: ArrowUpFromLine,
  },
  {
    label: "Transactions",
    href: "/admin/transactions",
    icon: Receipt,
  },
  {
    label: "Ranks",
    href: "/admin/ranks",
    icon: Trophy,
  },
  {
    label: "News",
    href: "/admin/news",
    icon: Newspaper,
  },
  {
    label: "Payment Methods",
    href: "/admin/payment-methods",
    icon: Wallet,
  },
  {
    label: "Support",
    href: "/admin/support",
    icon: LifeBuoy,
  },
];

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch {
      // even if the network call fails, we still want to send
      // the user back to login so they aren't stuck in the admin panel
    } finally {
      setMobileOpen(false);
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#050814]/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-[#4020bd]">
            <div className="h-3 w-3 rounded-full bg-[#050814]" />
          </div>
          <span className="text-lg font-bold text-white">Veltra</span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg border border-white/10 bg-white/5 p-2 text-white"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — drawer on mobile, fixed on desktop */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-[#080b1f]
          transform transition-transform duration-300 ease-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-30
        `}
      >
        <div className="flex h-full flex-col">
          {/* Logo / close row */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
            <Link
              href="/admin"
              className="flex items-center gap-3"
              onClick={() => setMobileOpen(false)}
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-[#4020bd]">
                <div className="h-3.5 w-3.5 rounded-full bg-[#080b1f]" />
              </div>
              <div>
                <p className="text-base font-bold text-white">Veltra</p>
                <p className="text-[10px] uppercase tracking-wider text-pink-400">
                  Admin
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg border border-white/10 bg-white/5 p-2 text-white lg:hidden"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {links.map(({ label, href, icon: Icon }) => {
              const active =
                href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition
                    ${
                      active
                        ? "bg-pink-500/10 text-pink-300"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer with logout */}
          <div className="border-t border-white/10 px-3 py-4">
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="
                flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
                text-red-400 transition hover:bg-red-500/10 hover:text-red-300
                disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              {loggingOut ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Logging out…</span>
                </>
              ) : (
                <>
                  <LogOut size={18} />
                  <span>Logout</span>
                </>
              )}
            </button>

            <p className="mt-3 px-3 text-[10px] uppercase tracking-wider text-gray-600">
              Veltra Admin Panel
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}