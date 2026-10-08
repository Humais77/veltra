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

  const transactions =
    await db.orm.public.Transaction
      .where({
        userId: user.id,
      })
      .orderBy((t) => t.createdAt.desc())
      .all();

  return NextResponse.json(
    serializeBigInts(transactions)
  );
}