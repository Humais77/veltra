import React from "react";
import { 
  Cpu, 
  Zap, 
  TrendingUp, 
  Users, 
  Building2, 
  ShieldCheck 
} from "lucide-react";

export default function InfrastructureSection() {
  const features = [
    {
      icon: <Cpu size={24} />,
      title: "Real-time telemetry",
      description: "Every solar plant streams live kWh, panel temperature, and earnings data into your dashboard.",
    },
    {
      icon: <Zap size={24} />,
      title: "Hourly settlement",
      description: "Profits land in your earning wallet 24 times a day — not once a month, not at maturity.",
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Auto-reinvest",
      description: "Turn on one switch and your earnings are automatically invested again for you.",
    },
    {
      icon: <Users size={24} />,
      title: "5-level referral program",
      description: "Invite people to Veltra and earn commission on their investments — up to five levels deep.",
    },
    {
      icon: <Building2 size={24} />,
      title: "Audited PPAs",
      description: "All power-purchase agreements are independently audited. We publish quarterly attestations.",
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Wallet-grade security",
      description: "Hardware-backed sessions, optional 2FA, withdrawal whitelist, and anomaly detection on every payout.",
    },
  ];

  return (
    <section className="w-full bg-[#050814] px-4 py-16 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="mb-12">
          <div className="mb-6 inline-flex items-center rounded-full border border-pink-500/30 bg-pink-500/5 px-3 py-1.5 text-[10px] font-bold tracking-widest text-pink-400 uppercase">
            Engineered to last
          </div>

          <h2 className="text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
            Built like{" "}
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-[#4020bd] bg-clip-text text-transparent">
              infrastructure
            </span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#080b1f] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/30 hover:bg-[#0c102a] hover:shadow-[0_10px_30px_rgba(64,32,189,0.15)]"
            >
              {/* Subtle top-left glow on hover */}
              <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-pink-500/20 blur-[30px] transition-opacity duration-300 group-hover:opacity-100 opacity-0" />

              {/* Icon Container */}
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#4020bd]/20 text-pink-400 shadow-[inset_0_0_15px_rgba(236,72,153,0.1)]">
                {feature.icon}
              </div>

              {/* Text Content */}
              <h3 className="mb-2 text-lg font-bold text-white">
                {feature.title}
              </h3>
              
              <p className="text-sm leading-relaxed text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}