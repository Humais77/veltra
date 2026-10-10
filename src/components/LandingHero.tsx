import React from "react";
import { 
  Sun, 
  ArrowRight, 
  LogIn, 
  ShieldCheck, 
  Activity, 
  Zap 
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#050814] px-4 py-16 md:px-8 lg:px-12 lg:py-24">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4020bd]/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 translate-x-1/3 rounded-full bg-pink-600/10 blur-[100px]" />

      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-8 items-center relative z-10">
        
        {/* Left Column: Content */}
        <div className="flex flex-col items-start max-w-xl">
          
          {/* Live Badge */}
          <div className="mb-6 flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/5 px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-pink-400 animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest text-pink-400 uppercase">
              Live • Solar Powered
            </span>
          </div>

          {/* Heading */}
          <h1 className="mb-4 text-5xl font-black leading-[1.1] tracking-tight text-white md:text-6xl lg:text-7xl">
            Earn daily profit <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              from sunlight.
            </span>
          </h1>

          {/* Description */}
          <p className="mb-8 text-base leading-relaxed text-gray-400 md:text-lg">
            Veltra is a solar energy investment platform. Invest in real solar
            power plants, watch your money work in real-time, and earn profit
            from clean energy every day.{" "}
            <span className="font-medium text-pink-400">
              Zero emissions. Infinite supply.
            </span>
          </p>

          {/* Action Buttons */}
          <div className="mb-10 flex flex-wrap items-center gap-4">
            <button className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4020bd] via-[#3520a8] to-[#063d82] px-6 py-3.5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(64,32,189,0.4)] transition-all hover:scale-105 hover:shadow-[0_4px_30px_rgba(64,32,189,0.6)] hover:to-pink-600">
              <Sun size={18} />
              Register now
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>

            <button className="flex items-center gap-2 rounded-xl border border-[#4020bd]/50 bg-white/5 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-pink-500/50">
              <LogIn size={18} />
              Login
            </button>
          </div>

          {/* Feature List */}
          <div className="mb-10 flex flex-wrap items-center gap-6 text-[11px] font-medium text-gray-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-pink-400" />
              <span>ISO 27001 secured cells</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity size={14} className="text-purple-400" />
              <span>Real-time PV telemetry</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap size={14} className="text-indigo-400" />
              <span>Settled hourly on-chain</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "KWH GENERATED", value: "1,842,337" },
              { label: "ACTIVE MEMBERS", value: "12,408" },
              { label: "AVG. DAILY PROFIT", value: "1.62%" },
              { label: "ENERGY UPTIME", value: "99.94%" },
            ].map((stat, i) => (
              <div key={i} className="rounded-xl border border-white/5 bg-white/5 p-3 backdrop-blur-md">
                <p className="mb-1 text-[9px] font-bold tracking-wider text-gray-500 uppercase">
                  {stat.label}
                </p>
                <p className="text-lg font-bold text-pink-300">{stat.value}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Dashboard Visual */}
        <div className="relative w-full max-w-[600px] justify-self-end rounded-2xl border border-white/10 bg-[#080b1f]/80 p-2 shadow-2xl backdrop-blur-xl md:p-4">
          
          {/* Top Bar */}
          <div className="mb-4 flex items-center justify-between px-2 pt-2 text-[10px] font-bold tracking-widest text-gray-500">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-pink-500" />
              <span>ARRAY-NM-12 · LIVE</span>
            </div>
            <span>2026-10-07</span>
          </div>

          {/* Graph Section */}
          <div className="relative mb-3 overflow-hidden rounded-xl border border-white/5 bg-[#0c102a] p-4 h-48 flex flex-col justify-between">
            <div className="flex justify-between relative z-10">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Today's Yield</p>
                <p className="text-3xl font-black text-pink-400 mt-1">+$184.20</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Power</p>
                <p className="text-lg font-bold text-purple-400 mt-1">4.86 kW</p>
              </div>
            </div>

            {/* Mocked SVG Chart line */}
            <svg className="absolute bottom-0 left-0 w-full h-[60%] preserve-3d" viewBox="0 0 400 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path 
                d="M 0 80 Q 100 60 180 70 T 300 20 T 400 30 L 400 100 L 0 100 Z" 
                fill="url(#chartGradient)" 
              />
              <path 
                d="M 0 80 Q 100 60 180 70 T 300 20 T 400 30" 
                fill="none" 
                stroke="#d8b4fe" 
                strokeWidth="2" 
              />
              {/* Glowing dot on the line */}
              <circle cx="300" cy="20" r="4" fill="#fbcfe8" className="animate-pulse shadow-[0_0_10px_#fbcfe8]" />
            </svg>
          </div>

          {/* Solar Panel Grid */}
          <div className="grid grid-cols-8 gap-1 p-2 rounded-xl bg-[#060814]">
            {Array.from({ length: 24 }).map((_, i) => (
              <div 
                key={i} 
                className="aspect-[4/3] rounded-sm border border-[#2a245c] bg-[#11163b] shadow-[inset_0_0_8px_rgba(0,0,0,0.5)] transition-colors duration-500 hover:bg-[#1f2666]"
              />
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="mt-4 flex items-center justify-between px-2 pb-1 text-[10px] font-bold tracking-widest text-gray-500">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-purple-500" />
              <span>INVERTERS SYNC</span>
            </div>
            <div className="flex gap-4">
              <span>H 21.8%</span>
              <span>34°C</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}