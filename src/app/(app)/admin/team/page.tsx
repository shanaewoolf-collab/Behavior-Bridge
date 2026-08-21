import { requireParent } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import {
  inviteTeamMemberAction,
  revokeInviteAction,
  removeTeamMemberAction,
} from "./actions";

type Profile = {
  id: string;
  full_name: string;
  role: string;
};

type Invite = {
  id: string;
  email: string;
  role: string;
  status: "pending" | "accepted" | "revoked";
  invited_at: string;
  user_id: string | null;
};

export default async function AdminTeamPage(props: PageProps<"/admin/team">) {
  const { error } = await props.searchParams;
  const currentProfile = await requireParent();
  const supabase = await createClient();

  const [{ data: profiles }, { data: invites }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, role").order("full_name"),
    supabase
      .from("invites")
      .select("id, email, role, status, invited_at, user_id")
      .order("invited_at", { ascending: false }),
  ]);

  const profileList = (profiles as Profile[] | null) ?? [];
  const inviteList = (invites as Invite[] | null) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-bold text-atlantic">Team</h1>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-atlantic/60">
          Invite a team member
        </h2>
        {error && (
          <p className="rounded bg-persimmon/10 p-2 text-sm text-persimmon">
            {error}
          </p>
        )}
        <form
          action={inviteTeamMemberAction}
          className="flex flex-wrap items-end gap-3 rounded-lg border border-atlantic/15 bg-white p-3"
        >
          <label className="flex flex-col text-sm text-atlantic">
            Name
            <input
              name="full_name"
              required
              className="rounded border border-atlantic/20 p-1"
            />
          </label>
          <label className="flex flex-col text-sm text-atlantic">
            Email
            <input
              name="email"
              type="email"
              required
              className="rounded border border-atlantic/20 p-1"
            />
          </label>
          <label className="flex flex-col text-sm text-atlantic">
            Role
            <select
              name="role"
              defaultValue="teacher"
              className="rounded border border-atlantic/20 p-1"
            >
              <option value="teacher">Teacher</option>
              <option value="slp">Speech-language pathologist</option>
              <option value="counselor">Counselor</option>
              <option value="parent">Parent</option>
            </select>
          </label>
          <button
            type="submit"
            className="rounded-md bg-atlantic px-3 py-1 font-bold text-white transition-colors hover:bg-atlantic/90"
          >
            Send invite
          </button>
        </form>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-atlantic/60">
          Current accounts
        </h2>
        <div className="flex flex-col gap-2">
          {profileList.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded border border-atlantic/10 bg-white px-3 py-2 text-sm"
            >
              <span className="text-atlantic">
                {p.full_name} &middot; {p.role}
              </span>
              {p.id !== currentProfile.id && (
                <form action={removeTeamMemberAction.bind(null, p.id)}>
                  <button
                    type="submit"
                    className="text-sm font-bold text-persimmon underline"
                  >
                    Remove
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-atlantic/60">
          Invites
        </h2>
        {inviteList.length === 0 ? (
          <p className="text-sm text-atlantic/60">No invites sent yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {inviteList.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between rounded border border-atlantic/10 bg-white px-3 py-2 text-sm"
              >
                <span className="text-atlantic">
                  {invite.email} &middot; {invite.role} &middot; {invite.status}
                </span>
                {invite.status === "pending" && (
                  <form
                    action={revokeInviteAction.bind(
                      null,
                      invite.id,
                      invite.user_id,
                    )}
                  >
                    <button
                      type="submit"
                      className="text-sm font-bold text-persimmon underline"
                    >
                      Revoke
                    </button>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
