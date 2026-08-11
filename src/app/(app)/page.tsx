import { createClient } from "@/lib/supabase/server";
import { TagButtonGrid } from "@/components/tag-button-grid";
import { FeedList, type FeedEntry } from "@/components/feed-list";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: tags }, { data: entries }] = await Promise.all([
    supabase
      .from("behavior_tags")
      .select("id, label")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("behavior_entries")
      .select(
        "id, note, occurred_at, tag:behavior_tags(label), logger:profiles(full_name)",
      )
      .order("occurred_at", { ascending: false })
      .limit(50),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-navy/60">
          Log a behavior
        </h2>
        <TagButtonGrid tags={tags ?? []} />
      </section>
      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-navy/60">
          Recent activity
        </h2>
        <FeedList entries={(entries as unknown as FeedEntry[]) ?? []} />
      </section>
    </div>
  );
}
