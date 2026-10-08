"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Copy,
  Gift,
  Network,
  Search,
  Users,
  Wallet,
} from "lucide-react";

type Referral = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  level: number;
  createdAt: string;
};

type ReferralData = {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  directReferrals: number;
  networkInvestment: string;
  totalCommission: string;

  levelBreakdown: Record<
    number,
    {
      referrals: number;
      earnings: string;
    }
  >;

  referrals: Referral[];
};

const levels = [1, 2, 3, 4, 5];

const levelRates = [
  { level: 1, rate: 5 },
  { level: 2, rate: 4 },
  { level: 3, rate: 3 },
  { level: 4, rate: 2 },
  { level: 5, rate: 1 },
];

export default function ReferralsPage() {
  const [data, setData] =
    useState<ReferralData | null>(
      null
    );

  const [copied, setCopied] =
    useState(false);

  const [level, setLevel] =
    useState("ALL");

  const [investment, setInvestment] =
    useState("ALL");

  const [emailSearch, setEmailSearch] =
    useState("");

  useEffect(() => {
    fetch("/api/referrals", {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setData(result);
        }
      });
  }, []);

  const filteredReferrals =
    useMemo(() => {
      if (!data) return [];

      return data.referrals.filter(
        (referral) => {
          const levelMatch =
            level === "ALL" ||
            referral.level ===
              Number(level);

          const emailMatch =
            referral.email
              .toLowerCase()
              .includes(
                emailSearch.toLowerCase()
              );

          return (
            levelMatch &&
            emailMatch
          );
        }
      );
    }, [
      data,
      level,
      emailSearch,
    ]);

  async function copyReferral() {
    if (!data) return;

    const url = `${window.location.origin}${data.referralLink}`;

    await navigator.clipboard.writeText(
      url
    );

    setCopied(true);

    setTimeout(
      () => setCopied(false),
      2000
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-7xl py-20 text-center text-sm text-gray-500">
          Loading referral information...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-pink-400">
            Referral Program
          </p>

          <h1 className="mt-2 text-3xl font-black">
            My Referrals
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            People you invited and what
            you earn from them.
          </p>
        </div>

        {/* Online */}
        <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Online
        </div>

        {/* Referral link */}
        <div className="rounded-3xl border border-pink-500/20 bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-6">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Referral link
          </p>

          <h2 className="mt-2 font-bold">
            Invite friends · earn commission
          </h2>

          <div className="mt-4 flex flex-col gap-3 lg:flex-row">
            <div className="flex-1 overflow-hidden rounded-2xl border border-white/10 bg-[#050814] px-4 py-3 text-sm text-gray-400">
              {window.location.origin}
              {data.referralLink}
            </div>

            <button
              onClick={copyReferral}
              className="flex items-center justify-center gap-2 rounded-2xl bg-pink-500 px-6 py-3 text-sm font-bold"
            >
              <Copy size={17} />

              {copied
                ? "Copied!"
                : "Copy"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card
            icon={Users}
            label="Total referrals"
            value={String(
              data.totalReferrals
            )}
          />

          <Card
            icon={Network}
            label="Direct (L1)"
            value={String(
              data.directReferrals
            )}
          />

          <Card
            icon={Wallet}
            label="Network invested"
            value={`Rs. ${Number(
              data.networkInvestment
            ).toLocaleString(
              "en-PK"
            )}`}
          />

          <Card
            icon={Gift}
            label="Commissions"
            value={`Rs. ${Number(
              data.totalCommission
            ).toLocaleString(
              "en-PK"
            )}`}
          />
        </div>

        {/* Level breakdown */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold">
              Level breakdown
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              5 levels · lifetime earnings
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {levels.map(
              (levelNumber) => {
                const item =
                  data.levelBreakdown[
                    levelNumber
                  ];

                return (
                  <div
                    key={levelNumber}
                    className="rounded-3xl border border-white/10 bg-[#080b1f] p-5"
                  >
                    <p className="text-sm font-black text-pink-400">
                      L{levelNumber}
                    </p>

                    <p className="mt-4 text-2xl font-black">
                      {item.referrals}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      referrals
                    </p>

                    <p className="mt-4 text-sm font-bold text-emerald-400">
                      Rs.{" "}
                      {Number(
                        item.earnings
                      ).toLocaleString(
                        "en-PK"
                      )}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </section>

        {/* Filters */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-[#080b1f] p-5">
          <div className="flex items-center gap-2">
            <Search
              size={18}
              className="text-gray-500"
            />

            <h2 className="font-bold">
              Filters
            </h2>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <label>
              <span className="mb-2 block text-xs text-gray-500">
                Level
              </span>

              <select
                value={level}
                onChange={(e) =>
                  setLevel(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-white/10 bg-[#050814] px-4 py-3 text-sm outline-none"
              >
                <option value="ALL">
                  All levels
                </option>

                {levels.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    L{item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-2 block text-xs text-gray-500">
                Investment
              </span>

              <select
                value={investment}
                onChange={(e) =>
                  setInvestment(
                    e.target.value
                  )
                }
                className="w-full rounded-2xl border border-white/10 bg-[#050814] px-4 py-3 text-sm outline-none"
              >
                <option value="ALL">
                  All
                </option>

                <option value="INVESTED">
                  Invested
                </option>

                <option value="NOT_INVESTED">
                  Not invested
                </option>
              </select>
            </label>

            <label>
              <span className="mb-2 block text-xs text-gray-500">
                Email search
              </span>

              <input
                value={emailSearch}
                onChange={(e) =>
                  setEmailSearch(
                    e.target.value
                  )
                }
                placeholder="Filter by email"
                className="w-full rounded-2xl border border-white/10 bg-[#050814] px-4 py-3 text-sm outline-none"
              />
            </label>
          </div>
        </section>

        {/* Referrals */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-[#080b1f] p-6">
          <h2 className="text-xl font-bold">
            Referrals
          </h2>

          {filteredReferrals.length ===
          0 ? (
            <div className="py-12 text-center">
              <Users
                className="mx-auto text-gray-600"
                size={35}
              />

              <p className="mt-4 text-sm text-gray-500">
                No referrals match these
                filters.
              </p>
            </div>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase text-gray-500">
                    <th className="pb-4">
                      User
                    </th>

                    <th className="pb-4">
                      Email
                    </th>

                    <th className="pb-4">
                      Level
                    </th>

                    <th className="pb-4">
                      Joined
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredReferrals.map(
                    (referral) => (
                      <tr
                        key={referral.id}
                        className="border-b border-white/5"
                      >
                        <td className="py-4">
                          <p className="font-semibold">
                            {
                              referral.fullName
                            }
                          </p>

                          <p className="text-xs text-gray-500">
                            @
                            {
                              referral.username
                            }
                          </p>
                        </td>

                        <td className="py-4 text-sm text-gray-400">
                          {
                            referral.email
                          }
                        </td>

                        <td className="py-4">
                          <span className="rounded-full bg-pink-500/10 px-3 py-1 text-xs font-bold text-pink-400">
                            L
                            {
                              referral.level
                            }
                          </span>
                        </td>

                        <td className="py-4 text-sm text-gray-500">
                          {new Date(
                            referral.createdAt
                          ).toLocaleDateString(
                            "en-PK"
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Card({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#080b1f] p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-gray-500">
          {label}
        </p>

        <div className="rounded-xl bg-pink-500/10 p-2.5 text-pink-400">
          <Icon size={18} />
        </div>
      </div>

      <p className="mt-5 text-2xl font-black">
        {value}
      </p>
    </div>
  );
}