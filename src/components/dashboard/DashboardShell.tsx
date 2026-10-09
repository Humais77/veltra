"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import DashboardSidebar from "@/src/components/dashboard/DashboardSidebar";

type DashboardShellProps = {
    children: React.ReactNode;
    user: {
        fullName: string | null;
        email: string | null;
    };
};

export default function DashboardShell({
    children,
    user,
}: DashboardShellProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#050814] text-white">
            {/* Sidebar: desktop + mobile drawer */}
            <DashboardSidebar
                user={user}
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />

            <div className="lg:pl-72">
                {/* Top header */}
                <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-white/10 bg-[#050814]/95 px-4 py-4 backdrop-blur sm:px-6 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileOpen((open) => !open)}
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileOpen}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#080b1f] text-white transition hover:border-pink-500/40 hover:text-pink-400"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>

                    <span className="text-xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-white">
                        Veltra
                    </span>
                </header>

                <main className="min-h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>

    );
}