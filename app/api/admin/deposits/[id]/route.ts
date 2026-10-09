import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";
import { createReferralCommissions } from "@/src/lib/createReferralComissions";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  { params }: Params
) {
  try {
    const admin = await getCurrentUser();

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const body = await request.json();
    const status = body.status;

    if (status !== "APPROVED" && status !== "REJECTED") {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    const result = await db.transaction(async (tx) => {
      const deposit = await tx.orm.public.Deposit
        .where({ id })
        .first();

      if (!deposit) {
        throw new Error("NOT_FOUND");
      }

      if (deposit.status !== "PENDING") {
        throw new Error("ALREADY_PROCESSED");
      }

      const user = await tx.orm.public.User
        .where({ id: deposit.userId })
        .first();

      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      const updatedDeposit = await tx.orm.public.Deposit
        .where({ id })
        .update({ status });

      let investmentCreated = false;

      if (status === "APPROVED") {
        // Credit the deposit first.
        const creditedBalance = user.balance + deposit.amount;

        await tx.orm.public.Transaction.create({
          userId: user.id,
          type: "DEPOSIT",
          amount: deposit.amount,
          note: `${deposit.method} deposit ${
            deposit.transactionId || ""
          }`.trim(),
        });

        // If this deposit came from a selected plan, attempt
        // to create the investment in the same transaction.
        let remainingBalance = creditedBalance;

        if (deposit.planId) {
          const plan = await tx.orm.public.Plan.first({
            id: deposit.planId,
          });

          if (plan?.isActive) {
            const existingInvestment =
              await tx.orm.public.Investment.first({
                userId: user.id,
                planId: plan.id,
                status: "ACTIVE",
              });

            if (
              !existingInvestment &&
              remainingBalance >= plan.investmentAmount
            ) {
              const investment =
                await tx.orm.public.Investment.create({
                  userId: user.id,
                  planId: plan.id,
                  amount: plan.investmentAmount,
                  reward: plan.rewardAmount,
                  status: "ACTIVE",
                });

              remainingBalance -= plan.investmentAmount;
              investmentCreated = true;

              await tx.orm.public.Transaction.create({
                userId: user.id,
                type: "INVESTMENT",
                amount: plan.investmentAmount,
                note: `Investment in ${plan.name}`,
              });

              await createReferralCommissions({
                tx,
                sourceUserId: user.id,
                amount: plan.investmentAmount,
                investmentId: investment.id,
                type: "INVESTMENT",
              });
            }
          }
        }

        // Save the final wallet balance and deposit total.
        await tx.orm.public.User
          .where({ id: user.id })
          .update({
            balance: remainingBalance,
            totalDeposit: user.totalDeposit + deposit.amount,
          });
      }

      return {
        deposit: updatedDeposit,
        investmentCreated,
      };
    });

    return NextResponse.json({
      success: true,
      message:
        status === "APPROVED"
          ? "Deposit approved successfully."
          : "Deposit rejected successfully.",
      investmentCreated: result.investmentCreated,
      deposit: serializeBigInts(result.deposit),
    });
  } catch (error) {
    console.error("ADMIN_DEPOSIT_REVIEW_ERROR", error);

    if (error instanceof Error) {
      if (error.message === "NOT_FOUND") {
        return NextResponse.json(
          { success: false, error: "Deposit not found" },
          { status: 404 }
        );
      }

      if (error.message === "ALREADY_PROCESSED") {
        return NextResponse.json(
          {
            success: false,
            error: "This deposit has already been processed.",
          },
          { status: 409 }
        );
      }

      if (error.message === "USER_NOT_FOUND") {
        return NextResponse.json(
          {
            success: false,
            error: "Deposit user no longer exists.",
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Failed to process deposit" },
      { status: 500 }
    );
  }
}