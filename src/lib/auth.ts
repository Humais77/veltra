import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

import { db } from "@/src/prisma/db";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

const secret = new TextEncoder().encode(JWT_SECRET);

const COOKIE_NAME = "veltra_session";

export async function createSession(userId: string) {
  const token = await new SignJWT({
    userId,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession() {
  const cookieStore = await cookies();

  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    if (!payload.userId || typeof payload.userId !== "string") {
      return null;
    }

    return {
      userId: payload.userId,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const user = await db.orm.public.User.where({
  id: session.userId,
}).first();

  if (!user) {
    return null;
  }

  if (user.status !== "ACTIVE") {
    return null;
  }

  return user;
}

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete(COOKIE_NAME);
}