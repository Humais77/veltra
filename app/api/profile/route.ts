import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";

const schema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().min(10).max(20),
  email: z.string().email(),
});

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    phone: user.phone,
    email: user.email,
    referralCode: user.referralCode,
    role: user.role,
  });
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const data = schema.parse(
      await request.json()
    );

    const emailOwner =
      await db.orm.public.User.first({
        email: data.email,
      });

    if (
      emailOwner &&
      emailOwner.id !== user.id
    ) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    const phoneOwner =
      await db.orm.public.User.first({
        phone: data.phone,
      });

    if (
      phoneOwner &&
      phoneOwner.id !== user.id
    ) {
      return NextResponse.json(
        { error: "Phone already exists" },
        { status: 409 }
      );
    }

    const updated =
      await db.orm.public.User
        .where({ id: user.id })
        .update({
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
        });

    return NextResponse.json(
      serializeBigInts(updated)
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid profile data" },
      { status: 400 }
    );
  }
}