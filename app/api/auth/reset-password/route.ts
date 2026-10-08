import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { db } from "@/src/prisma/db";
import { isCodeExpired, hashEmailCode } from "@/src/lib/email-code";


const schema = z
  .object({
    email: z.string().email(),

    code: z
      .string()
      .regex(
        /^\d{6}$/,
        "Reset code must be 6 digits"
      ),

    password: z
      .string()
      .min(
        6,
        "Password must be at least 6 characters"
      )
      .max(100),

    confirmPassword: z.string(),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const data = schema.parse(body);

    const email = data.email.toLowerCase();

    const user =
      await db.orm.public.User
        .where({ email })
        .first();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid reset code.",
        },
        { status: 400 }
      );
    }

    if (
      !user.passwordResetCodeHash ||
      !user.passwordResetExpiresAt
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No password reset request is available.",
        },
        { status: 400 }
      );
    }

    if (
      isCodeExpired(
        user.passwordResetExpiresAt
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Reset code has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    const submittedHash =
      hashEmailCode(data.code);

    if (
      submittedHash !==
      user.passwordResetCodeHash
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid reset code.",
        },
        { status: 400 }
      );
    }

    const passwordHash =
      await bcrypt.hash(data.password, 12);

    await db.orm.public.User
      .where({ id: user.id })
      .update({
        passwordHash,

        passwordResetCodeHash: null,
        passwordResetExpiresAt: null,
        passwordResetLastSentAt: null,
      });

    return NextResponse.json({
      success: true,
      message:
        "Password reset successfully. You can now login.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error:
            error.issues[0]?.message ??
            "Invalid reset data",
        },
        { status: 400 }
      );
    }

    console.error(
      "RESET_PASSWORD_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to reset password.",
      },
      { status: 500 }
    );
  }
}