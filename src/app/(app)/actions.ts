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
  await supabase.from("behavior_entries").insert({
    tag_id: tagId,
    note,
    logged_by: profile.id,
  });

  revalidatePath("/");
}
