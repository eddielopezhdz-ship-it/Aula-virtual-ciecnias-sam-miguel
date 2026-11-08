import { test } from "node:test";
import assert from "node:assert/strict";
import { provisionStudent, type AccountStore } from "../src/lib/auth/accounts";
import {
  canAccess,
  destination,
  loginSchema,
  studentSchema,
  type Profile,
} from "../src/lib/auth/validation";
const teacher: Profile = {
  id: "teacher",
  role: "teacher",
  full_name: "Docente de prueba",
  active: true,
};
const student: Profile = {
  id: "student",
  role: "student",
  full_name: "Estudiante ficticio",
  active: true,
};
const input = {
  email: "estudiante@example.invalid",
  fullName: "Estudiante de prueba",
};
function fixture() {
  const calls: string[] = [];
  const store: AccountStore = {
    reserve: async () => {
      calls.push("reserve");
    },
    create: async () => {
      calls.push("create");
      return "new-id";
    },
    saveProfile: async () => {
      calls.push("profile");
    },
    remove: async () => {
      calls.push("remove");
    },
  };
  return { calls, store };
}
test("login validation rejects invalid credentials, accepts valid structure", () => {
  assert.equal(
    loginSchema.safeParse({ email: "invalid", password: "123" }).success,
    false,
  );
  assert.equal(
    loginSchema.safeParse({
      email: input.email,
      password: "Ficticia-solo-prueba-123!",
    }).success,
    true,
  );
  assert.equal(
    studentSchema.safeParse({ ...input, fullName: "a" }).success,
    false,
  );
});
test("role destinations and inactive users", () => {
  assert.equal(destination("teacher"), "/admin");
  assert.equal(destination("student"), "/aula");
  assert.equal(canAccess(student, "teacher"), false);
  assert.equal(canAccess({ ...teacher, active: false }, "teacher"), false);
});
test("anonymous, student and inactive teacher cannot invoke account store", async () => {
  for (const actor of [null, student, { ...teacher, active: false }]) {
    const { calls, store } = fixture();
    await assert.rejects(
      () => provisionStudent(actor, input, store, () => ""),
      /autorizado/,
    );
    assert.deepEqual(calls, []);
  }
});
test("teacher creates Auth user and student profile after reserving quota", async () => {
  const { calls, store } = fixture();
  const result = await provisionStudent(
    teacher,
    input,
    store,
    () => "random-test-password",
  );
  assert.deepEqual(calls, ["reserve", "create", "profile"]);
  assert.equal(result.email, input.email);
  assert.equal(result.password, "random-test-password");
});
test("quota failure stops account creation", async () => {
  const { calls, store } = fixture();
  store.reserve = async () => {
    throw new Error("quota");
  };
  await assert.rejects(
    () => provisionStudent(teacher, input, store, () => ""),
    /quota/,
  );
  assert.deepEqual(calls, []);
});
test("profile failure compensates by removing the incomplete auth account", async () => {
  const { calls, store } = fixture();
  store.saveProfile = async () => {
    calls.push("profile");
    throw new Error("db");
  };
  await assert.rejects(
    () => provisionStudent(teacher, input, store, () => ""),
    /retirada/,
  );
  assert.deepEqual(calls, ["reserve", "create", "profile", "remove"]);
});
test("compensation failure requests manual remediation", async () => {
  const { store } = fixture();
  store.saveProfile = async () => {
    throw new Error("db");
  };
  store.remove = async () => {
    throw new Error("auth");
  };
  await assert.rejects(
    () => provisionStudent(teacher, input, store, () => ""),
    /quedó sin perfil/,
  );
});
