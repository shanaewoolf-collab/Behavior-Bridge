import { logBehaviorAction } from "@/app/(app)/actions";

type Tag = {
  id: string;
  label: string;
  type: "positive" | "challenging" | null;
  note_required: boolean;
};

const TYPE_STYLES: Record<string, string> = {
  positive: "bg-malachite text-white hover:bg-malachite/90",
  challenging: "bg-persimmon text-white hover:bg-persimmon/90",
};

export function TagButtonGrid({ tags }: { tags: Tag[] }) {
  if (tags.length === 0) {
    return (
      <p className="text-sm text-atlantic/60">
        No behavior tags set up yet — ask Shanae to add the tag list.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {tags.map((tag) => {
        const buttonClass =
          TYPE_STYLES[tag.type ?? ""] ?? "bg-atlantic text-white hover:bg-atlantic/90";

        if (tag.note_required) {
          return (
            <div
              key={tag.id}
              className="rounded-lg border border-atlantic/15 bg-white p-3 sm:col-span-1"
            >
              <form action={logBehaviorAction} className="flex flex-col gap-2">
                <input type="hidden" name="tagId" value={tag.id} />
                <span className="font-bold text-atlantic">{tag.label}</span>
                <textarea
                  name="note"
                  rows={2}
                  required
                  placeholder="What happened? (required for this tag)"
                  className="rounded border border-atlantic/20 p-2 text-sm text-atlantic"
                />
                <button
                  type="submit"
                  className="rounded-md bg-atlantic px-3 py-2 text-center font-bold text-white transition-colors hover:bg-atlantic/90"
                >
                  Log
                </button>
              </form>
            </div>
          );
        }

        return (
          <div
            key={tag.id}
            className="rounded-lg border border-atlantic/15 bg-white p-3"
          >
            <form action={logBehaviorAction}>
              <input type="hidden" name="tagId" value={tag.id} />
              <button
                type="submit"
                className={`w-full rounded-md px-3 py-4 text-center font-bold transition-colors ${buttonClass}`}
              >
                {tag.label}
              </button>
              <details className="mt-2 text-sm text-atlantic/70">
                <summary className="cursor-pointer select-none">
                  Add a note
                </summary>
                <div className="mt-2 flex flex-col gap-2">
                  <textarea
                    name="note"
                    rows={2}
                    placeholder="Optional note"
                    className="rounded border border-atlantic/20 p-2 text-atlantic"
                  />
                  <button
                    type="submit"
                    className="rounded border border-atlantic/30 py-1 text-atlantic transition-colors hover:bg-atlantic/5"
                  >
                    Log with note
                  </button>
                </div>
              </details>
            </form>
          </div>
        );
      })}
    </div>
  );
}
