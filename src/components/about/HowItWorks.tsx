import React from "react";
import Link from "next/link";

export default function HowItWorks() {
  const steps = [
    {
      id: "1",
      title: "You choose an investment plan",
      description: "Each plan sets a minimum and maximum amount, a profit rate and a term. You fund it from your Veltra wallet after a deposit is credited.",
    },
    {
      id: "2",
      title: "Profit is credited hourly",
      description: "Rather than paying out at maturity, the platform credits a share of profit to your earning wallet every hour for the life of the plan.",
    },
    {
      id: "3",
      title: "You withdraw or reinvest",
      description: "Earnings can be withdrawn to your chosen payout method, or reinvested automatically if you turn auto-reinvest on.",
    },
    {
      id: "4",
      title: "Referrals earn commission",
      description: "Members who invite others earn commission across five referral levels, so building a team adds a second stream of income alongside your own plan.",
    },
  ];

  return (
    <section className="w-full px-4 py-12 md:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        
        {/* Section Heading */}
        <h2 className="mb-8 text-3xl font-black tracking-tight text-white md:text-4xl">
          How the platform{" "}
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-[#4020bd] bg-clip-text text-transparent">
            works
          </span>
        </h2>

        {/* Steps List */}
        <div className="mb-8 flex flex-col gap-4">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="flex items-start gap-4 rounded-2xl border border-white/5 bg-[#080b1f] p-5 transition-colors hover:border-pink-500/30 hover:bg-[#0c102a] md:items-center md:p-6"
            >
              {/* Step Number */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-pink-500/30 bg-[#4020bd]/20 text-xs font-bold text-pink-400">
                {step.id}
              </div>
              
              {/* Step Content */}
              <div>
                <h3 className="mb-1 text-base font-bold text-white md:text-lg">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <p className="text-sm text-gray-500">
          A fuller walkthrough of the energy side sits on the{" "}
          <Link href="/" className="font-bold text-pink-400 hover:text-pink-300 transition-colors">
            home page
          </Link>.
        </p>

      </div>
    </section>
  );
}