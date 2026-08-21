"use server";

import { revalidatePath } from "next/cache";
import { requireParent } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

function parseType(
  value: FormDataEntryValue | null,
): "positive" | "challenging" | null {
  return value === "positive" || value === "challenging" ? value : null;
}

export async function createTagAction(formData: FormData) {
  const profile = await requireParent();
  const label = String(formData.get("label") ?? "").trim();
  if (!label) return;

  const supabase = await createClient();
  await supabase.from("behavior_tags").insert({
    label,
    type: parseType(formData.get("type")),
    note_required: formData.get("note_required") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0),
    created_by: profile.id,
  });

  revalidatePath("/admin/tags");
  revalidatePath("/");
}

export async function updateTagAction(formData: FormData) {
  await requireParent();
  const id = String(formData.get("id") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  if (!id || !label) return;

  const supabase = await createClient();
  await supabase
    .from("behavior_tags")
    .update({
      label,
      type: parseType(formData.get("type")),
      note_required: formData.get("note_required") === "on",
      sort_order: Number(formData.get("sort_order") ?? 0),
    })
    .eq("id", id);

  revalidatePath("/admin/tags");
  revalidatePath("/");
}

export async function toggleActiveAction(
  id: string,
  nextActive: boolean,
  _formData: FormData,
) {
  await requireParent();
  if (!id) return;

  const supabase = await createClient();
  await supabase
    .from("behavior_tags")
    .update({ is_active: nextActive })
    .eq("id", id);

  revalidatePath("/admin/tags");
  revalidatePath("/");
}
