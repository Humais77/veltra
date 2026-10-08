import React from "react";
import { Leaf, Lock, Globe, Sun } from "lucide-react";

export default function NetworkSection() {
  const solarArrays = [
    {
      name: "Mojave Array NV-12",
      capacity: "86 MW",
      utilization: 92,
    },
    {
      name: "Andalusia Field ES-04",
      capacity: "64 MW",
      utilization: 78,
    },
    {
      name: "Rajasthan Mesh IN-22",
      capacity: "102 MW",
      utilization: 88,
    },
    {
      name: "Atacama Cluster CL-07",
      capacity: "54 MW",
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
            A planet wired for{" "}
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-[#4020bd] bg-clip-text text-transparent">
              sunshine
            </span>
          </h2>

          {/* Description */}
          <p className="mb-10 text-base leading-relaxed text-gray-400 md:text-lg max-w-md">
            We co-own and operate solar arrays across four continents. When the sun sets in one hemisphere, it's already rising on the next. The grid never sleeps.
          </p>

          {/* Features List */}
          <div className="flex flex-col gap-5">
            {[
              { icon: <Leaf size={18} />, text: "4.2 GW combined nameplate capacity" },
              { icon: <Lock size={18} />, text: "PPAs with tier-1 utility offtakers" },
              { icon: <Globe size={18} />, text: "Geographic load-balancing — 24/7 output" },
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

        {/* Right Column: Array Progress Cards */}
        <div className="flex flex-col gap-4">
          {solarArrays.map((array, idx) => (
            <div 
              key={idx}
              className="group flex flex-col justify-center rounded-2xl border border-white/5 bg-[#080b1f] p-4 transition-all hover:bg-[#0c102a] hover:border-pink-500/30 md:p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                
                {/* Array Info */}
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4020bd]/20 text-pink-400">
                    <Sun size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white md:text-base">
                      {array.name}
                    </h3>
                    <p className="mt-0.5 text-[11px] font-bold tracking-widest text-gray-500 uppercase">
                      {array.capacity} · LIVE
                    </p>
                  </div>
                </div>

                {/* Utilization Stats */}
                <div className="text-right">
                  <p className="text-lg font-bold text-white md:text-xl">
                    {array.utilization}%
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
                  style={{ width: `${array.utilization}%` }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}