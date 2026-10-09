import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";

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

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const ranks = await db.orm.public.Rank.all();

    ranks.sort((a: any, b: any) => a.level - b.level);

    return NextResponse.json({
      success: true,
      ranks: serializeBigInts(ranks),
    });
  } catch (error) {
    console.error("ADMIN_RANKS_GET", error);
    return NextResponse.json(
      { success: false, error: "Failed to load ranks." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const name =
      typeof body.name === "string" ? body.name.trim() : "";
    const level = Number(body.level);
    const minOwnInvestment = rupeesToPaisa(body.minOwnInvestment);
    const minReferralInvestment = rupeesToPaisa(
      body.minReferralInvestment
    );
    const bonus = rupeesToPaisa(body.bonus ?? 0);

    if (
      !name ||
      name.length > 80 ||
      !Number.isInteger(level) ||
      level < 1 ||
      level > 100 ||
      minOwnInvestment === null ||
      minReferralInvestment === null ||
      bonus === null
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid rank details." },
        { status: 400 }
      );
    }

    const existingRanks = await db.orm.public.Rank.all();

    if (existingRanks.some((rank: any) => rank.level === level)) {
      return NextResponse.json(
        { success: false, error: "That rank level already exists." },
        { status: 409 }
      );
    }

    const rank = await db.orm.public.Rank.create({
      level,
      name,
      minOwnInvestment,
      minReferralInvestment,
      bonus,
      isActive: body.isActive !== false,
    });

    return NextResponse.json(
      {
        success: true,
        rank: serializeBigInts(rank),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADMIN_RANKS_POST", error);
    return NextResponse.json(
      { success: false, error: "Failed to create rank." },
      { status: 500 }
    );
  }
}