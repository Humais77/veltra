import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  { params }: Params
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await db.orm.public.Plan.first({ id });

    if (!existing) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    const plan = await db.orm.public.Plan
      .where({ id })
      .update({
        ...(body.name !== undefined && {
          name: body.name,
        }),

        ...(body.investmentAmount !== undefined && {
          investmentAmount: BigInt(body.investmentAmount),
        }),

        ...(body.rewardAmount !== undefined && {
          rewardAmount: BigInt(body.rewardAmount),
        }),

        ...(body.durationDays !== undefined && {
          durationDays:
            body.durationDays === null
              ? null
              : Number(body.durationDays),
        }),

        ...(body.isActive !== undefined && {
          isActive: Boolean(body.isActive),
        }),
      });

    return NextResponse.json(
      serializeBigInts(plan)
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to update plan" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: Params
) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const { id } = await params;

  const plan = await db.orm.public.Plan
    .where({ id })
    .update({
      isActive: false,
    });

  if (!plan) {
    return NextResponse.json(
      { error: "Plan not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}