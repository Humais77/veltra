import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  { params }: Params
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  const investment =
    await db.orm.public.Investment
      .where({ id })
      .include("plan")
      .first();

  if (!investment) {
    return NextResponse.json(
      { error: "Investment not found" },
      { status: 404 }
    );
  }

  if (
    investment.userId !== user.id &&
    user.role !== "ADMIN"
  ) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  return NextResponse.json(
    serializeBigInts(investment)
  );
}