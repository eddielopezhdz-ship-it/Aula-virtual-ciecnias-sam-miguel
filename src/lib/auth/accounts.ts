import { canAccess, studentSchema, type Profile } from "./validation";
export type AccountStore = {
  reserve: () => Promise<void>;
  create: (email: string, password: string) => Promise<string>;
  saveProfile: (id: string, fullName: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
};
// Dependencies are injected so failure handling and authorization can be tested without credentials.
export async function provisionStudent(
  actor: Profile | null,
  input: unknown,
  store: AccountStore,
  generatePassword: () => string,
) {
  if (!canAccess(actor, "teacher")) throw new Error("Acceso no autorizado.");
  const parsed = studentSchema.parse(input);
  await store.reserve();
  const password = generatePassword();
  const id = await store.create(parsed.email, password);
  try {
    await store.saveProfile(id, parsed.fullName);
  } catch {
    try {
      await store.remove(id);
    } catch {
      throw new Error(
        "La cuenta quedó sin perfil. Debe revisarse en Supabase Auth antes de volver a crearla.",
      );
    }
    throw new Error(
      "No se pudo crear el perfil. La cuenta incompleta fue retirada.",
    );
  }
  return { email: parsed.email, password };
}
