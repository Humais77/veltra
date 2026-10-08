"use client";

import {
  Bell,
  Menu,
} from "lucide-react";

export default function DashboardHeader({
  fullName,
  username,
}: {
  fullName: string;
  username: string;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-white/10 bg-[#050814]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div>
        <p className="text-xs text-gray-500">
          Welcome back
        </p>

        <h1 className="text-lg font-bold">
          {fullName}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-xl border border-white/10 bg-white/[0.03] p-3 text-gray-400 hover:text-white">
          <Bell size={19} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-pink-500" />
        </button>

        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold">
            @{username}
          </p>

          <p className="text-xs text-gray-500">
            Member
          </p>
        </div>
      </div>
    </header>
  );
}