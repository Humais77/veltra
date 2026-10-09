import React from "react";
import { Sun, Zap, Network, Wallet } from "lucide-react";

export default function ProtocolFlow() {
  const steps = [
    {
      id: "01",
      step: "STEP 1/4",
      title: "Photon capture",
      description: "Sunlight strikes monocrystalline cells across our deployed solar arrays in Nevada, Andalusia, and Rajasthan.",
      icon: <Sun size={24} />,
    },
    {
      id: "02",
      step: "STEP 2/4",
      title: "Convert & store",
      description: "Inverters route DC into grid-tied power and lithium-iron banks, smoothing supply 24/7.",
      icon: <Zap size={24} />,
    },
    {
      id: "03",
      step: "STEP 3/4",
      title: "Profit to members",
      description: "Revenue from electricity sales is shared with Veltra members every hour, based on investment size.",
      icon: <Network size={24} />,
    },
    {
      id: "04",
      step: "STEP 4/4",
      title: "Withdraw or reinvest",
      description: "Take your earnings out to your wallet, or reinvest them to grow your daily profit.",
      icon: <Wallet size={24} />,
    },
  ];

  return (
    <section className="w-full bg-[#050814] px-4 py-16 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="mb-16 max-w-2xl">
          <div className="mb-6 inline-flex items-center rounded-full border border-pink-500/30 bg-pink-500/5 px-3 py-1.5">
            <span className="text-[10px] font-bold tracking-widest text-pink-400 uppercase">
              Protocol Flow
            </span>
          </div>

          <h2 className="mb-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            From photon to{" "}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              payout
            </span>
          </h2>

          <p className="text-base leading-relaxed text-gray-400 md:text-lg">
            Every kilowatt-hour generated is metered, audited, and converted into profit. Here's
            what happens between sunrise and your wallet.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Connecting Line (Hidden on smaller screens) */}
          <div className="absolute left-0 top-[40px] hidden h-[1px] w-full bg-gradient-to-r from-transparent via-[#4020bd]/50 to-transparent lg:block" />

          {steps.map((item, index) => (
            <div 
              key={index} 
              className="group relative z-10 rounded-2xl border border-white/5 bg-[#080b1f] p-6 shadow-xl transition-all hover:-translate-y-1 hover:border-pink-500/30 hover:bg-[#0c102a]"
            >
              {/* Glowing Top Left Corner Indicator */}
              <div className="absolute -left-[1px] -top-[1px] h-12 w-12 rounded-tl-2xl bg-gradient-to-br from-pink-500 to-transparent opacity-30 blur-[2px] transition-opacity group-hover:opacity-60" />

              <div className="mb-8 flex items-start justify-between">
                {/* Icon Box */}
                <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-[#4020bd]/50 bg-[#4020bd]/20 text-pink-400 shadow-[0_0_15px_rgba(64,32,189,0.2)]">
                  {item.icon}
                  
                  {/* Number Badge */}
                  <div className="absolute -bottom-2 -right-2 flex h-5 w-5 items-center justify-center rounded bg-[#050814] border border-pink-500/40 text-[9px] font-bold text-pink-300">
                    {item.id}
                  </div>
                </div>

                {/* Step Counter */}
                <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase mt-2">
                  {item.step}
                </span>
              </div>

              {/* Content */}
              <h3 className="mb-3 text-lg font-bold text-white">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-400">
                {item.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}