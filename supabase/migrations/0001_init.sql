-- Behavior Bridge — Phase 1 schema, trigger, and RLS policies

create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  role        text not null check (role in ('parent','teacher','slp','counselor')),
  created_at  timestamptz not null default now()
);

create table behavior_tags (
  id          uuid primary key default gen_random_uuid(),
  label       text not null unique,
  sort_order  int  not null default 0,
  is_active   boolean not null default true,
  created_by  uuid references profiles(id),
  created_at  timestamptz not null default now()
);

create table behavior_entries (
  id          uuid primary key default gen_random_uuid(),
  tag_id      uuid not null references behavior_tags(id) on delete restrict,
  note        text,
  setting     text,
  logged_by   uuid not null references profiles(id),
  occurred_at timestamptz not null default now(),
  created_at  timestamptz not null default now()
);

create table rewards_catalog (
  id          uuid primary key default gen_random_uuid(),
  label       text not null unique,
  sort_order  int  not null default 0,
  is_active   boolean not null default true,
  created_by  uuid references profiles(id),
  created_at  timestamptz not null default now()
);

create table reward_events (
  id           uuid primary key default gen_random_uuid(),
  reward_id    uuid not null references rewards_catalog(id) on delete restrict,
  awarded_by   uuid not null references profiles(id),
  awarded_at   timestamptz not null default now(),
  redeemed_by  uuid references profiles(id),
  redeemed_at  timestamptz,
  note         text
);

create table invites (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  role        text not null check (role in ('teacher','slp','counselor')),
  invited_by  uuid not null references profiles(id),
  invited_at  timestamptz not null default now(),
  accepted_at timestamptz,
  status      text not null default 'pending' check (status in ('pending','accepted','revoked'))
);

-- Auto-create a profile whenever an invited user is created in auth.users
create function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Unnamed'),
          coalesce(new.raw_user_meta_data->>'role', 'teacher'));
  return new;
end; $$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row-Level Security

alter table profiles enable row level security;
alter table behavior_tags enable row level security;
alter table behavior_entries enable row level security;
alter table rewards_catalog enable row level security;
alter table reward_events enable row level security;
alter table invites enable row level security;

create function is_parent() returns boolean as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'parent');
$$ language sql security definer stable;

-- profiles: everyone can read (feed needs names); no writes via RLS at all
create policy "profiles_select_authenticated" on profiles
  for select to authenticated using (true);

-- behavior_tags: everyone reads; only parent manages
create policy "behavior_tags_select_authenticated" on behavior_tags
  for select to authenticated using (true);
create policy "behavior_tags_insert_parent" on behavior_tags
  for insert to authenticated with check (is_parent());
create policy "behavior_tags_update_parent" on behavior_tags
  for update to authenticated using (is_parent());
create policy "behavior_tags_delete_parent" on behavior_tags
  for delete to authenticated using (is_parent());

-- behavior_entries: everyone reads; anyone can log their own entry; immutable (no update/delete policy)
create policy "behavior_entries_select_authenticated" on behavior_entries
  for select to authenticated using (true);
create policy "behavior_entries_insert_own" on behavior_entries
  for insert to authenticated with check (logged_by = auth.uid());

-- rewards_catalog: everyone reads; only parent manages
create policy "rewards_catalog_select_authenticated" on rewards_catalog
  for select to authenticated using (true);
create policy "rewards_catalog_insert_parent" on rewards_catalog
  for insert to authenticated with check (is_parent());
create policy "rewards_catalog_update_parent" on rewards_catalog
  for update to authenticated using (is_parent());
create policy "rewards_catalog_delete_parent" on rewards_catalog
  for delete to authenticated using (is_parent());

-- reward_events: everyone reads; anyone can award; anyone can redeem (per decision)
create policy "reward_events_select_authenticated" on reward_events
  for select to authenticated using (true);
create policy "reward_events_insert_own" on reward_events
  for insert to authenticated with check (awarded_by = auth.uid());
create policy "reward_events_update_authenticated" on reward_events
  for update to authenticated using (true);

-- invites: parent-only, full stop
create policy "invites_all_parent" on invites
  for all to authenticated using (is_parent()) with check (is_parent());
