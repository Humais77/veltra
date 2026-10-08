import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { db } from "@/src/prisma/db";

const schema = z.object({
  fullName: z.string().min(2),
  username: z.string().min(3).max(30),
  phone: z.string().min(10),
  email: z.string().email(),
  password: z.string().min(6),
  referralCode: z.string().optional(),
});

function generateReferralCode(username: string) {
  return (
    username.toUpperCase().slice(0, 4) +
    Math.floor(100000 + Math.random() * 900000)
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const data = schema.parse(body);

    const existing = await db.user.findFirst({
      where: {
        OR: [
          { username: data.username },
          { email: data.email },
          { phone: data.phone },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Username, email or phone already exists" },
        { status: 409 }
      );
    }

    let referredById: string | undefined;

    if (data.referralCode) {
      const referrer = await db.user.findUnique({
        where: {
          referralCode: data.referralCode,
        },
      });

      if (!referrer) {
        return NextResponse.json(
          { error: "Invalid referral code" },
          { status: 400 }
        );
      }

      referredById = referrer.id;
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await db.user.create({
      data: {
        fullName: data.fullName,
        username: data.username,
        phone: data.phone,
        email: data.email,
        passwordHash,
        referralCode: generateReferralCode(data.username),
        referredById,
      },
    });

    return NextResponse.json({
      success: true,
      userId: user.id,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid registration data" },
      { status: 400 }
    );
  }
}