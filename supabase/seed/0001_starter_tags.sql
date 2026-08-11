-- Placeholder behavior tags for testing M4 before the admin CRUD UI (M5) exists.
-- Safe to delete/edit once M5 ships and you manage the real list through the app.
insert into behavior_tags (label, sort_order) values
  ('On task', 1),
  ('Great transition', 2),
  ('Redirected calmly', 3),
  ('Kind to a peer', 4)
on conflict (label) do nothing;
