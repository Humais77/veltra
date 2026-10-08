import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/src/prisma/db";

import { sendPasswordResetEmail } from "@/src/lib/email";
import { canSendCode, generateEmailCode, hashEmailCode } from "@/src/lib/email-code";

const schema = z.object({
  email: z.string().email(),
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

    /*
     * Always return the same message.
     * This prevents account enumeration.
     */
    if (!user) {
      return NextResponse.json({
        success: true,
        message:
          "If an account exists with this email, a reset code has been sent.",
      });
    }

    if (
      !canSendCode(
        user.passwordResetLastSentAt,
        60
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please wait 60 seconds before requesting another reset code.",
        },
        { status: 429 }
      );
    }

    const code = generateEmailCode();

    const codeHash = hashEmailCode(code);

    const expiresAt =
      new Date(Date.now() + 10 * 60 * 1000);

    await db.orm.public.User
      .where({ id: user.id })
      .update({
        passwordResetCodeHash: codeHash,
        passwordResetExpiresAt: expiresAt,
        passwordResetLastSentAt:
          new Date(),
      });

    try {
      await sendPasswordResetEmail({
        email: user.email,
        fullName: user.fullName,
        code,
      });
    } catch (error) {
      console.error(
        "PASSWORD_RESET_EMAIL_ERROR:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to send reset email. Please try again later.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "If an account exists with this email, a reset code has been sent.",
      email,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error:
            error.issues[0]?.message ??
            "Invalid email",
        },
        { status: 400 }
      );
    }

    console.error(
      "FORGOT_PASSWORD_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to process password reset.",
      },
      { status: 500 }
    );
  }
}