
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/lib/auth";
import AdminSidebar from "@/src/components/admin/sidebar";

async function AdminAuthCheck({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050714] text-white">
      <Suspense fallback={<AdminLoading />}>
        <AdminAuthCheck>
          <AdminSidebar />

          {/* Desktop sidebar spacer + responsive page content */}
          <div className="min-h-screen min-w-0 lg:pl-[260px]">
            <main className="min-w-0">{children}</main>
          </div>
        </AdminAuthCheck>
      </Suspense>
    </div>
  );
}

function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050714]">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-violet-700 text-2xl font-black text-white">
          V
        </div>
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-pink-400 border-t-transparent" />
        <p className="text-xs font-medium tracking-wide text-gray-500">
          Loading administration...
        </p>
      </div>
    </div>
  );
}
