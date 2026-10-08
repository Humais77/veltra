import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";

export async function GET() {
  try {
    const admin = await getCurrentUser();

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const investments =
      await db.orm.public.Investment
        .include("user")
        .include("plan")
        .orderBy((investment) =>
          investment.createdAt.desc()
        )
        .all();

    return NextResponse.json({
      investments:
        serializeBigInts(investments),
    });
  } catch (error) {
    console.error(
      "ADMIN_INVESTMENTS_GET_ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load investments",
      },
      { status: 500 }
    );
  }
}