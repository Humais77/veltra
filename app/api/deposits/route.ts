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

    const deposits = await db.orm.public.Deposit
      .where({
        userId: user.id,
      })
      .orderBy((deposit) => deposit.createdAt.desc())
      .all();

    return NextResponse.json({
      success: true,
      deposits: serializeBigInts(deposits),
    });
  } catch (error) {
    console.error("GET_DEPOSITS_ERROR", error);

    return NextResponse.json(
      {
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
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const rawAmount = body.amount;
    const transactionId = String(
      body.transactionId || ""
    ).trim();

    if (
      rawAmount === undefined ||
      rawAmount === null ||
      rawAmount === ""
    ) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    let amount: bigint;

    try {
      amount = BigInt(String(rawAmount));
    } catch {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    if (amount <= 0n) {
      return NextResponse.json(
        { error: "Amount must be greater than zero" },
        { status: 400 }
      );
    }

    if (!transactionId) {
      return NextResponse.json(
        {
          error:
            "EasyPaisa transaction ID is required",
        },
        { status: 400 }
      );
    }

    const deposit =
      await db.orm.public.Deposit.create({
        userId: user.id,
        amount,
        method: "EASYPAISA",
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
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST_DEPOSIT_ERROR", error);

    return NextResponse.json(
      {
        error: "Deposit request failed",
      },
      { status: 500 }
    );
  }
}