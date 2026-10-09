import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";

type Params = { params: Promise<{ id: string }> };

async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === "ADMIN";
}

function rupeesToPaisa(value: unknown): bigint | null {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0 ||
    Math.round(value * 100) !== value * 100
  ) {
    return null;
  }

  return BigInt(Math.round(value * 100));
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const current = await db.orm.public.Rank.where({ id }).first();

    if (!current) {
      return NextResponse.json(
        { success: false, error: "Rank not found." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const update: Record<string, unknown> = {};

    if (body.name !== undefined) {
      if (
        typeof body.name !== "string" ||
        !body.name.trim() ||
        body.name.trim().length > 80
      ) {
        return NextResponse.json(
          { success: false, error: "Invalid rank name." },
          { status: 400 }
        );
      }

      update.name = body.name.trim();
    }

    if (body.level !== undefined) {
      const level = Number(body.level);

      if (!Number.isInteger(level) || level < 1 || level > 100) {
        return NextResponse.json(
          { success: false, error: "Invalid rank level." },
          { status: 400 }
        );
      }

      const ranks = await db.orm.public.Rank.all();
      if (ranks.some((rank: any) => rank.level === level && rank.id !== id)) {
        return NextResponse.json(
          { success: false, error: "That rank level already exists." },
          { status: 409 }
        );
      }

      update.level = level;
    }

    for (const field of [
      "minOwnInvestment",
      "minReferralInvestment",
      "bonus",
    ] as const) {
      if (body[field] !== undefined) {
        const value = rupeesToPaisa(body[field]);

        if (value === null) {
          return NextResponse.json(
            { success: false, error: `Invalid ${field}.` },
            { status: 400 }
          );
        }

        update[field] = value;
      }
    }

    if (body.isActive !== undefined) {
      if (typeof body.isActive !== "boolean") {
        return NextResponse.json(
          { success: false, error: "isActive must be a boolean." },
          { status: 400 }
        );
      }

      update.isActive = body.isActive;
    }

    const rank = await db.orm.public.Rank.where({ id }).update(update);

    return NextResponse.json({
      success: true,
      rank: serializeBigInts(rank),
    });
  } catch (error) {
    console.error("ADMIN_RANK_PATCH", error);
    return NextResponse.json(
      { success: false, error: "Failed to update rank." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const rank = await db.orm.public.Rank.where({ id }).first();

    if (!rank) {
      return NextResponse.json(
        { success: false, error: "Rank not found." },
        { status: 404 }
      );
    }

    // Use deactivation as the safe default; it preserves rank history.
    const updated = await db.orm.public.Rank.where({ id }).update({
      isActive: false,
    });

    return NextResponse.json({
      success: true,
      message: "Rank deactivated.",
      rank: serializeBigInts(updated),
    });
  } catch (error) {
    console.error("ADMIN_RANK_DELETE", error);
    return NextResponse.json(
      { success: false, error: "Failed to deactivate rank." },
      { status: 500 }
    );
  }
}