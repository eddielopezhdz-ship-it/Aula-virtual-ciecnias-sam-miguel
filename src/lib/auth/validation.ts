import { z } from "zod";
export const loginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(8).max(128),
});
export const studentSchema = z.object({
  fullName: z.string().trim().min(3).max(100),
  email: z.email().max(254),
});
export type Profile = {
  id: string;
  full_name: string;
  role: "teacher" | "student";
  active: boolean;
};
export function destination(role: Profile["role"]) {
  return role === "teacher" ? "/admin" : "/aula";
}
export function canAccess(profile: Profile | null, role?: Profile["role"]) {
  return Boolean(profile?.active && (!role || profile.role === role));
}
export type FormState = {
  error?: string;
  success?: string;
  credentials?: { email: string; password: string };
};
