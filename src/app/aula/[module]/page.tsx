import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth/session";
import { studentModules, PendingModule } from "@/components/auth/dashboard";
export default async function Module({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  await requireProfile();
  const { module } = await params;
  const selected = studentModules.find((m) => m.slug === module);
  if (!selected) notFound();
  return <PendingModule title={selected.title} />;
}
