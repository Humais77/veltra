import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { comparePassword, hashPassword } from "@/src/lib/password";


const schema = z.object({
  currentPassword: z
    .string()
    .min(1, "Current password is required."),

  newPassword: z
    .string()
    .min(
      8,
      "New password must be at least 8 characters."
    ),

  confirmPassword: z
    .string()
    .min(
      8,
      "Please confirm your new password."
    ),
});

export async function PATCH(
  request: Request
) {
  try {
    const user =
      await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body =
      await request.json();

    const parsed =
      schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]
              ?.message ||
            "Invalid password data.",
        },
        { status: 400 }
      );
    }

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = parsed.data;

    if (
      newPassword !==
      confirmPassword
    ) {
      return NextResponse.json(
        {
          error:
            "New passwords do not match.",
        },
        { status: 400 }
      );
    }

    if (
      currentPassword ===
      newPassword
    ) {
      return NextResponse.json(
        {
          error:
            "New password must be different from your current password.",
        },
        { status: 400 }
      );
    }

    const isCurrentPasswordValid =
      await comparePassword(
        currentPassword,
        user.passwordHash
      );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        {
          error:
            "Current password is incorrect.",
        },
        { status: 400 }
      );
    }

    const passwordHash =
      await hashPassword(
        newPassword
      );

    await db.orm.public.User
      .where({ id: user.id })
      .update({
        passwordHash,
      });

    return NextResponse.json({
      success: true,
      message:
        "Password changed successfully.",
    });
  } catch (error) {
    console.error(
      "PROFILE_PASSWORD_ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to change password.",
      },
      { status: 500 }
    );
  }
}