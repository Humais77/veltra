
import { getSession } from "@/src/lib/auth";
import { db } from "../prisma/db";

export async function requireAdmin() {
  const session = await getSession();

  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  const user = await db.user.findUnique({
    where: {
      id: session.userId,
    },
    select: {
      id: true,
      role: true,
      status: true,
    },
  });

  if (!user || user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("ACCOUNT_DISABLED");
  }

  return user;
}