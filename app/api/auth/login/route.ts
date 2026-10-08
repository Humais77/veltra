import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { createSession } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";

const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const data = loginSchema.parse(body);

    const username = data.username.toLowerCase();

     const user = await db.orm.public.User
      .where({ username })
      .first();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid username or password",
        },
        {
          status: 401,
        }
      );
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        {
          success: false,
          error: "Your account is not active",
        },
        {
          status: 403,
        }
      );
    }

    const validPassword = await bcrypt.compare(
      data.password,
      user.passwordHash
    );

    if (!validPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid username or password",
        },
        {
          status: 401,
        }
      );
    }

    await createSession(user.id);

    return NextResponse.json({
      success: true,
      role: user.role,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.issues[0]?.message ?? "Invalid login data",
        },
        {
          status: 400,
        }
      );
    }

    console.error("LOGIN_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Login failed",
      },
      {
        status: 500,
      }
    );
  }
}