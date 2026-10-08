import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";


import { createSession } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const user = await db.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Your account is not active" },
        { status: 403 }
      );
    }

    const valid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    await createSession(user.id);

    return NextResponse.json({
      success: true,
      role: user.role,
    });
  } catch {
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}