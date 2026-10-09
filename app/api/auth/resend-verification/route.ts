import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/src/prisma/db";

import { sendVerificationEmail } from "@/src/lib/email";
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
     * Do not reveal whether an email exists.
     */
    if (!user) {
      return NextResponse.json({
        success: true,
        message:
          "If the account exists, a verification code has been sent.",
      });
    }

    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: "Email is already verified.",
      });
    }

    if (
      !canSendCode(
        user.emailVerificationLastSentAt,
        60
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please wait 60 seconds before requesting another code.",
        },
        { status: 429 }
      );
    }

    const code = generateEmailCode();

    const codeHash = hashEmailCode(code);

    const expiresAt =
      new Date(Date.now() + 15 * 60 * 1000);

    await db.orm.public.User
      .where({ id: user.id })
      .update({
        emailVerificationCodeHash: codeHash,
        emailVerificationExpiresAt: expiresAt,
        emailVerificationLastSentAt:
          new Date(),
      });

    try {
      await sendVerificationEmail({
        email: user.email,
        fullName: user.fullName,
        code,
      });
    } catch (error) {
      console.error(
        "RESEND_VERIFICATION_EMAIL_ERROR:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to send verification email. Please try again later.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "A new verification code has been sent.",
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
      "RESEND_VERIFICATION_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to resend verification code.",
      },
      { status: 500 }
    );
  }
}