import React from "react";

export default function AboutHero() {
  return (
    <section className="w-full px-4 pt-24 pb-12 md:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        
        {/* Badge */}
        <div className="mb-6 inline-flex items-center rounded-full border border-pink-500/30 bg-pink-500/5 px-3 py-1.5">
          <span className="text-[10px] font-bold tracking-widest text-pink-400 uppercase">
            About Us
          </span>
        </div>

        {/* Heading */}
        <h1 className="mb-6 text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
          About{" "}
          <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-[#4020bd] bg-clip-text text-transparent">
            Veltra
          </span>
        </h1>

        {/* Intro Text */}
        <p className="text-base leading-relaxed text-gray-400 md:text-lg">
          Veltra is a solar energy investment platform operating at{" "}
          <strong className="font-semibold text-gray-200">Veltra.com</strong>, run by{" "}
          <strong className="font-semibold text-pink-300">Veltra (Private) Limited</strong> — 
          a company registered with the Securities and Exchange Commission of Pakistan. 
          This page covers what the platform does, who is behind it, and how to confirm 
          you are on the official site rather than a look-alike.
        </p>
        
      </div>
    </section>
  );
}