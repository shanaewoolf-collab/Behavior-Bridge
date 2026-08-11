export type FeedEntry = {
  id: string;
  note: string | null;
  occurred_at: string;
  tag: { label: string } | null;
  logger: { full_name: string } | null;
};

export function FeedList({ entries }: { entries: FeedEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-navy/60">
        No entries yet — log the first one above.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className="rounded-lg border border-navy/10 bg-white p-3"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-navy">
              {entry.tag?.label ?? "Behavior"}
            </span>
            <span className="text-navy/50">
              {new Date(entry.occurred_at).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
          <p className="text-sm text-navy/70">
            logged by {entry.logger?.full_name ?? "Unknown"}
          </p>
          {entry.note && <p className="mt-1 text-sm text-navy">{entry.note}</p>}
        </li>
      ))}
    </ul>
  );
}
