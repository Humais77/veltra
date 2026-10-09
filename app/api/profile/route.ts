import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";

const schema = z.object({
  fullName: z
    .string()
    .min(2)
    .max(100),

  username: z
    .string()
    .min(3)
    .max(30)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores."
    ),

  phone: z
    .string()
    .min(10)
    .max(20),
});

export async function GET() {
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

  return NextResponse.json({
    success: true,

    user: {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      referralCode:
        user.referralCode,
      role: user.role,
    },
  });
}

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

    const data =
      schema.parse(
        await request.json()
      );

    const normalizedUsername =
      data.username
        .trim()
        .toLowerCase();

    const usernameOwner =
      await db.orm.public.User.first(
        {
          username:
            normalizedUsername,
        }
      );

    if (
      usernameOwner &&
      usernameOwner.id !== user.id
    ) {
      return NextResponse.json(
        {
          error:
            "Username already exists.",
        },
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
        {
          error:
            "Phone already exists.",
        },
        { status: 409 }
      );
    }

    const updated =
      await db.orm.public.User
        .where({ id: user.id })
        .update({
          fullName:
            data.fullName.trim(),

          username:
            normalizedUsername,

          phone:
            data.phone.trim(),
        });
        if (!updated) {
  return NextResponse.json(
    { error: "Unable to update profile." },
    { status: 500 }
  );
}


    return NextResponse.json({
      success: true,
      message:
        "Profile updated successfully.",
      user: {
        id: updated.id ,
        fullName:
          updated.fullName,
        username:
          updated.username,
        email:
          updated.email,
        phone:
          updated.phone,
        referralCode:
          updated.referralCode,
        role: updated.role,
      },
    });
  } catch (error) {
    console.error(
      "PROFILE_UPDATE_ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Invalid profile data.",
      },
      { status: 400 }
    );
  }
}