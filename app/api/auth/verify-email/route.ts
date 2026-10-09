import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/src/prisma/db";
import { isCodeExpired, hashEmailCode } from "@/src/lib/email-code";


const schema = z.object({
  email: z.string().email(),
  code: z
    .string()
    .regex(/^\d{6}$/, "Verification code must be 6 digits"),
});

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
          error: "Invalid verification code",
        },
        { status: 400 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: "Email is already verified.",
      });
    }

    if (
      !user.emailVerificationCodeHash ||
      !user.emailVerificationExpiresAt
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No verification code is available. Please request a new code.",
        },
        { status: 400 }
      );
    }

    if (
      isCodeExpired(
        user.emailVerificationExpiresAt
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Verification code has expired. Please request a new code.",
        },
        { status: 400 }
      );
    }

    const submittedHash =
      hashEmailCode(data.code);

    if (
      submittedHash !==
      user.emailVerificationCodeHash
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid verification code.",
        },
        { status: 400 }
      );
    }

    await db.orm.public.User
      .where({ id: user.id })
      .update({
        emailVerified: true,
        emailVerificationCodeHash: null,
        emailVerificationExpiresAt: null,
        emailVerificationLastSentAt: null,
      });

    return NextResponse.json({
      success: true,
      message:
        "Email verified successfully.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error:
            error.issues[0]?.message ??
            "Invalid verification data",
        },
        { status: 400 }
      );
    }

    console.error(
      "VERIFY_EMAIL_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to verify email.",
      },
      { status: 500 }
    );
  }
}