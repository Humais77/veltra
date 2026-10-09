import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "USER") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const rows = await db.orm.public.ReferralPlan.all();

    const plans = rows
      .filter((plan: any) => plan.isActive)
      .sort((a: any, b: any) => a.level - b.level)
      .map((plan: any) => ({
        level: plan.level,
        investmentPercentageBps: plan.investmentPercentageBps,
        profitPercentageBps: plan.profitPercentageBps,
      }));

    return NextResponse.json({ success: true, plans });
  } catch (error) {
    console.error("REFERRAL_PLANS_GET", error);
    return NextResponse.json(
      { success: false, error: "Failed to load referral rates." },
      { status: 500 }
    );
  }
}