-- Stage 2. Apply once with the Supabase SQL Editor or `supabase db push`.
begin;
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create table public.roles (
  name text primary key check (name in ('teacher','student')),
  label text not null
);
insert into public.roles(name,label) values ('teacher','Administrador / docente'),('student','Estudiante');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) between 3 and 100),
  role text not null references public.roles(name),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index profiles_role_idx on public.profiles(role);

-- Minimal group scope. Academic management and assignment UI belong to stage 3.
create table public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 100),
  created_at timestamptz not null default now()
);
create table public.group_memberships (
  student_id uuid not null references public.profiles(id) on delete cascade,
  group_id uuid not null references public.groups(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (student_id,group_id)
);
create index group_memberships_group_idx on public.group_memberships(group_id);

-- No passwords or emails in the operation log.
create table private.account_operations (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.profiles(id),
  operation text not null check(operation in ('create_student_requested')),
  created_at timestamptz not null default now()
);
create index account_operations_actor_time_idx on private.account_operations(actor_id,created_at);
alter table private.account_operations enable row level security;

create function private.is_teacher() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role='teacher' and active);
$$;
create function private.is_active() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.profiles where id=auth.uid() and active);
$$;
create function private.in_group(target_group uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select private.is_active() and exists(select 1 from public.group_memberships where student_id=auth.uid() and group_id=target_group);
$$;
revoke all on function private.is_teacher(),private.is_active(),private.in_group(uuid) from public;
grant execute on function private.is_teacher(),private.is_active(),private.in_group(uuid) to authenticated;

create function private.touch_profile() returns trigger
language plpgsql set search_path = '' as $$ begin new.updated_at=now();return new;end; $$;
create trigger profiles_updated before update on public.profiles for each row execute function private.touch_profile();

alter table public.roles enable row level security;
alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_memberships enable row level security;
revoke all on public.roles,public.profiles,public.groups,public.group_memberships from anon,authenticated;
grant select on public.roles to authenticated;
grant select,insert,update on public.profiles to authenticated;
grant select,insert,update,delete on public.groups,public.group_memberships to authenticated;
grant all on public.roles,public.profiles,public.groups,public.group_memberships to service_role;

create policy roles_read on public.roles for select to authenticated using (true);
create policy profiles_read on public.profiles for select to authenticated
  using ((id=auth.uid() and active) or private.is_teacher());
-- Only a teacher can create/change student profiles; changing roles is not exposed.
create policy profiles_create_student on public.profiles for insert to authenticated
  with check(private.is_teacher() and role='student');
create policy profiles_update_student on public.profiles for update to authenticated
  using(private.is_teacher() and role='student') with check(private.is_teacher() and role='student');
create policy groups_read on public.groups for select to authenticated using(private.is_teacher() or private.in_group(id));
create policy groups_teacher_write on public.groups for all to authenticated using(private.is_teacher()) with check(private.is_teacher());
create policy memberships_read on public.group_memberships for select to authenticated
  using(private.is_teacher() or (student_id=auth.uid() and private.is_active()));
create policy memberships_teacher_write on public.group_memberships for all to authenticated
  using(private.is_teacher()) with check(private.is_teacher());

-- Persistent quota: serialized per actor, even across multiple server instances.
create function public.reserve_student_creation() returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not private.is_teacher() then raise exception 'not authorized' using errcode='42501';end if;
  perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text,0));
  if (select count(*) from private.account_operations where actor_id=auth.uid() and created_at>now()-interval '1 hour')>=30 then
    raise exception 'account creation limit exceeded' using errcode='54000';
  end if;
  insert into private.account_operations(actor_id,operation) values(auth.uid(),'create_student_requested');
end;$$;
revoke all on function public.reserve_student_creation() from public,anon;
grant execute on function public.reserve_student_creation() to authenticated;

-- One-time bootstrap: no default password, callable only with the server service key.
create function public.bootstrap_teacher(p_user_id uuid,p_full_name text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform pg_advisory_xact_lock(20261108);
  if exists(select 1 from public.profiles where role='teacher') then raise exception 'teacher already initialized';end if;
  if not exists(select 1 from auth.users where id=p_user_id and email_confirmed_at is not null) then raise exception 'confirmed Auth account required';end if;
  insert into public.profiles(id,full_name,role,active) values(p_user_id,p_full_name,'teacher',true);
end;$$;
revoke all on function public.bootstrap_teacher(uuid,text) from public,anon,authenticated;
grant execute on function public.bootstrap_teacher(uuid,text) to service_role;
commit;
