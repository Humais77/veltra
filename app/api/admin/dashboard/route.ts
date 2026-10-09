import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/money";

export async function GET() {
  const admin = await getCurrentUser();

  if (!admin || admin.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const [
    users,
    plans,
    pendingDeposits,
    pendingWithdrawals,
    investments,
    transactions,
  ] = await Promise.all([
    db.orm.public.User.aggregate((a) => ({
      total: a.count(),
    })),

    db.orm.public.Plan.aggregate((a) => ({
      total: a.count(),
    })),

    db.orm.public.Deposit
      .where({ status: "PENDING" })
      .aggregate((a) => ({
        total: a.count(),
      })),

    db.orm.public.Withdrawal
      .where({ status: "PENDING" })
      .aggregate((a) => ({
        total: a.count(),
      })),

    db.orm.public.Investment.aggregate((a) => ({
      total: a.count(),
    })),

    db.orm.public.Transaction.aggregate((a) => ({
      total: a.count(),
    })),
  ]);

  return NextResponse.json({
    users: users.total,
    plans: plans.total,
    pendingDeposits: pendingDeposits.total,
    pendingWithdrawals: pendingWithdrawals.total,
    investments: investments.total,
    transactions: transactions.total,
  });
}