import React from "react";
import Link from "next/link";
import { Mail, Lock, Shield, ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#050814] text-white">
      
      {/* Minimalist Header */}
      <header className="flex w-full items-center justify-between px-6 py-6 md:px-12">
        <Link href="/" className="flex items-center gap-2">
          {/* Logo Icon */}
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-[#4020bd] shadow-[0_0_15px_rgba(236,72,153,0.3)]">
            <div className="h-4 w-4 rounded-full bg-[#050814] opacity-80" />
            <div className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-white" />
          </div>
          <span className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-white">
            SunZee1
          </span>
        </Link>

        <span className="text-[11px] font-medium text-gray-500 md:text-xs">
          Secured by <span className="text-pink-500">sunzee1.com</span>
        </span>
      </header>

      {/* Main Content */}
      <main className="relative flex flex-1 items-center justify-center px-4 py-12 md:px-8 lg:px-12">
        
        {/* Background glow effects */}
        <div className="pointer-events-none absolute -left-20 top-1/4 h-[400px] w-[400px] rounded-full bg-pink-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute -right-20 bottom-1/4 h-[400px] w-[400px] rounded-full bg-[#4020bd]/15 blur-[120px]" />

        <div className="z-10 mx-auto grid w-full max-w-6xl gap-16 lg:grid-cols-2 lg:gap-8 items-center">
          
          {/* Left Column: Welcome Copy & Stats */}
          <div className="flex flex-col items-start max-w-lg">
            <h1 className="mb-4 text-4xl font-black leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
              Welcome to <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">SunZee1.</span>
            </h1>
            
            <p className="mb-12 text-base leading-relaxed text-gray-400 md:text-lg">
              SunZee1 members earn daily profit from real solar power plants across four continents. Login to see your live dashboard.
            </p>

            {/* Stats Row */}
            <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { label: "DAILY PROFIT", value: "+1.62%" },
                { label: "UPTIME", value: "99.94%" },
                { label: "MEMBERS", value: "12.4k" },
              ].map((stat, i) => (
                <div key={i} className="rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-md transition-colors hover:border-pink-500/30 hover:bg-[#0c102a]">
                  <p className="mb-1 text-[9px] font-bold tracking-wider text-gray-500 uppercase">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold text-pink-300">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Login Form Card */}
          <div className="w-full max-w-[480px] justify-self-center lg:justify-self-end">
            <div className="rounded-3xl border border-white/10 bg-[#080b1f]/80 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Welcome back</h2>
                <p className="mt-2 text-sm text-gray-400">Login to your account to continue.</p>
              </div>

              <form className="flex flex-col gap-5">
                
                {/* Email Field */}
                <div>
                  <label 
                    htmlFor="email" 
                    className="mb-2 block text-[10px] font-bold tracking-widest text-gray-400 uppercase"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      placeholder="yourname@email.com"
                      className="w-full rounded-xl border border-white/10 bg-[#050814] py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label 
                      htmlFor="password" 
                      className="text-[10px] font-bold tracking-widest text-gray-400 uppercase"
                    >
                      Password
                    </label>
                    <Link 
                      href="/forgot-password" 
                      className="text-[10px] font-bold tracking-widest text-pink-400 uppercase hover:text-pink-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                      <Lock size={16} />
                    </div>
                    <input
                      type="password"
                      id="password"
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-white/10 bg-[#050814] py-3.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4020bd] via-[#3520a8] to-[#063d82] py-4 text-sm font-bold text-white shadow-[0_4px_20px_rgba(64,32,189,0.4)] transition-all hover:to-pink-600 hover:shadow-[0_4px_30px_rgba(64,32,189,0.6)]"
                >
                  Login
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>
              </form>

              {/* Footer Links */}
              <div className="mt-8 flex flex-col items-center gap-4">
                <p className="text-sm text-gray-400">
                  Don't have an account?{" "}
                  <Link href="/register" className="font-bold text-pink-400 hover:text-pink-300 transition-colors">
                    Register
                  </Link>
                </p>

                <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-600">
                  <Shield size={12} className="text-green-500/70" />
                  End-to-end encrypted · 2FA recommended
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}