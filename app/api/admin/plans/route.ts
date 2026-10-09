import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";

export async function GET() {
  try {
    const admin = await getCurrentUser();

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const plans = await db.orm.public.Plan
      .orderBy((plan) => plan.createdAt.desc())
      .all();

    return NextResponse.json({
      success: true,
      plans: serializeBigInts(plans),
    });
  } catch (error) {
    console.error(
      "ADMIN_PLANS_GET_ERROR",
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

export async function POST(request: Request) {
  try {
    const admin = await getCurrentUser();

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const name = String(body.name || "").trim();

    if (!name) {
      return NextResponse.json(
        { error: "Plan name is required" },
        { status: 400 }
      );
    }

    let investmentAmount: bigint;
    let rewardAmount: bigint;

    try {
      investmentAmount = BigInt(
        String(body.investmentAmount)
      );

      rewardAmount = BigInt(
        String(body.rewardAmount)
      );
    } catch {
      return NextResponse.json(
        {
          error:
            "Investment and reward amounts must be valid numbers",
        },
        { status: 400 }
      );
    }

    if (
      investmentAmount <= 0n ||
      rewardAmount < 0n
    ) {
      return NextResponse.json(
        {
          error: "Invalid plan amounts",
        },
        { status: 400 }
      );
    }

    let durationDays: number | null = null;

    if (
      body.durationDays !== undefined &&
      body.durationDays !== null &&
      body.durationDays !== ""
    ) {
      durationDays = Number(
        body.durationDays
      );

      if (
        !Number.isInteger(durationDays) ||
        durationDays <= 0
      ) {
        return NextResponse.json(
          {
            error:
              "Duration must be a positive integer",
          },
          { status: 400 }
        );
      }
    }

    const plan =
      await db.orm.public.Plan.create({
        name,
        investmentAmount,
        rewardAmount,
        durationDays,
        isActive: true,
      });

    return NextResponse.json(
      {
        success: true,
        message: "Plan created successfully.",
        plan: serializeBigInts(plan),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "ADMIN_PLANS_POST_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create plan",
      },
      { status: 500 }
    );
  }
}