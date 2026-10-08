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
    const admin = await getCurrentUser();

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const existing =
      await db.orm.public.Plan.first({ id });

    if (!existing) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    const update: Record<string, unknown> = {};

    if (body.name !== undefined) {
      const name = String(body.name).trim();

      if (!name) {
        return NextResponse.json(
          {
            error:
              "Plan name cannot be empty",
          },
          { status: 400 }
        );
      }

      update.name = name;
    }

    if (body.investmentAmount !== undefined) {
      try {
        const value = BigInt(
          String(body.investmentAmount)
        );

        if (value <= 0n) {
          throw new Error();
        }

        update.investmentAmount = value;
      } catch {
        return NextResponse.json(
          {
            error:
              "Invalid investment amount",
          },
          { status: 400 }
        );
      }
    }

    if (body.rewardAmount !== undefined) {
      try {
        const value = BigInt(
          String(body.rewardAmount)
        );

        if (value < 0n) {
          throw new Error();
        }

        update.rewardAmount = value;
      } catch {
        return NextResponse.json(
          {
            error:
              "Invalid reward amount",
          },
          { status: 400 }
        );
      }
    }

    if (body.durationDays !== undefined) {
      if (
        body.durationDays === null ||
        body.durationDays === ""
      ) {
        update.durationDays = null;
      } else {
        const value = Number(
          body.durationDays
        );

        if (
          !Number.isInteger(value) ||
          value <= 0
        ) {
          return NextResponse.json(
            {
              error:
                "Invalid duration",
            },
            { status: 400 }
          );
        }

        update.durationDays = value;
      }
    }

    if (body.isActive !== undefined) {
      update.isActive =
        Boolean(body.isActive);
    }

    if (
      Object.keys(update).length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "No valid changes were provided",
        },
        { status: 400 }
      );
    }

    const plan =
      await db.orm.public.Plan
        .where({ id })
        .update(update);

    return NextResponse.json({
      success: true,
      message: "Plan updated successfully.",
      plan: serializeBigInts(plan),
    });
  } catch (error) {
    console.error(
      "ADMIN_PLAN_PATCH_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update plan",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: Params
) {
  try {
    const admin = await getCurrentUser();

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const plan =
      await db.orm.public.Plan.first({ id });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    // Soft delete.
    // Existing investments continue referencing this plan.
    const updated =
      await db.orm.public.Plan
        .where({ id })
        .update({
          isActive: false,
        });

    return NextResponse.json({
      success: true,
      message:
        "Plan deactivated successfully.",
      plan: serializeBigInts(updated),
    });
  } catch (error) {
    console.error(
      "ADMIN_PLAN_DELETE_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to deactivate plan",
      },
      { status: 500 }
    );
  }
}