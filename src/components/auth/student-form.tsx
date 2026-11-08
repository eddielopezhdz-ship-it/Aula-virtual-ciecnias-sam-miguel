"use client";
import { useActionState } from "react";
import { createStudent } from "@/app/admin/estudiantes/actions";
export function StudentForm({ enabled }: { enabled: boolean }) {
  const [state, action, pending] = useActionState(createStudent, {});
  return (
    <form action={action} className="auth-form">
      <h2>Crear cuenta de estudiante</h2>
      <p className="auth-hint">
        Usa un correo al que tenga acceso la persona o el mecanismo
        institucional acordado. La contraseña se genera de forma aleatoria en el
        servidor.
      </p>
      <label>
        Nombre para mostrar
        <input
          name="fullName"
          required
          minLength={3}
          maxLength={100}
          disabled={!enabled}
          autoComplete="off"
        />
      </label>
      <label>
        Correo de la cuenta
        <input
          name="email"
          required
          type="email"
          maxLength={254}
          disabled={!enabled}
          autoComplete="off"
        />
      </label>
      <button disabled={pending || !enabled} className="button">
        {pending ? "Creando cuenta…" : "Crear cuenta"}
      </button>
      {!enabled && (
        <p className="auth-notice">
          La clave privada de creación de cuentas no está configurada en el
          servidor.
        </p>
      )}
      {state.error && (
        <p className="auth-error" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <div className="auth-success" role="status">
          <p>{state.success}</p>
          {state.credentials && (
            <>
              <p>
                Correo: <strong>{state.credentials.email}</strong>
              </p>
              <p>
                Contraseña temporal:{" "}
                <code className="one-time-secret">
                  {state.credentials.password}
                </code>
              </p>
              <p>
                No compartas esta pantalla ni guardes las credenciales en
                archivos públicos.
              </p>
            </>
          )}
        </div>
      )}
    </form>
  );
}
