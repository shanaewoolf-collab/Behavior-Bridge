"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function logBehaviorAction(formData: FormData) {
  const profile = await requireUser();
  const tagId = formData.get("tagId");
  const noteRaw = formData.get("note");
  const note =
    typeof noteRaw === "string" && noteRaw.trim() ? noteRaw.trim() : null;

  if (typeof tagId !== "string" || !tagId) return;

  const supabase = await createClient();

  const { data: tag } = await supabase
    .from("behavior_tags")
    .select("note_required")
    .eq("id", tagId)
    .single();

  // Defense in depth: the "Other" tag's textarea is HTML-required, but a
  // direct action call could skip that. Silently drop rather than insert
  // a record that violates the tag's own rule.
  if (tag?.note_required && !note) return;

  await supabase.from("behavior_entries").insert({
    tag_id: tagId,
    note,
    logged_by: profile.id,
  });

  revalidatePath("/");
}
