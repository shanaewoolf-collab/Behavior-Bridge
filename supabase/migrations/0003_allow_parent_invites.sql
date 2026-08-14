-- Allow inviting a second parent account (e.g. a spouse), not just teacher/SLP/counselor.
alter table invites drop constraint if exists invites_role_check;
alter table invites add constraint invites_role_check
  check (role in ('parent', 'teacher', 'slp', 'counselor'));
