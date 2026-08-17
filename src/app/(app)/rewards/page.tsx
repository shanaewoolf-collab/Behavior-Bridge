import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { CHILD_TIMEZONE, getLocalDay } from "@/lib/timezone";
import { giveStarAction } from "./actions";

type RecentStar = {
  id: string;
  awarded_at: string;
  giver: { full_name: string } | null;
};

type RewardSetting = {
  stars_required: number;
  reward_description: string;
};

export default async function RewardsPage() {
  const profile = await requireUser();
  const supabase = await createClient();
  const { start, end, dateString } = getLocalDay(CHILD_TIMEZONE);

  const [{ data: todayStars }, { data: recentStars }, { data: settingRows }] =
    await Promise.all([
      supabase
        .from("stars")
        .select("id")
        .gte("awarded_at", start.toISOString())
        .lt("awarded_at", end.toISOString()),
      supabase
        .from("stars")
        .select("id, awarded_at, giver:profiles(full_name)")
        .order("awarded_at", { ascending: false })
        .limit(10),
      supabase
        .from("reward_settings")
        .select("stars_required, reward_description")
        .lte("effective_date", dateString)
        .order("effective_date", { ascending: false })
        .limit(1),
    ]);

  const todayCount = todayStars?.length ?? 0;
  const setting = (settingRows?.[0] as RewardSetting | undefined) ?? null;

  return (
    <div className="flex flex-col gap-6">
      {profile.role === "parent" ? (
        <ParentStarView todayCount={todayCount} setting={setting} />
      ) : (
        <GiverStarView todayCount={todayCount} />
      )}
      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-atlantic/60">
          Recent stars
        </h2>
        <RecentStars stars={(recentStars as unknown as RecentStar[]) ?? []} />
      </section>
    </div>
  );
}

function GiveStarButton() {
  return (
    <form action={giveStarAction}>
      <button
        type="submit"
        className="rounded-md bg-cornsilk px-6 py-4 font-bold text-atlantic transition-colors hover:bg-cornsilk/90"
      >
        Give a star
      </button>
    </form>
  );
}

function StarRow({ filled, total }: { filled: number; total: number }) {
  return (
    <div className="flex gap-1 text-3xl leading-none">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i < filled ? "text-glacier" : "text-atlantic/15"}>
          ★
        </span>
      ))}
    </div>
  );
}

function ParentStarView({
  todayCount,
  setting,
}: {
  todayCount: number;
  setting: RewardSetting | null;
}) {
  if (!setting) {
    return (
      <p className="text-sm text-atlantic/60">
        No reward threshold configured yet.
      </p>
    );
  }

  const earned = todayCount >= setting.stars_required;
  const bonus = Math.max(0, todayCount - setting.stars_required);

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-bold uppercase tracking-wide text-atlantic/60">
        Today&apos;s stars
      </h2>
      <StarRow
        filled={Math.min(todayCount, setting.stars_required)}
        total={setting.stars_required}
      />
      {earned && (
        <div className="rounded-lg bg-glacier/30 p-3 text-center font-bold text-atlantic">
          Ticket earned today &mdash; {setting.reward_description}
        </div>
      )}
      {bonus > 0 && (
        <p className="text-sm text-atlantic/70">
          +{bonus} bonus star{bonus === 1 ? "" : "s"}
        </p>
      )}
      <GiveStarButton />
    </section>
  );
}

function GiverStarView({ todayCount }: { todayCount: number }) {
  return (
    <section className="flex flex-col items-start gap-2">
      <GiveStarButton />
      <p className="text-sm text-atlantic/60">{todayCount} given today</p>
    </section>
  );
}

function RecentStars({ stars }: { stars: RecentStar[] }) {
  if (stars.length === 0) {
    return <p className="text-sm text-atlantic/60">No stars given yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-1 text-sm">
      {stars.map((star) => (
        <li
          key={star.id}
          className="flex justify-between rounded border border-atlantic/10 bg-white px-3 py-2"
        >
          <span className="text-atlantic">{star.giver?.full_name ?? "Unknown"}</span>
          <span className="text-atlantic/50">
            {new Date(star.awarded_at).toLocaleString(undefined, {
              timeZone: CHILD_TIMEZONE,
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </li>
      ))}
    </ul>
  );
}
