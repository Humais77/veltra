import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Gift,
  TrendingUp,
} from "lucide-react";

const levels = [
  {
    level: 1,
    rate: 5,
  },
  {
    level: 2,
    rate: 4,
  },
  {
    level: 3,
    rate: 3,
  },
  {
    level: 4,
    rate: 2,
  },
  {
    level: 5,
    rate: 1,
  },
];

export default function ReferralPlansPage() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <p className="text-sm font-semibold text-pink-400">
            Referral Program
          </p>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Referral Plans
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            What you earn from your referrals
            at each level.
          </p>
        </div>

        <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Online
        </div>

        {/* Investment commission */}
        <CommissionSection
          icon={TrendingUp}
          title="Investment commission"
          description="Earn when your referrals invest"
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {levels.map((item) => (
            <CommissionCard
              key={item.level}
              level={item.level}
              rate={item.rate}
            />
          ))}
        </div>

        {/* Profit commission */}
        <CommissionSection
          icon={Gift}
          title="Earnings commission"
          description="Earn when your referrals make profit"
          className="mt-10"
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {levels.map((item) => (
            <CommissionCard
              key={item.level}
              level={item.level}
              rate={item.rate}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-3xl border border-pink-500/20 bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black">
                Invite friends · earn more
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                Invite people to Veltra and
                keep earning from their
                activity across five levels.
              </p>
            </div>

            <Link
              href="/dashboard/referrals"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3.5 text-sm font-bold"
            >
              View my referrals
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function CommissionSection({
  icon: Icon,
  title,
  description,
  className = "",
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-pink-500/10 p-2.5 text-pink-400">
          <Icon size={19} />
        </div>

        <div>
          <h2 className="font-bold">
            {title}
          </h2>

          <p className="text-sm text-gray-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function CommissionCard({
  level,
  rate,
}: {
  level: number;
  rate: number;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Level
        </span>

        <span className="font-black text-pink-400">
          L{level}
        </span>
      </div>

      <p className="mt-5 text-3xl font-black">
        {rate}%
      </p>

      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-400">
        <CheckCircle2 size={15} />
        active
      </div>
    </div>
  );
}