"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  WalletCards,
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  Trophy,
  UserCircle,
  Shield,
  Newspaper,
  LifeBuoy,
  LogOut,
  X,
} from "lucide-react";

import { useState } from "react";

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Plans",
    href: "/dashboard/plans",
    icon: WalletCards,
  },
  {
    label: "My-Investments",
    href: "/dashboard/investments",
    icon: WalletCards,
  },
  {
    label: "Deposit",
    href: "/dashboard/deposit",
    icon: ArrowDownToLine,
  },
  {
    label: "Withdraw",
    href: "/dashboard/withdraw",
    icon: ArrowUpFromLine,
  },
  {
    label: "Referrals",
    href: "/dashboard/referrals",
    icon: Users,
  },
  {
    label: "Ranks",
    href: "/dashboard/ranks",
    icon: Trophy,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: UserCircle,
  },
  {
    label: "Security",
    href: "/dashboard/security",
    icon: Shield,
  },
  {
    label: "News",
    href: "/dashboard/news",
    icon: Newspaper,
  },
  {
    label: "Support",
    href: "/dashboard/support",
    icon: LifeBuoy,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.replace("/login");
    router.refresh();
  }

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-white/10 bg-[#080b1f]">
      <div className="flex h-20 items-center border-b border-white/10 px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-[#4020bd]">
            <div className="h-4 w-4 rounded-full bg-[#080b1f]" />
          </div>

          <span className="text-xl font-bold">
            Veltra
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(
              `${item.href}/`
            );

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() =>
                setMobileOpen(false)
              }
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-pink-500/10 text-pink-400"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={19} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        {sidebar}
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="h-full"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {sidebar}
          </div>
        </div>
      )}

      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-5 left-5 z-30 rounded-full bg-pink-500 p-4 text-white shadow-lg lg:hidden"
        aria-label="Open menu"
      >
        <span className="text-lg">☰</span>
      </button>
    </>
  );
}