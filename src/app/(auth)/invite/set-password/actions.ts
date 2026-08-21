"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function setPasswordAction(formData: FormData) {
  const password = formData.get("password");

  if (typeof password !== "string" || password.length < 8) {
    redirect(
      `/invite/set-password?error=${encodeURIComponent("Password must be at least 8 characters.")}`,
    );
  }

  const supabase = await createClient();
  const { error, data } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/invite/set-password?error=${encodeURIComponent(error.message)}`);
  }

  const email = data.user?.email;
  if (email) {
    const admin = createAdminClient();
    await admin
      .from("invites")
      .update({ status: "accepted", accepted_at: new Date().toISOString() })
      .eq("email", email)
      .eq("status", "pending");
  }

  redirect("/");
}
