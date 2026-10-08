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

  const plans = await db.orm.public.Plan
    .where({ isActive: true })
    .orderBy((p) => p.investmentAmount.asc())
    .all();

  return NextResponse.json(
    serializeBigInts(plans)
  );
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const plan = await db.orm.public.Plan.create({
      name: body.name,
      investmentAmount: BigInt(body.investmentAmount),
      rewardAmount: BigInt(body.rewardAmount),
      durationDays:
        body.durationDays == null
          ? null
          : Number(body.durationDays),
      isActive:
        body.isActive === undefined
          ? true
          : Boolean(body.isActive),
    });

    return NextResponse.json(
      serializeBigInts(plan),
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid plan data" },
      { status: 400 }
    );
  }
}