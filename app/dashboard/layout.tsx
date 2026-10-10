import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/lib/auth";
import DashboardShell from "@/src/components/dashboard/DashboardShell";

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
    <DashboardShell
      user={{
        fullName: user.fullName,
        email: user.email,
      }}
    >
      {children}
    </DashboardShell>
  );
}