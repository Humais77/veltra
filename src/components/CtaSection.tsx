import React from "react";
import { Sun } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="w-full bg-[#050814] px-4 py-16 md:px-8 lg:px-12 lg:pb-24">
      <div className="mx-auto max-w-7xl">
        
        {/* CTA Banner Container */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#080b1f] p-8 shadow-2xl md:p-12 lg:p-16">
          
          {/* Ambient Background Glows */}
          <div className="pointer-events-none absolute -left-20 top-0 h-[300px] w-[300px] rounded-full bg-pink-500/10 blur-[100px]" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-[300px] w-[300px] rounded-full bg-[#4020bd]/20 blur-[100px]" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            
            {/* Left: Text Content */}
            <div className="max-w-2xl">
              <h2 className="mb-4 text-3xl font-black tracking-tight text-white md:text-4xl lg:text-5xl">
                The sun is up.{" "}
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-[#4020bd] bg-clip-text text-transparent">
                  The grid is waiting.
                </span>
              </h2>
              <p className="text-base text-gray-400 md:text-lg">
                Join 12,000+ members already earning from real solar power. Registration takes under a minute.
              </p>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex shrink-0 flex-wrap items-center gap-4">
              <button className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4020bd] via-[#3520a8] to-[#063d82] px-8 py-4 text-sm font-bold text-white shadow-[0_4px_20px_rgba(64,32,189,0.4)] transition-all hover:scale-105 hover:shadow-[0_4px_30px_rgba(64,32,189,0.6)] hover:to-pink-600">
                <Sun size={18} />
                Register now
              </button>
              
              <button className="flex items-center gap-2 rounded-xl border border-[#4020bd]/50 bg-white/5 px-8 py-4 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-pink-500/50">
                Login
              </button>
            </div>

          </div>
        </div>
        
      </div>
    </section>
  );
}