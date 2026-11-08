"use client";
import { useActionState } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { signIn } from "@/app/login/actions";
export function LoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(signIn, {});
  return (
    <form action={action} className="auth-form">
      <label>
        Correo de tu cuenta
        <input
          type="email"
          name="email"
          autoComplete="username"
          required
          maxLength={254}
          placeholder="Correo asignado a tu cuenta"
          disabled={!configured}
        />
      </label>
      <label>
        Contraseña
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          minLength={8}
          maxLength={128}
          required
          disabled={!configured}
        />
      </label>
      {state.error && (
        <p className="auth-error" role="alert">
          {state.error}
        </p>
      )}
      <button className="button" disabled={pending || !configured}>
        {pending ? "Ingresando…" : "Ingresar a mi aula"}
        <ArrowRight size={17} />
      </button>
      <p className="auth-hint">
        <LockKeyhole size={15} /> El docente crea las cuentas. No hay registro
        público. Si necesitas recuperar tu acceso, comunícate con él.
      </p>
    </form>
  );
}
