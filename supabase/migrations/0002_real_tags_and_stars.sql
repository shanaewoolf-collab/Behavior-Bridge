-- Behavior Bridge — real tag content + daily star system
-- Replaces the placeholder tag set and the threshold/catalog reward design.

-- Clear placeholder tags and the one test entry logged against them during M4.
delete from behavior_entries;
delete from behavior_tags;

-- Each tag now has a type (for color-coding) and whether a note is mandatory.
alter table behavior_tags
  add column type text check (type in ('positive', 'challenging')),
  add column note_required boolean not null default false;

insert into behavior_tags (label, type, note_required, sort_order) values
  ('Followed direction, 1st ask', 'positive', false, 1),
  ('On-task through work block', 'positive', false, 2),
  ('Nice conversation exchange', 'positive', false, 3),
  ('Needed 1 redirect', 'challenging', false, 4),
  ('Left area without permission', 'challenging', false, 5),
  ('Shared something to "swallow"', 'challenging', false, 6),
  ('Big reaction (physical/verbal)', 'challenging', false, 7),
  ('Other', null, true, 8);

-- Out with the unused threshold/catalog reward design (never had any UI built on it) ...
drop table if exists reward_events;
drop table if exists rewards_catalog;

-- ... in with a daily star system: any team member can give one, no note, no redeem.
create table children (
  id   uuid primary key default gen_random_uuid(),
  name text not null
);
insert into children (name) values ('Truman');

create table stars (
  id         uuid primary key default gen_random_uuid(),
  awarded_by uuid not null references profiles(id),
  awarded_at timestamptz not null default now()
);

-- Historized threshold + reward description, so past values (4, then 5, then 6) stay on record.
create table reward_settings (
  id                 uuid primary key default gen_random_uuid(),
  child_id           uuid not null references children(id),
  stars_required     int not null,
  reward_description text not null,
  effective_date     date not null,
  created_at         timestamptz not null default now()
);

alter table children enable row level security;
alter table stars enable row level security;
alter table reward_settings enable row level security;

create policy "children_select_authenticated" on children
  for select to authenticated using (true);
create policy "children_insert_parent" on children
  for insert to authenticated with check (is_parent());
create policy "children_update_parent" on children
  for update to authenticated using (is_parent());
create policy "children_delete_parent" on children
  for delete to authenticated using (is_parent());

create policy "stars_select_authenticated" on stars
  for select to authenticated using (true);
create policy "stars_insert_own" on stars
  for insert to authenticated with check (awarded_by = auth.uid());

create policy "reward_settings_select_authenticated" on reward_settings
  for select to authenticated using (true);
create policy "reward_settings_insert_parent" on reward_settings
  for insert to authenticated with check (is_parent());
create policy "reward_settings_update_parent" on reward_settings
  for update to authenticated using (is_parent());
create policy "reward_settings_delete_parent" on reward_settings
  for delete to authenticated using (is_parent());

-- Current threshold: 6 stars for 20 min of technology time at home after school.
-- effective_date defaults to today since the exact date it changed from 5 to 6
-- wasn't known; insert an earlier row here later if that history matters.
insert into reward_settings (child_id, stars_required, reward_description, effective_date)
select id, 6, '20 min of technology time at home after school', current_date
from children where name = 'Truman';
