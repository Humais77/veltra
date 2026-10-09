import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";

const DEFAULT_LEVELS = [
  { level: 1, investmentPercentageBps: 500, profitPercentageBps: 500 },
  { level: 2, investmentPercentageBps: 400, profitPercentageBps: 400 },
  { level: 3, investmentPercentageBps: 300, profitPercentageBps: 300 },
  { level: 4, investmentPercentageBps: 200, profitPercentageBps: 200 },
  { level: 5, investmentPercentageBps: 100, profitPercentageBps: 100 },
];

async function requireAdmin() {
  const user = await getCurrentUser();
  return user?.role === "ADMIN" ? user : null;
}

export async function GET() {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const rows = await db.orm.public.ReferralPlan.all();
    const plans = DEFAULT_LEVELS.map((defaults) => {
      const saved = rows.find((row: any) => row.level === defaults.level);

      return saved ?? {
        ...defaults,
        id: null,
        isActive: true,
      };
    });

    return NextResponse.json({
      success: true,
      plans: serializeBigInts(plans),
    });
  } catch (error) {
    console.error("ADMIN_REFERRAL_PLANS_GET", error);
    return NextResponse.json(
      { success: false, error: "Failed to load referral plans." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();

    if (!Array.isArray(body.plans) || body.plans.length !== 5) {
      return NextResponse.json(
        { success: false, error: "Submit exactly five referral levels." },
        { status: 400 }
      );
    }

    const seen = new Set<number>();

    for (const plan of body.plans) {
      const { level, investmentPercentageBps, profitPercentageBps, isActive } =
        plan;

      if (
        !Number.isInteger(level) ||
        level < 1 ||
        level > 5 ||
        seen.has(level) ||
        !Number.isInteger(investmentPercentageBps) ||
        investmentPercentageBps < 0 ||
        investmentPercentageBps > 10000 ||
        !Number.isInteger(profitPercentageBps) ||
        profitPercentageBps < 0 ||
        profitPercentageBps > 10000 ||
        typeof isActive !== "boolean"
      ) {
        return NextResponse.json(
          { success: false, error: "Invalid referral-plan values." },
          { status: 400 }
        );
      }

      seen.add(level);
    }

    if (seen.size !== 5) {
      return NextResponse.json(
        { success: false, error: "Levels 1–5 must each be included." },
        { status: 400 }
      );
    }

    await db.transaction(async (tx: any) => {
      const existing = await tx.orm.public.ReferralPlan.all();

      for (const input of body.plans) {
        const saved = existing.find(
          (row: any) => row.level === input.level
        );

        if (saved) {
          await tx.orm.public.ReferralPlan
            .where({ id: saved.id })
            .update({
              investmentPercentageBps: input.investmentPercentageBps,
              profitPercentageBps: input.profitPercentageBps,
              isActive: input.isActive,
            });
        } else {
          await tx.orm.public.ReferralPlan.create({
            level: input.level,
            investmentPercentageBps: input.investmentPercentageBps,
            profitPercentageBps: input.profitPercentageBps,
            isActive: input.isActive,
          });
        }
      }
    });

    const plans = await db.orm.public.ReferralPlan.all();

    return NextResponse.json({
      success: true,
      message: "Referral plans saved.",
      plans: serializeBigInts(plans),
    });
  } catch (error) {
    console.error("ADMIN_REFERRAL_PLANS_PATCH", error);
    return NextResponse.json(
      { success: false, error: "Failed to save referral plans." },
      { status: 500 }
    );
  }
}