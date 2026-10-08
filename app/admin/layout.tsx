// app/admin/layout.tsx
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/lib/auth";
import AdminSidebar from "@/src/components/admin/sidebar";

async function AdminAuthCheck({ children }: { children: React.ReactNode }) {
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
    <div className="min-h-screen bg-[#050814] text-white">
      <Suspense fallback={<AdminLoading />}>
        <AdminAuthCheck>
          <div className="flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </AdminAuthCheck>
      </Suspense>
    </div>
  );
}

function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-400 border-t-transparent" />
    </div>
  );
}