import { redirect } from "next/navigation";

import { getCurrentUser } from "@/src/lib/auth";
import DashboardHeader from "@/src/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/src/components/dashboard/DashboardSidebar";


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-[#050814] text-white">
      <DashboardSidebar />

      <div className="lg:pl-72">
        <main className="min-h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}