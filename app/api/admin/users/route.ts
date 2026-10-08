import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";
import { randomInt } from "crypto";
import { hashPassword } from "@/src/lib/password";

function generateReferralCode(username: string) {
  return `${username
    .slice(0, 5)
    .toUpperCase()}${randomInt(100000, 1000000)}`;
}

async function generateUniqueReferralCode(username: string) {
  let code = "";
  let exists = true;

  while (exists) {
    code = generateReferralCode(username);

    const existing = await db.orm.public.User.first({
      referralCode: code,
    });

    exists = !!existing;
  }

  return code;
}

/*
|--------------------------------------------------------------------------
| GET - List users
|--------------------------------------------------------------------------
*/

export async function GET() {
  try {
    const admin = await getCurrentUser();

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const users = await db.orm.public.User
      .select(
        "id",
        "fullName",
        "username",
        "email",
        "phone",
        "role",
        "status",
        "balance",
        "totalDeposit",
        "totalWithdrawal",
        "totalReward",
        "totalCommission",
        "referralCode",
        "referredById",
        "createdAt"
      )
      .orderBy((user) => user.createdAt.desc())
      .all();

    return NextResponse.json({
      success: true,
      users: serializeBigInts(users),
    });
  } catch (error) {
    console.error("ADMIN_USERS_GET_ERROR", error);

    return NextResponse.json(
      {
        error: "Failed to load users",
      },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| POST - Create user
|--------------------------------------------------------------------------
*/

export async function POST(request: Request) {
  try {
    const admin = await getCurrentUser();

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const fullName = String(body.fullName || "").trim();
    const username = String(body.username || "")
      .trim()
      .toLowerCase();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const phone = String(body.phone || "").trim();
    const password = String(body.password || "");

    const role =
      body.role === "ADMIN"
        ? "ADMIN"
        : "USER";

    const status =
      ["ACTIVE", "BLOCKED", "SUSPENDED"].includes(
        body.status
      )
        ? body.status
        : "ACTIVE";

    if (fullName.length < 2) {
      return NextResponse.json(
        { error: "Full name is required." },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      return NextResponse.json(
        {
          error:
            "Username must be 3-30 characters and contain only letters, numbers and underscores.",
        },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    const existingEmail =
      await db.orm.public.User.first({
        email,
      });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists." },
        { status: 409 }
      );
    }

    const existingUsername =
      await db.orm.public.User.first({
        username,
      });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already exists." },
        { status: 409 }
      );
    }

    const passwordHash =
      await hashPassword(password);

    const referralCode =
      await generateUniqueReferralCode(username);

    const user =
      await db.orm.public.User.create({
        fullName,
        username,
        email,
        phone,
        passwordHash,
        role,
        status,
        referralCode,
      });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully.",
        user: serializeBigInts(user),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADMIN_USERS_POST_ERROR", error);

    return NextResponse.json(
      {
        error: "Failed to create user.",
      },
      { status: 500 }
    );
  }
}