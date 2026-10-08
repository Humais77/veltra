import React from "react";
import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";

export default function LandingHeader() {
  return (
    <header className="w-full bg-[#050814] px-4 py-4 md:px-8 lg:px-12 border-b border-white/5">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          {/* Logo Icon Placeholder (Blush/Purple gradient) */}
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-[#4020bd] shadow-[0_0_15px_rgba(236,72,153,0.3)]">
            <div className="h-4 w-4 rounded-full bg-[#050814] opacity-80" />
            <div className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-white" />
          </div>
          
          <span className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-white">
            SunZee1
          </span>
        </Link>

        {/* Center: Navigation Links (Hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            ["How it works", "#how-it-works"],
            ["Get the app", "#get-app"],
            ["About", "/about"],
            ["Network", "#network"],
            ["FAQ", "#faq"],
          ].map(([title, url]) => (
            <Link
              key={title}
              href={url}
              className="text-sm font-medium text-gray-300 transition-colors hover:text-pink-400"
            >
              {title}
            </Link>
          ))}
        </nav>

        {/* Right: Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10 hover:border-white/20"
          >
            Login
          </Link>
          
          <Link
            href="/register"
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4020bd] via-[#3520a8] to-[#063d82] hover:to-pink-600 px-5 py-2 text-sm font-medium text-white shadow-[0_4px_15px_rgba(64,32,189,0.3)] transition-all hover:scale-105"
          >
            Register 
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="flex items-center text-gray-300 md:hidden hover:text-white">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}