import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const investments =
      await db.orm.public.Investment
        .where({
          userId: user.id,
        })
        .include("plan")
        .orderBy((i) =>
          i.createdAt.desc()
        )
        .all();

    const runningInvestments =
      investments.filter(
        (investment) =>
          investment.status === "ACTIVE"
      );

    return NextResponse.json({
      success: true,
      investments:
        serializeBigInts(investments),
      runningInvestments:
        serializeBigInts(
          runningInvestments
        ),
    });
  } catch (error) {
    console.error(
      "GET_INVESTMENTS_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load investments",
        investments: [],
        runningInvestments: [],
      },
      { status: 500 }
    );
  }
}