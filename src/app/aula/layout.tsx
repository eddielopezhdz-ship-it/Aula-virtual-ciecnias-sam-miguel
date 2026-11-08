import { requireProfile } from "@/lib/auth/session";
import { DashboardShell } from "@/components/auth/dashboard";
export const dynamic = "force-dynamic";
export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();
  return <DashboardShell profile={profile}>{children}</DashboardShell>;
}
