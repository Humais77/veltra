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

  const deposits = await db.orm.public.Deposit
    .where({
      userId: user.id,
    })
    .orderBy((d) => d.createdAt.desc())
    .all();

  return NextResponse.json(
    serializeBigInts(deposits)
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

    const body = await request.json();

    const amount = BigInt(body.amount);
    const transactionId =
      String(body.transactionId || "").trim();

    if (amount <= 0n) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    if (!transactionId) {
      return NextResponse.json(
        { error: "EasyPaisa transaction ID is required" },
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
      serializeBigInts(deposit),
      { status: 201 }
    );
  } catch (error) {
    console.error("DEPOSIT_ERROR", error);

    return NextResponse.json(
      { error: "Deposit request failed" },
      { status: 400 }
    );
  }
}