import "server-only";
import { redirect } from "next/navigation";
import { authConfigured } from "@/lib/supabase/config";
import { createServerSupabase } from "@/lib/supabase/server";
import { canAccess, type Profile } from "./validation";
export async function getProfile(): Promise<Profile | null> {
  if (!authConfigured()) return null;
  const db = await createServerSupabase();
  const {
    data: { user },
    error,
  } = await db.auth.getUser();
  if (error || !user) return null;
  const { data, error: profileError } = await db
    .from("profiles")
    .select("id,full_name,role,active")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError || !data) return null;
  return data as Profile;
}
export async function requireProfile(role?: Profile["role"]) {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  if (!canAccess(profile, role)) redirect("/acceso-denegado");
  return profile;
}
