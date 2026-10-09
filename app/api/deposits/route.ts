import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const deposits =
      await db.orm.public.Deposit
        .where({
          userId: user.id,
        })
        .orderBy((deposit) =>
          deposit.createdAt.desc()
        )
        .all();

    return NextResponse.json({
      success: true,
      deposits: serializeBigInts(deposits),
    });
  } catch (error) {
    console.error(
      "GET_DEPOSITS_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load deposits",
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
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const rawAmount = body.amount;

    if (
      rawAmount === undefined ||
      rawAmount === null ||
      rawAmount === ""
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Amount is required",
        },
        { status: 400 }
      );
    }

    let amount: bigint;

    try {
      amount = BigInt(String(rawAmount));
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid amount",
        },
        { status: 400 }
      );
    }

    if (amount <= 0n) {
      return NextResponse.json(
        {
          success: false,
          error: "Amount must be greater than zero",
        },
        { status: 400 }
      );
    }

    const transactionId = String(
      body.transactionId || ""
    ).trim();

    if (!transactionId) {
      return NextResponse.json(
        {
          success: false,
          error: "Transaction ID is required",
        },
        { status: 400 }
      );
    }
    const planId = String(body.planId || "").trim() || null;

if (planId) {
  const plan = await db.orm.public.Plan.first({
    id: planId,
  });

  if (!plan || !plan.isActive) {
    return NextResponse.json(
      {
        success: false,
        error: "The selected investment plan is no longer available.",
      },
      { status: 404 }
    );
  }
}

    /*
     * Get the currently active payment method.
     *
     * Only one payment method should be active.
     */
    const paymentMethod =
      await db.orm.public.PaymentMethod
        .where({
          isAvailable: true,
        })
        .first();

    if (!paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No payment method is currently available. Please try again later.",
        },
        { status: 503 }
      );
    }

    /*
     * Make sure the transaction ID isn't already
     * being used by another deposit.
     */
    const existingDeposit =
      await db.orm.public.Deposit
        .where({
          transactionId,
        })
        .first();

    if (existingDeposit) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This transaction ID has already been submitted.",
        },
        { status: 409 }
      );
    }

    const deposit = await db.orm.public.Deposit.create({
  userId: user.id,
  planId,
  amount,
  method: paymentMethod.type,
  transactionId,
  screenshotUrl: null,
  status: "PENDING",
});
      

    return NextResponse.json(
      {
        success: true,
        message:
          "Deposit submitted successfully. Please wait for admin approval.",
        deposit: serializeBigInts(deposit),
        paymentMethod,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST_DEPOSIT_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Deposit request failed",
      },
      { status: 500 }
    );
  }
}