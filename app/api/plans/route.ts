import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find plans in which this user already has
    // an active investment.
    const activeInvestments =
      await db.orm.public.Investment
        .where({
          userId: user.id,
          status: "ACTIVE",
        })
        .all();

    const investedPlanIds = new Set(
      activeInvestments.map(
        (investment) => investment.planId
      )
    );

    // Get all currently active plans.
    const allActivePlans =
      await db.orm.public.Plan
        .where({
          isActive: true,
        })
        .orderBy((plan) =>
          plan.investmentAmount.asc()
        )
        .all();

    // Remove plans already running for this user.
    const availablePlans =
      allActivePlans.filter(
        (plan) =>
          !investedPlanIds.has(plan.id)
      );

    return NextResponse.json({
      success: true,
      plans: serializeBigInts(
        availablePlans
      ),
    });
  } catch (error) {
    console.error(
      "GET_PLANS_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load plans",
        plans: [],
      },
      { status: 500 }
    );
  }
}