"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { requireParent } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ROLES = ["parent", "teacher", "slp", "counselor"] as const;
type Role = (typeof ROLES)[number];

function parseRole(value: FormDataEntryValue | null): Role | null {
  return (ROLES as readonly string[]).includes(value as string)
    ? (value as Role)
    : null;
}

async function getSiteUrl() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = host.startsWith("localhost") ? "http" : "https";
  return `${proto}://${host}`;
}

export async function inviteTeamMemberAction(formData: FormData) {
  const profile = await requireParent();

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const role = parseRole(formData.get("role"));

  if (!email || !fullName || !role) {
    redirect(
      `/admin/team?error=${encodeURIComponent("Name, email, and role are all required.")}`,
    );
  }

  const siteUrl = await getSiteUrl();
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName, role },
    redirectTo: `${siteUrl}/auth/callback?next=/invite/set-password`,
  });

  if (error || !data?.user) {
    redirect(
      `/admin/team?error=${encodeURIComponent(error?.message ?? "Could not send invite.")}`,
    );
  }

  const supabase = await createClient();
  await supabase.from("invites").insert({
    email,
    role,
    invited_by: profile.id,
    user_id: data.user.id,
  });

  revalidatePath("/admin/team");
}

export async function revokeInviteAction(
  id: string,
  userId: string | null,
  _formData: FormData,
) {
  await requireParent();

  if (userId) {
    const admin = createAdminClient();
    await admin.auth.admin.deleteUser(userId);
  }

  const supabase = await createClient();
  await supabase.from("invites").update({ status: "revoked" }).eq("id", id);

  revalidatePath("/admin/team");
}

export async function removeTeamMemberAction(
  profileId: string,
  _formData: FormData,
) {
  await requireParent();
  const admin = createAdminClient();
  await admin.auth.admin.deleteUser(profileId);
  revalidatePath("/admin/team");
}
