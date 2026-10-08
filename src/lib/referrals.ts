export const REFERRAL_LEVELS = [
  {
    level: 1,
    investmentBps: 500,
    profitBps: 500,
  },
  {
    level: 2,
    investmentBps: 400,
    profitBps: 400,
  },
  {
    level: 3,
    investmentBps: 300,
    profitBps: 300,
  },
  {
    level: 4,
    investmentBps: 200,
    profitBps: 200,
  },
  {
    level: 5,
    investmentBps: 100,
    profitBps: 100,
  },
] as const;

export function getReferralRate(
  level: number,
  type: "INVESTMENT" | "PROFIT"
) {
  const config = REFERRAL_LEVELS.find(
    (item) => item.level === level
  );

  if (!config) return 0;

  return type === "INVESTMENT"
    ? config.investmentBps
    : config.profitBps;
}