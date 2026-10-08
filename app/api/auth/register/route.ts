
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import crypto from "crypto";
import { or } from "@prisma/orm-postgres/orm-client";

import { db } from "@/src/prisma/db";

import { sendVerificationEmail } from "@/src/lib/email";
import { generateEmailCode, hashEmailCode } from "@/src/lib/email-code";

const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100),

    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30)
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers and underscores"
      ),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .max(150),

    phone: z
      .string()
      .trim()
      .min(10, "Please enter a valid phone number")
      .max(20),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100),

    confirmPassword: z
      .string()
      .min(6),

    referralCode: z
      .string()
      .trim()
      .optional(),

    country: z
      .string()
      .trim()
      .optional(),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

function generateReferralCode(username: string) {
  const prefix = username
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 4)
    .padEnd(4, "X");

  const random = crypto.randomInt(
    100000,
    1000000
  );

  return `${prefix}${random}`;
}

async function createUniqueReferralCode(
  username: string
) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const referralCode =
      generateReferralCode(username);

    const existing =
      await db.orm.public.User
        .where({ referralCode })
        .first();

    if (!existing) {
      return referralCode;
    }
  }

  throw new Error(
    "Unable to generate referral code"
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const data = registerSchema.parse(body);

    const username =
      data.username.toLowerCase();

    const email =
      data.email.toLowerCase();

    const phone = data.phone.trim();

    const existing =
      await db.orm.public.User
        .where((u) =>
          or(
            u.username.eq(username),
            u.email.eq(email),
            u.phone.eq(phone)
          )
        )
        .first();

    if (existing) {
      let error = "Account already exists";

      if (existing.username === username) {
        error = "Username is already taken";
      } else if (existing.email === email) {
        error = "Email is already registered";
      } else if (existing.phone === phone) {
        error = "Phone number is already registered";
      }

      return NextResponse.json(
        {
          success: false,
          error,
        },
        { status: 409 }
      );
    }

    let referredById:
      | string
      | undefined;

    if (data.referralCode) {
      const referrer =
        await db.orm.public.User
          .where({
            referralCode:
              data.referralCode.toUpperCase(),
          })
          .first();

      if (!referrer) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid referral code",
          },
          { status: 400 }
        );
      }

      if (referrer.status !== "ACTIVE") {
        return NextResponse.json(
          {
            success: false,
            error:
              "This referral account is not active",
          },
          { status: 400 }
        );
      }

      referredById = referrer.id;
    }

    const passwordHash =
      await bcrypt.hash(data.password, 12);

    const referralCode =
      await createUniqueReferralCode(username);

    const verificationCode =
      generateEmailCode();

    const verificationCodeHash =
      hashEmailCode(verificationCode);

    const verificationExpiresAt =
      new Date(Date.now() + 15 * 60 * 1000);

    const user =
      await db.orm.public.User.create({
        fullName: data.fullName,
        username,
        email,
        phone,
        passwordHash,
        referralCode,
        referredById,

        emailVerified: false,

        emailVerificationCodeHash:
          verificationCodeHash,

        emailVerificationExpiresAt:
          verificationExpiresAt,

        emailVerificationLastSentAt:
          new Date(),
      });

    /*
     * Send email after account creation.
     *
     * If SMTP temporarily fails, the account still exists
     * and the user can use "Resend verification code".
     */
    try {
      await sendVerificationEmail({
        email: user.email,
        fullName: user.fullName,
        code: verificationCode,
      });
    } catch (emailError) {
      console.error(
        "REGISTRATION_EMAIL_ERROR:",
        emailError
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created. Please verify your email.",
        userId: user.id,
        referralCode: user.referralCode,
        email: user.email,
        requiresEmailVerification: true,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error:
            error.issues[0]?.message ??
            "Invalid data",
        },
        { status: 400 }
      );
    }

    console.error(
      "REGISTER_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to create account",
      },
      { status: 500 }
    );
  }
}