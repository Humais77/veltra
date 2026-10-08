
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";

export async function GET() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const deposits =
    await db.orm.public.Deposit
      .include("user")
      .orderBy((d) => d.createdAt.desc())
      .all();

  return NextResponse.json(
    serializeBigInts(deposits)
  );
}