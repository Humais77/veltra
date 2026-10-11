import React from "react";
import { Leaf, Lock, Globe, TrendingUp } from "lucide-react";

export default function NetworkSection() {
  const markets = [
    {
      name: "Growth Portfolio A-12",
      capacity: "86% APY",
      utilization: 92,
    },
    {
      name: "Growth Portfolio B-04",
      capacity: "64% APY",
      utilization: 78,
    },
    {
      name: "Growth Portfolio C-22",
      capacity: "102% APY",
      utilization: 88,
    },
    {
      name: "Growth Portfolio D-07",
      capacity: "54% APY",
      utilization: 71,
    },
  ];

  return (
    <section className="w-full bg-[#050814] px-4 py-16 md:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16 items-center">
        
        {/* Left Column: Content */}
        <div className="flex flex-col items-start">
          
          {/* Badge */}
          <div className="mb-6 rounded-full border border-pink-500/30 bg-pink-500/5 px-3 py-1.5 text-[10px] font-bold tracking-widest text-pink-400 uppercase">
            Network
          </div>

          {/* Heading */}
          <h2 className="mb-6 text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
            A world wired for{" "}
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-[#4020bd] bg-clip-text text-transparent">
              wealth
            </span>
          </h2>

          {/* Description */}
          <p className="mb-10 text-base leading-relaxed text-gray-400 md:text-lg max-w-md">
            We operate growth portfolios across multiple markets worldwide. When one market sleeps, another wakes. Your money never stops working.
          </p>

          {/* Features List */}
          <div className="flex flex-col gap-5">
            {[
              { icon: <Leaf size={18} />, text: "Diversified across 4 global markets" },
              { icon: <Lock size={18} />, text: "Institutional-grade custody and compliance" },
              { icon: <Globe size={18} />, text: "Geographic load-balancing — 24/7 returns" },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-pink-500/20 bg-pink-500/10 text-pink-400 shadow-[inset_0_0_10px_rgba(236,72,153,0.1)]">
                  {feature.icon}
                </div>
                <span className="text-sm font-medium text-gray-300 md:text-base">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Portfolio Progress Cards */}
        <div className="flex flex-col gap-4">
          {markets.map((market, idx) => (
            <div 
              key={idx}
              className="group flex flex-col justify-center rounded-2xl border border-white/5 bg-[#080b1f] p-4 transition-all hover:bg-[#0c102a] hover:border-pink-500/30 md:p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                
                {/* Portfolio Info */}
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4020bd]/20 text-pink-400">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white md:text-base">
                      {market.name}
                    </h3>
                    <p className="mt-0.5 text-[11px] font-bold tracking-widest text-gray-500 uppercase">
                      {market.capacity} · LIVE
                    </p>
                  </div>
                </div>

                {/* Utilization Stats */}
                <div className="text-right">
                  <p className="text-lg font-bold text-white md:text-xl">
                    {market.utilization}%
                  </p>
                  <p className="text-[9px] font-bold tracking-widest text-gray-500 uppercase">
                    Utilization
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-[#063d82] shadow-[0_0_10px_rgba(236,72,153,0.4)] transition-all duration-1000 ease-out"
                  style={{ width: `${market.utilization}%` }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}