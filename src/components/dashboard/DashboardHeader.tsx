// src/components/dashboard/DashboardHeader.tsx
import React from "react";

interface DashboardHeaderProps {
  userName: string;
  pageTitle?: string; // Optional: defaults to "Welcome, {userName}"
  subtitle?: string;  // Optional: defaults to "Your account overview — live."
  isOnline?: boolean;
}

export default function DashboardHeader({
  userName,
  pageTitle,
  subtitle = "Your account overview — live.",
  isOnline = true,
}: DashboardHeaderProps) {
  // Use provided pageTitle or fallback to the welcome message
  const displayTitle = pageTitle || `Welcome, ${userName}`;

  return (
    <div className="border-b border-white/10 pb-6 mb-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            {displayTitle}
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-pink-500/30 bg-[#080b1f] px-4 py-2 shadow-[0_0_10px_rgba(236,72,153,0.1)]">
          <div
            className={`h-2 w-2 rounded-full ${
              isOnline ? "animate-pulse bg-pink-400" : "bg-gray-500"
            }`}
          />
          <span
            className={`text-[10px] font-bold tracking-widest uppercase ${
              isOnline ? "text-pink-400" : "text-gray-500"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>
    </div>
  );
}