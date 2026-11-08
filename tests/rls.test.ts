import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
const teacher = "11111111-1111-4111-8111-111111111111",
  student = "22222222-2222-4222-8222-222222222222",
  other = "33333333-3333-4333-8333-333333333333";
const groupA = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  groupB = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
test("PostgreSQL migration and RLS enforce account isolation", async (t) => {
  const db = new PGlite();
  try {
    await db.exec(
      `create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls; create schema auth; create table auth.users(id uuid primary key,email_confirmed_at timestamptz); create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$; grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated;`,
    );
    await db.exec(
      await readFile(
        new URL(
          "../supabase/migrations/202611080001_auth_accounts.sql",
          import.meta.url,
        ),
        "utf8",
      ),
    );
    await db.exec(
      `insert into auth.users values ('${teacher}',now()),('${student}',now()),('${other}',now());`,
    );
    await t.test(
      "bootstrap is service-only and runs exactly once",
      async () => {
        await db.exec("set role anon");
        await assert.rejects(() =>
          db.query("select public.bootstrap_teacher($1,$2)", [
            teacher,
            "Docente ficticio",
          ]),
        );
        await db.exec("reset role; set role service_role");
        await db.query("select public.bootstrap_teacher($1,$2)", [
          teacher,
          "Docente ficticio",
        ]);
        await assert.rejects(() =>
          db.query("select public.bootstrap_teacher($1,$2)", [
            other,
            "Otro docente",
          ]),
        );
        await db.exec("reset role");
      },
    );
    await db.exec(
      `insert into public.profiles(id,full_name,role) values('${student}','Estudiante ficticio A','student'),('${other}','Estudiante ficticio B','student');insert into public.groups(id,name) values('${groupA}','Grupo ficticio A'),('${groupB}','Grupo ficticio B');insert into public.group_memberships(student_id,group_id) values('${student}','${groupA}'),('${other}','${groupB}');`,
    );
    async function asUser(id: string) {
      await db.exec("reset role");
      await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
        id,
      ]);
      await db.exec("set role authenticated");
    }
    await t.test("anonymous cannot read profiles or groups", async () => {
      await db.exec("set role anon");
      await assert.rejects(() => db.query("select * from public.profiles"));
      await assert.rejects(() => db.query("select * from public.groups"));
      await db.exec("reset role");
    });
    await t.test("student sees only own profile and group", async () => {
      await asUser(student);
      assert.deepEqual(
        (await db.query("select id from public.profiles")).rows,
        [{ id: student }],
      );
      assert.deepEqual((await db.query("select id from public.groups")).rows, [
        { id: groupA },
      ]);
      assert.equal(
        (await db.query("select * from public.group_memberships")).rows.length,
        1,
      );
    });
    await t.test(
      "student cannot promote self, change name, create accounts or call bootstrap",
      async () => {
        await asUser(student);
        assert.equal(
          (
            await db.query(
              "update public.profiles set role='teacher' where id=$1 returning id",
              [student],
            )
          ).rows.length,
          0,
        );
        assert.equal(
          (
            await db.query(
              "update public.profiles set full_name='Otro nombre' where id=$1 returning id",
              [student],
            )
          ).rows.length,
          0,
        );
        await assert.rejects(() =>
          db.query(
            "insert into public.profiles(id,full_name,role) values(gen_random_uuid(),'Invasor ficticio','teacher')",
          ),
        );
        await assert.rejects(() =>
          db.query("select public.reserve_student_creation()"),
        );
        await assert.rejects(() =>
          db.query("select public.bootstrap_teacher($1,$2)", [
            student,
            "Invasor ficticio",
          ]),
        );
      },
    );
    await t.test(
      "teacher reads students and quota stops the 31st request",
      async () => {
        await asUser(teacher);
        assert.equal(
          (await db.query("select id from public.profiles")).rows.length,
          3,
        );
        for (let i = 0; i < 30; i++)
          await db.query("select public.reserve_student_creation()");
        await assert.rejects(() =>
          db.query("select public.reserve_student_creation()"),
        );
      },
    );
    await t.test(
      "teacher can insert a student profile, without creating an administrator",
      async () => {
        const newId = "44444444-4444-4444-8444-444444444444";
        await db.exec("reset role");
        await db.query("insert into auth.users values ($1, now())", [newId]);
        await asUser(teacher);
        await db.query(
          "insert into public.profiles(id,full_name,role) values ($1,'Nuevo estudiante ficticio','student')",
          [newId],
        );
        assert.equal(
          (
            await db.query<{ role: string }>(
              "select role from public.profiles where id=$1",
              [newId],
            )
          ).rows[0].role,
          "student",
        );
      },
    );
    await t.test(
      "teacher cannot promote a student through the public table",
      async () => {
        await asUser(teacher);
        await assert.rejects(() =>
          db.query("update public.profiles set role='teacher' where id=$1", [
            student,
          ]),
        );
      },
    );
    await t.test(
      "inactive student loses profile and group access",
      async () => {
        await db.exec("reset role");
        await db.query("update public.profiles set active=false where id=$1", [
          student,
        ]);
        await asUser(student);
        assert.equal(
          (await db.query("select * from public.profiles")).rows.length,
          0,
        );
        assert.equal(
          (await db.query("select * from public.groups")).rows.length,
          0,
        );
      },
    );
    await t.test("operation audit is private", async () => {
      await asUser(other);
      await assert.rejects(() =>
        db.query("select * from private.account_operations"),
      );
    });
  } finally {
    await db.close();
  }
});
