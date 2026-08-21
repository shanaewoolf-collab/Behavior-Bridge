-- Track which auth.users row an invite created, so revoking/removing can
-- actually delete the underlying account, not just our own bookkeeping row.
alter table invites add column if not exists user_id uuid references auth.users(id) on delete set null;
