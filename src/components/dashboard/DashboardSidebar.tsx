"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import {
  LayoutDashboard,
  LineChart,
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  Trophy,
  UserCircle,
  Shield,
  Newspaper,
  LifeBuoy,
  LogOut,
  History,
  Sun,
  Gift,
  ChevronRight,
} from "lucide-react";

// Categorized Navigation matching the new image layout
const navigationGroups = [
  {
    title: "MAIN",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Plans", href: "/dashboard/plans", icon: LineChart },
      { label: "My Investments", href: "/dashboard/investments", icon: Sun },
      { label: "Transactions", href: "/dashboard/transactions", icon: History },
    ],
  },
  {
    title: "WALLET",
    items: [
      { label: "Deposit", href: "/dashboard/deposit", icon: ArrowDownToLine },
      { label: "Withdraw", href: "/dashboard/withdrawals", icon: ArrowUpFromLine },
    ],
  },
  {
    title: "NETWORK",
    items: [
      { label: "Referrals", href: "/dashboard/referrals", icon: Users },
      { label: "Referral Plans", href: "/dashboard/referral-plans", icon: Gift },
      { label: "Ranks", href: "/dashboard/ranks", icon: Trophy },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { label: "Profile", href: "/dashboard/profile", icon: UserCircle },
      { label: "Security", href: "/dashboard/security", icon: Shield },
      { label: "News", href: "/dashboard/news", icon: Newspaper },
      { label: "Support", href: "/dashboard/support", icon: LifeBuoy },
    ],
  },
];

export default function DashboardSidebar({ 
  user 
}: { 
  user?: { fullName: string; email?: string } 
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.replace("/login");
    router.refresh();
  }

  const sidebar = (
    <aside className="flex h-full w-72 flex-col bg-[#050814] text-white">
      
      {/* Brand Header */}
      <div className="flex h-20 items-center px-8 pt-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 transition-transform hover:scale-105"
          onClick={() => setMobileOpen(false)}
        >
          {/* Logo Icon */}
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-[#4020bd] shadow-[0_0_15px_rgba(236,72,153,0.3)]">
            <div className="h-4 w-4 rounded-full bg-[#050814]" />
            <div className="absolute right-1 top-1 h-1 w-1 rounded-full bg-white" />
          </div>
          <span className="text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-white">
            SunZee1
          </span>
        </Link>
      </div>

      {/* Profile Card (Moved to Top) */}
      <div className="px-4 mt-6 mb-2">
        <Link 
          href="/dashboard/profile"
          onClick={() => setMobileOpen(false)}
          className="group flex items-center justify-between rounded-2xl border border-white/5 bg-[#080b1f] p-3 shadow-lg transition-all hover:border-pink-500/30 hover:bg-[#0c102a]"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-[#4020bd] text-sm font-bold text-white shadow-[0_0_10px_rgba(236,72,153,0.3)]">
              {user?.fullName?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex flex-col truncate">
              <span className="truncate text-sm font-bold text-white uppercase tracking-wide">
                {user?.fullName || "SunZee1 User"}
              </span>
              <span className="truncate text-[10px] font-medium text-gray-500">
                {user?.email || "Investor Account"}
              </span>
            </div>
          </div>
          <ChevronRight size={16} className="shrink-0 text-gray-500 transition-colors group-hover:text-pink-400" />
        </Link>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
        {navigationGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="mb-6 last:mb-0">
            <h4 className="mb-3 pl-4 text-[10px] font-bold tracking-widest text-gray-500 uppercase">
              {group.title}
            </h4>
            
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`group relative flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        active
                          ? "bg-gradient-to-r from-pink-500/10 to-[#4020bd]/10 text-pink-400"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {/* Active Right Border Indicator */}
                      {active && (
                        <div className="absolute right-0 top-1/2 h-2/3 w-1 -translate-y-1/2 rounded-l-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
                      )}

                      <Icon
                        size={18}
                        className={`transition-colors duration-200 ${
                          active ? "text-pink-400" : "text-gray-500 group-hover:text-pink-400"
                        }`}
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={18} className="text-gray-500 transition-colors group-hover:text-red-400" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/5 bg-[#050814] lg:block">
        {sidebar}
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#050814]/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="h-full w-72 shadow-2xl transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebar}
          </div>
        </div>
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-[#4020bd] text-white shadow-[0_4px_20px_rgba(236,72,153,0.4)] lg:hidden"
        aria-label="Open menu"
      >
        <LayoutDashboard size={24} />
      </button>
    </>
  );
}