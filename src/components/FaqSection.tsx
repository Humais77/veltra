"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I download the Veltra app?",
      answer: "You can download the Veltra app directly from our official website or through the App Store and Google Play Store. Simply search for 'Veltra' and click install.",
    },
    {
      question: "How do I log in to Veltra?",
      answer: "Click the 'Login' button in the top right corner of our website or open the app. Enter your registered email address and password to access your dashboard.",
    },
    {
      question: "Is Veltra real or fake?",
      answer: "Veltra is a verified, fully audited platform. We co-own and operate physical solar arrays globally and our PPAs are independently audited to ensure complete transparency.",
    },
    {
      question: "Is Veltra halal?",
      answer: "Yes. Our investment model is based on actual physical assets (solar panels) generating real-world utility (electricity). Returns are generated from legitimate commerce, not interest (riba).",
    },
    {
      question: "Can I use Veltra in Pakistan?",
      answer: "Yes, Veltra is accessible globally, including in Pakistan. You can register, invest, and withdraw earnings seamlessly using our supported payment gateways.",
    },
    {
      question: "How do I deposit and withdraw?",
      answer: "We support multiple secure payment methods including local bank transfers and major crypto stablecoins. Withdrawals are processed quickly and can be tracked directly from your wallet dashboard.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-[#050814] px-4 py-16 md:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center">
        
        {/* Badge */}
        <div className="mb-6 rounded-full border border-pink-500/30 bg-pink-500/5 px-3 py-1.5 text-[10px] font-bold tracking-widest text-pink-400 uppercase">
          Knowledge Base
        </div>

        {/* Heading */}
        <h2 className="mb-12 text-center text-4xl font-black tracking-tight text-white md:text-5xl">
          Questions,{" "}
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-[#4020bd] bg-clip-text text-transparent">
            answered
          </span>
        </h2>

        {/* FAQ Accordion List */}
        <div className="w-full space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div 
                key={index}
                className={`group overflow-hidden rounded-xl border transition-all duration-300 ${
                  isOpen 
                    ? "border-pink-500/50 bg-[#0c102a]" 
                    : "border-white/5 bg-[#080b1f] hover:border-pink-500/30 hover:bg-[#0c102a]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-5 text-left focus:outline-none"
                >
                  <span className="font-bold text-white md:text-lg">
                    {faq.question}
                  </span>
                  
                  <div className={`ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    isOpen 
                      ? "border-pink-400 bg-pink-500/20 text-pink-400 rotate-180" 
                      : "border-gray-600 text-gray-500 group-hover:border-pink-500/50 group-hover:text-pink-400"
                  }`}>
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </div>
                </button>

                {/* Animated Dropdown Content */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-gray-400 md:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}