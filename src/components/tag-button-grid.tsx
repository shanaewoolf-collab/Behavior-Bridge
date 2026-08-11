import { logBehaviorAction } from "@/app/(app)/actions";

type Tag = {
  id: string;
  label: string;
};

export function TagButtonGrid({ tags }: { tags: Tag[] }) {
  if (tags.length === 0) {
    return (
      <p className="text-sm text-navy/60">
        No behavior tags set up yet — the parent account adds these in the
        admin area.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="rounded-lg border border-navy/15 bg-white p-3"
        >
          <form action={logBehaviorAction}>
            <input type="hidden" name="tagId" value={tag.id} />
            <button
              type="submit"
              className="w-full rounded-md bg-navy px-3 py-4 text-center font-bold text-beige transition-colors hover:bg-navy/90"
            >
              {tag.label}
            </button>
            <details className="mt-2 text-sm text-navy/70">
              <summary className="cursor-pointer select-none">
                Add a note
              </summary>
              <div className="mt-2 flex flex-col gap-2">
                <textarea
                  name="note"
                  rows={2}
                  placeholder="Optional note"
                  className="rounded border border-navy/20 p-2 text-navy"
                />
                <button
                  type="submit"
                  className="rounded border border-navy/30 py-1 text-navy transition-colors hover:bg-navy/5"
                >
                  Log with note
                </button>
              </div>
            </details>
          </form>
        </div>
      ))}
    </div>
  );
}
