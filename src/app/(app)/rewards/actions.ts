"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

export async function giveStarAction() {
  const profile = await requireUser();
  const supabase = await createClient();

  await supabase.from("stars").insert({ awarded_by: profile.id });

  revalidatePath("/rewards");
}
