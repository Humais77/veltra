import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";
import { hashPassword } from "@/src/lib/password";

type Params = {
  params: Promise<{ id: string }>;
};

/*
|--------------------------------------------------------------------------
| PATCH - Update user
|--------------------------------------------------------------------------
*/

export async function PATCH(
  request: Request,
  { params }: Params
) {
  try {
    const admin = await getCurrentUser();

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const existing =
      await db.orm.public.User.first({ id });

    if (!existing) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    /*
     * Prevent admin from accidentally removing
     * their own admin access.
     */
    if (
      id === admin.id &&
      body.role &&
      body.role !== "ADMIN"
    ) {
      return NextResponse.json(
        {
          error:
            "You cannot remove your own admin role.",
        },
        { status: 400 }
      );
    }

    const update: Record<string, unknown> = {};

    if (body.fullName !== undefined) {
      const fullName =
        String(body.fullName).trim();

      if (fullName.length < 2) {
        return NextResponse.json(
          {
            error:
              "Full name must contain at least 2 characters.",
          },
          { status: 400 }
        );
      }

      update.fullName = fullName;
    }

    if (body.username !== undefined) {
      const username =
        String(body.username)
          .trim()
          .toLowerCase();

      if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
        return NextResponse.json(
          {
            error:
              "Invalid username.",
          },
          { status: 400 }
        );
      }

      const owner =
        await db.orm.public.User.first({
          username,
        });

      if (owner && owner.id !== id) {
        return NextResponse.json(
          {
            error:
              "Username already exists.",
          },
          { status: 409 }
        );
      }

      update.username = username;
    }

    if (body.email !== undefined) {
      const email =
        String(body.email)
          .trim()
          .toLowerCase();

      const owner =
        await db.orm.public.User.first({
          email,
        });

      if (owner && owner.id !== id) {
        return NextResponse.json(
          {
            error:
              "Email already exists.",
          },
          { status: 409 }
        );
      }

      update.email = email;
    }

    if (body.phone !== undefined) {
      update.phone =
        String(body.phone).trim();
    }

    if (body.role !== undefined) {
      if (
        body.role !== "USER" &&
        body.role !== "ADMIN"
      ) {
        return NextResponse.json(
          {
            error: "Invalid role.",
          },
          { status: 400 }
        );
      }

      update.role = body.role;
    }

    if (body.status !== undefined) {
      if (
        ![
          "ACTIVE",
          "BLOCKED",
          "SUSPENDED",
        ].includes(body.status)
      ) {
        return NextResponse.json(
          {
            error: "Invalid status.",
          },
          { status: 400 }
        );
      }

      update.status = body.status;
    }

    /*
     * Optional admin password reset.
     */
    if (body.password !== undefined) {
      const password =
        String(body.password);

      if (password.length < 8) {
        return NextResponse.json(
          {
            error:
              "Password must be at least 8 characters.",
          },
          { status: 400 }
        );
      }

      update.passwordHash =
        await hashPassword(password);
    }

    if (
      Object.keys(update).length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "No valid changes were provided.",
        },
        { status: 400 }
      );
    }

    const user =
      await db.orm.public.User
        .where({ id })
        .update(update);

    return NextResponse.json({
      success: true,
      message: "User updated successfully.",
      user: serializeBigInts(user),
    });
  } catch (error) {
    console.error(
      "ADMIN_USER_PATCH_ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update user.",
      },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| DELETE - Safely deactivate user
|--------------------------------------------------------------------------
|
| We intentionally do NOT physically delete users.
| Users can have investments, deposits, withdrawals,
| transactions and referral relationships.
|--------------------------------------------------------------------------
*/

export async function DELETE(
  _request: Request,
  { params }: Params
) {
  try {
    const admin = await getCurrentUser();

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (id === admin.id) {
      return NextResponse.json(
        {
          error:
            "You cannot deactivate your own account.",
        },
        { status: 400 }
      );
    }

    const existing =
      await db.orm.public.User.first({ id });

    if (!existing) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    await db.orm.public.User
      .where({ id })
      .update({
        status: "BLOCKED",
      });

    return NextResponse.json({
      success: true,
      message:
        "User has been deactivated.",
    });
  } catch (error) {
    console.error(
      "ADMIN_USER_DELETE_ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to deactivate user.",
      },
      { status: 500 }
    );
  }
}