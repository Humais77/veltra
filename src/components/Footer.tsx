import React from "react";
import Link from "next/link";

export default function Footer() {
  const footerLinks = {
    product: [
      { name: "Download the app", href: "#" },
      { name: "Plans", href: "#" },
      { name: "Dashboard", href: "#" },
      { name: "Referrals", href: "#" },
    ],
    account: [
      { name: "Login", href: "/login" },
      { name: "Register", href: "/register" },
      { name: "Support", href: "#" },
      { name: "News", href: "#" },
    ],
    company: [
      { name: "About Veltra", href: "#" },
      { name: "Company details", href: "#" },
      { name: "Shariah ruling", href: "#" },
      { name: "Unsubscribe", href: "#" },
    ],
  };

  return (
    <footer className="w-full border-t border-white/5 bg-[#050814] px-4 py-12 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-12 lg:grid-cols-5">
          
          {/* Left Column: Brand & Copy */}
          <div className="col-span-2 flex flex-col">
            <Link href="/" className="mb-4 inline-block">
              <span className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-white">
                Veltra
              </span>
            </Link>
            
            <p className="mb-12 max-w-sm text-sm leading-relaxed text-gray-400">
              Solar-powered yield infrastructure. Onboard sunlight to your portfolio.
            </p>
            
            <p className="mt-auto text-xs font-medium text-gray-600">
              © 2026 Veltra Labs · Veltra.com
            </p>
          </div>

          {/* Right Columns: Links */}
          <div className="flex flex-col gap-5">
            <h3 className="text-[10px] font-bold tracking-widest text-pink-500 uppercase">
              Product
            </h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-sm font-medium text-gray-400 transition-colors hover:text-pink-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-5">
            <h3 className="text-[10px] font-bold tracking-widest text-pink-500 uppercase">
              Account
            </h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.account.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-sm font-medium text-gray-400 transition-colors hover:text-pink-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-5">
            <h3 className="text-[10px] font-bold tracking-widest text-pink-500 uppercase">
              Company
            </h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-sm font-medium text-gray-400 transition-colors hover:text-pink-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}