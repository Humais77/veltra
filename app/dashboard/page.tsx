import Link from "next/link";
import {
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Gift,
  Users,
  LineChart,
  Sun,
  Award,
  FileText,
  Newspaper,
  User as UserIcon,
  ShieldCheck,
  LifeBuoy,
  Copy,
  Share2,
  ArrowRight,
  Send,
  Zap, // Import Zap from lucide-react instead of using a custom function
} from "lucide-react";

import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";

function formatPKR(value: bigint | number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const [
    referralCountResult,
    activeInvestmentCountResult,
    totalInvestmentCountResult,
    recentInvestments,
    recentTransactions,
  ] = await Promise.all([
    // Direct referrals
    db.orm.public.User.where({
      referredById: user.id,
    }).aggregate((agg) => ({
      count: agg.count(),
    })),

    // Active investments
    db.orm.public.Investment.where({
      userId: user.id,
      status: "ACTIVE",
    }).aggregate((agg) => ({
      count: agg.count(),
    })),

    // All investments
    db.orm.public.Investment.where({
      userId: user.id,
    }).aggregate((agg) => ({
      count: agg.count(),
    })),

    // Recent investments
    db.orm.public.Investment.where({
      userId: user.id,
    })
      .orderBy((investment) => investment.createdAt.desc())
      .limit(5)
      .include("plan")
      .all(),

    // Recent transactions
    db.orm.public.Transaction.where({
      userId: user.id,
    })
      .orderBy((transaction) => transaction.createdAt.desc())
      .limit(5)
      .all(),
  ]);

  const referralCount = referralCountResult.count ?? 0;
  const activeInvestments = activeInvestmentCountResult.count ?? 0;
  const totalInvestments = totalInvestmentCountResult.count ?? 0;

  // Domain for the referral link
  const domainUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sunzee1.com";
  const referralLink = `${domainUrl}/register?ref=${user.referralCode}`;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 text-white pb-12">
      
      {/* ✅ Reusable Header - Replaces the old hardcoded double header */}
      <DashboardHeader 
        userName={user.fullName} 
        isOnline={true} 
      />

      {/* Main Earnings Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#080b1f] p-6 shadow-2xl md:p-8">
        {/* Glow effect */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#4020bd]/20 blur-[100px]" />
        
        <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-start">
          
          {/* Left: Earnings Info */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-[10px] font-bold tracking-widest text-pink-400 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
              Balance · Live
            </div>
            
            <div className="flex items-center gap-3">
              <Sun className="h-8 w-8 text-pink-500/70" />
              <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-[#4020bd] sm:text-4xl md:text-5xl">
                 {formatPKR(user.balance)}
              </h1>
            </div>
            
          </div>

        </div>

        {/* Bottom Banner of Earnings Card */}
        <div className="relative z-10 mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/5 bg-[#0c102a]/50 p-4 md:flex-row">
          <p className="text-sm font-medium text-gray-400">
            {activeInvestments > 0 
              ? `You have ${activeInvestments} active investment(s) earning profit.` 
              : "No active investments yet. Choose a plan to start earning."}
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Link 
              href="/dashboard/plans" 
              className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4020bd] via-[#3520a8] to-[#063d82] hover:to-pink-600 px-6 py-3 text-sm font-bold text-white shadow-[0_4px_15px_rgba(64,32,189,0.3)] transition-all hover:scale-105"
            >
              <Zap size={16} className="text-pink-300" />
              Invest
            </Link>
            <Link 
              href="/dashboard/investments" 
              className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/5"
            >
              My investments <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Wallets Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Total Deposit Wallet */}
        <div className="group flex flex-col justify-between rounded-3xl border border-white/5 bg-[#080b1f] p-6 transition-colors hover:border-pink-500/30 hover:bg-[#0c102a]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-pink-500/20 bg-[#4020bd]/20 text-pink-400 shadow-[inset_0_0_15px_rgba(236,72,153,0.1)]">
                <ArrowDownToLine size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                  Total Deposit
                </p>
                <h3 className="text-2xl font-black text-white">
                  {formatPKR(user.totalDeposit)}
                </h3>
              </div>
            </div>
            <Link
              href="/dashboard/deposit"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition-colors hover:bg-white/10"
            >
              <Send size={14} className="rotate-45 text-pink-400" />
              Add funds
            </Link>
          </div>
        </div>

        {/* Available Balance Wallet */}
        <div className="group flex flex-col justify-between rounded-3xl border border-white/5 bg-[#080b1f] p-6 transition-colors hover:border-pink-500/30 hover:bg-[#0c102a]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-purple-500/20 bg-[#4020bd]/20 text-purple-400 shadow-[inset_0_0_15px_rgba(168,85,247,0.1)]">
                <Wallet size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                  Available Balance
                </p>
                <h3 className="text-2xl font-black text-white">
                  {formatPKR(user.balance)}
                </h3>
              </div>
            </div>
            <Link
              href="/dashboard/withdrawals"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition-colors hover:bg-white/10"
            >
              <Send size={14} className="-translate-y-0.5 text-purple-400" />
              Withdraw
            </Link>
          </div>
        </div>
      </div>

      {/* Referral Link Section */}
      <div className="rounded-3xl border border-white/5 bg-[#080b1f] p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4020bd]/20 text-indigo-400">
            <Users size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
              Referral Link
            </p>
            <h3 className="text-sm font-bold text-white">
              Invite friends · earn commission
            </h3>
          </div>
        </div>

        <div className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#050814] p-2 pl-4">
          <code className="truncate text-xs font-medium text-pink-300/80 sm:text-sm">
            {referralLink}
          </code>
          <div className="flex shrink-0 items-center gap-2 pl-2">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-pink-500/10 px-4 py-2 text-xs font-bold text-pink-400 transition-colors hover:bg-pink-500/20"
            >
              <Copy size={14} />
              <span className="hidden sm:inline">COPY</span>
            </button>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Share2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="rounded-3xl border border-white/5 bg-[#080b1f] p-6">
        <div className="mb-6">
          <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
            Quick Links
          </p>
          <h3 className="text-lg font-bold text-white">Go to any page</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          <QuickLink icon={LineChart} title="Plans" href="/dashboard/plans" />
          <QuickLink icon={Sun} title="Investments" href="/dashboard/investments" />
          <QuickLink icon={ArrowDownToLine} title="Deposit" href="/dashboard/deposit" />
          <QuickLink icon={ArrowUpFromLine} title="Withdraw" href="/dashboard/withdrawals" />
          <QuickLink icon={Users} title="Referrals" href="/dashboard/referrals" />
          <QuickLink icon={Award} title="Ranks" href="#" />
          <QuickLink icon={FileText} title="History" href="/dashboard/transactions" />
          <QuickLink icon={Gift} title="Referral Plans" href="#" />
          <QuickLink icon={Newspaper} title="News" href="#" />
          <QuickLink icon={UserIcon} title="Profile" href="/dashboard/profile" />
          <QuickLink icon={ShieldCheck} title="Security" href="#" />
          <QuickLink icon={LifeBuoy} title="Support" href="#" />
        </div>
      </div>

    </div>
  );
}

/* ============================================================ */
/* SUB-COMPONENTS */
/* ============================================================ */

function QuickLink({
  icon: Icon,
  title,
  href,
}: {
  icon: React.ElementType;
  title: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/5 bg-[#0c102a]/30 p-4 transition-all hover:border-pink-500/30 hover:bg-[#12183b]"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4020bd]/20 text-gray-400 transition-colors group-hover:bg-[#4020bd]/40 group-hover:text-pink-400">
        <Icon size={18} />
      </div>
      <span className="text-xs font-semibold text-gray-300 group-hover:text-white">
        {title}
      </span>
    </Link>
  );
}