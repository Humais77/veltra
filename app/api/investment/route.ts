import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const investments = await db.orm.public.Investment
    .where({
      userId: user.id,
    })
    .include("plan")
    .orderBy((i) => i.createdAt.desc())
    .all();

  return NextResponse.json(
    serializeBigInts(investments)
  );
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

    const { planId } = await request.json();

    if (!planId) {
      return NextResponse.json(
        { error: "Plan is required" },
        { status: 400 }
      );
    }

    const result = await db.transaction(async (tx) => {
      const plan = await tx.orm.public.Plan.first({
        id: planId,
      });

      if (!plan || !plan.isActive) {
        throw new Error("PLAN_NOT_FOUND");
      }

      const currentUser = await tx.orm.public.User.first({
        id: user.id,
      });

      if (!currentUser) {
        throw new Error("USER_NOT_FOUND");
      }

      if (currentUser.balance < plan.investmentAmount) {
        throw new Error("INSUFFICIENT_BALANCE");
      }

      const investment = await tx.orm.public.Investment.create({
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
            currentUser.balance - plan.investmentAmount,
        });

      await tx.orm.public.Transaction.create({
        userId: user.id,
        type: "INVESTMENT",
        amount: plan.investmentAmount,
        note: `Investment in ${plan.name}`,
      });

      // Direct referral commission = 2%
      if (currentUser.referredById) {
        const commission =
          (plan.investmentAmount * 200n) / 10000n;

        if (commission > 0n) {
          const referrer = await tx.orm.public.User.first({
            id: currentUser.referredById,
          });

          if (referrer) {
            await tx.orm.public.Commission.create({
              userId: referrer.id,
              sourceUserId: user.id,
              investmentId: investment.id,
              percentageBps: 200,
              amount: commission,
            });

            await tx.orm.public.User
              .where({ id: referrer.id })
              .update({
                balance: referrer.balance + commission,
                totalCommission:
                  referrer.totalCommission + commission,
              });

            await tx.orm.public.Transaction.create({
              userId: referrer.id,
              type: "REFERRAL_COMMISSION",
              amount: commission,
              note: `2% referral commission from ${user.username}`,
            });
          }
        }
      }

      return investment;
    });

    return NextResponse.json(
      serializeBigInts(result),
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "PLAN_NOT_FOUND") {
        return NextResponse.json(
          { error: "Plan not found" },
          { status: 404 }
        );
      }

      if (error.message === "INSUFFICIENT_BALANCE") {
        return NextResponse.json(
          { error: "Insufficient balance" },
          { status: 400 }
        );
      }
    }

    console.error("INVESTMENT_ERROR", error);

    return NextResponse.json(
      { error: "Investment failed" },
      { status: 500 }
    );
  }
}