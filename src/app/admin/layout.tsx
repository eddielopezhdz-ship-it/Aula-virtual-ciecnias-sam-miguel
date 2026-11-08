import { requireProfile } from "@/lib/auth/session";
import { DashboardShell } from "@/components/auth/dashboard";
export const dynamic = "force-dynamic";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile("teacher");
  return <DashboardShell profile={profile}>{children}</DashboardShell>;
}
