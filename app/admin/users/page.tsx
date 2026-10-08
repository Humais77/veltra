import {
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { db } from "@/src/prisma/db";

export default async function AdminUsersPage() {
  const users = await db.orm.public.User
    .orderBy((user) => user.createdAt.desc())
    .all();

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Header
          title="Users"
          description="View and manage all registered Veltra users."
        />

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#080b1f]">
          <div className="overflow-x-auto">
            {users.length === 0 ? (
              <Empty text="No users found." />
            ) : (
              <table className="w-full min-w-[950px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Balance</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-white/5 hover:bg-white/[0.015]"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-pink-500/10 p-2.5 text-pink-400">
                            <UserRound size={17} />
                          </div>

                          <div>
                            <p className="font-semibold">
                              {user.fullName}
                            </p>
                            <p className="text-xs text-gray-500">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="space-y-1 text-xs text-gray-400">
                          <p className="flex items-center gap-2">
                            <Mail size={13} />
                            {user.email}
                          </p>

                          <p className="flex items-center gap-2">
                            <Phone size={13} />
                            {user.phone}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="flex items-center gap-2 text-xs">
                          {user.role === "ADMIN" && (
                            <ShieldCheck
                              size={14}
                              className="text-pink-400"
                            />
                          )}
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-5 font-semibold">
                        Rs.{" "}
                        {Number(user.balance).toLocaleString(
                          "en-PK"
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <Status status={user.status} />
                      </td>

                      <td className="px-6 py-5 text-xs text-gray-500">
                        {new Date(
  user.createdAt.epochMilliseconds
).toLocaleDateString("en-PK")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Header({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <p className="text-sm font-semibold text-pink-400">
        Administration
      </p>

      <h1 className="mt-2 text-3xl font-black">{title}</h1>

      <p className="mt-2 text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}

function Status({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: "bg-emerald-400/10 text-emerald-400",
    BLOCKED: "bg-red-400/10 text-red-400",
    SUSPENDED: "bg-yellow-400/10 text-yellow-400",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] || "bg-white/10 text-gray-400"
      }`}
    >
      {status}
    </span>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="p-12 text-center text-sm text-gray-500">
      {text}
    </div>
  );
}