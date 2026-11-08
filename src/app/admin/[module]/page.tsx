import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth/session";
import { teacherModules, PendingModule } from "@/components/auth/dashboard";
export default async function Module({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  await requireProfile("teacher");
  const { module } = await params;
  const selected = teacherModules.find((m) => m.slug === module);
  if (!selected) notFound();
  return <PendingModule title={selected.title} />;
}
