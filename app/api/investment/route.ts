import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";
import { createReferralCommissions } from "@/src/lib/createReferralComissions";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const investments =
      await db.orm.public.Investment
        .where({
          userId: user.id,
        })
        .include("plan")
        .orderBy((investment) =>
          investment.createdAt.desc()
        )
        .all();

    const runningInvestments =
      investments.filter(
        (investment) =>
          investment.status === "ACTIVE"
      );

    const completedInvestments =
      investments.filter(
        (investment) =>
          investment.status === "COMPLETED"
      );

    return NextResponse.json({
      success: true,
      investments: serializeBigInts(
        investments
      ),
      runningInvestments: serializeBigInts(
        runningInvestments
      ),
      completedInvestments: serializeBigInts(
        completedInvestments
      ),
    });
  } catch (error) {
    console.error(
      "GET_INVESTMENTS_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load investments",
        investments: [],
        runningInvestments: [],
        completedInvestments: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const planId = String(body.planId || "").trim();

    if (!planId) {
      return NextResponse.json(
        { error: "Plan is required" },
        { status: 400 }
      );
    }

    const result = await db.transaction(async (tx) => {
      /*
       * Get the plan.
       */
      const plan =
        await tx.orm.public.Plan.first({
          id: planId,
        });

      if (!plan || !plan.isActive) {
        throw new Error("PLAN_NOT_FOUND");
      }

      /*
       * Prevent the same user from having
       * more than one active investment
       * in the same plan.
       */
      const existingInvestment =
        await tx.orm.public.Investment.first({
          userId: user.id,
          planId: plan.id,
          status: "ACTIVE",
        });

      if (existingInvestment) {
        throw new Error("ALREADY_INVESTED");
      }

      /*
       * Get the latest user balance.
       */
      const currentUser =
        await tx.orm.public.User.first({
          id: user.id,
        });

      if (!currentUser) {
        throw new Error("USER_NOT_FOUND");
      }

      /*
       * Check balance.
       */
      if (
        currentUser.balance <
        plan.investmentAmount
      ) {
        throw new Error(
          "INSUFFICIENT_BALANCE"
        );
      }

      /*
       * Create investment.
       */
      const investment =
  await tx.orm.public.Investment.create({
    userId: user.id,
    planId: plan.id,
    amount: plan.investmentAmount,
    reward: plan.rewardAmount,
    status: "ACTIVE",
  });

await tx.orm.public.User
  .where({ id: user.id })
  .update({
    balance:
      currentUser.balance -
      plan.investmentAmount,
  });

await tx.orm.public.Transaction.create({
  userId: user.id,
  type: "INVESTMENT",
  amount: plan.investmentAmount,
  note: `Investment in ${plan.name}`,
});

/*
 * Five-level investment commission.
 */
await createReferralCommissions({
  tx,
  sourceUserId: user.id,
  amount: plan.investmentAmount,
  investmentId: investment.id,
  type: "INVESTMENT",
});

      return investment;
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Investment created successfully.",
        investment:
          serializeBigInts(result),
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message ===
        "PLAN_NOT_FOUND"
      ) {
        return NextResponse.json(
          {
            error:
              "This investment plan is no longer available.",
          },
          { status: 404 }
        );
      }

      if (
        error.message ===
        "ALREADY_INVESTED"
      ) {
        return NextResponse.json(
          {
            error:
              "You already have an active investment in this plan.",
          },
          { status: 409 }
        );
      }

      if (
        error.message ===
        "INSUFFICIENT_BALANCE"
      ) {
        return NextResponse.json(
          {
            error:
              "Insufficient balance. Please deposit funds first.",
          },
          { status: 400 }
        );
      }

      if (
        error.message ===
        "USER_NOT_FOUND"
      ) {
        return NextResponse.json(
          {
            error: "User account not found.",
          },
          { status: 404 }
        );
      }
    }

    console.error(
      "INVESTMENT_ERROR",
      error
    );

    return NextResponse.json(
      {
        error: "Investment failed",
      },
      { status: 500 }
    );
  }
}