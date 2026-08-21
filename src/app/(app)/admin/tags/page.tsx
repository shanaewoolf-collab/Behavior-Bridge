import { createClient } from "@/lib/supabase/server";
import { createTagAction, updateTagAction, toggleActiveAction } from "./actions";

type Tag = {
  id: string;
  label: string;
  type: "positive" | "challenging" | null;
  note_required: boolean;
  sort_order: number;
  is_active: boolean;
};

export default async function AdminTagsPage() {
  const supabase = await createClient();
  const { data: tags } = await supabase
    .from("behavior_tags")
    .select("id, label, type, note_required, sort_order, is_active")
    .order("sort_order");

  const tagList = (tags as Tag[] | null) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-bold text-atlantic">Behavior tags</h1>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-atlantic/60">
          Add a tag
        </h2>
        <form
          action={createTagAction}
          className="flex flex-wrap items-end gap-3 rounded-lg border border-atlantic/15 bg-white p-3"
        >
          <label className="flex flex-col text-sm text-atlantic">
            Label
            <input
              name="label"
              required
              className="rounded border border-atlantic/20 p-1"
            />
          </label>
          <label className="flex flex-col text-sm text-atlantic">
            Type
            <select
              name="type"
              defaultValue=""
              className="rounded border border-atlantic/20 p-1"
            >
              <option value="">None</option>
              <option value="positive">Positive</option>
              <option value="challenging">Challenging</option>
            </select>
          </label>
          <label className="flex flex-col text-sm text-atlantic">
            Order
            <input
              name="sort_order"
              type="number"
              defaultValue={tagList.length + 1}
              className="w-16 rounded border border-atlantic/20 p-1"
            />
          </label>
          <label className="flex items-center gap-1 text-sm text-atlantic">
            <input type="checkbox" name="note_required" />
            Note required
          </label>
          <button
            type="submit"
            className="rounded-md bg-atlantic px-3 py-1 font-bold text-white transition-colors hover:bg-atlantic/90"
          >
            Add tag
          </button>
        </form>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-atlantic/60">
          Existing tags
        </h2>
        {tagList.length === 0 ? (
          <p className="text-sm text-atlantic/60">No tags yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {tagList.map((tag) => (
              <form
                key={tag.id}
                action={updateTagAction}
                className={`flex flex-wrap items-end gap-3 rounded-lg border p-3 ${
                  tag.is_active
                    ? "border-atlantic/15 bg-white"
                    : "border-atlantic/10 bg-atlantic/5 opacity-60"
                }`}
              >
                <input type="hidden" name="id" value={tag.id} />
                <label className="flex flex-col text-sm text-atlantic">
                  Label
                  <input
                    name="label"
                    defaultValue={tag.label}
                    required
                    className="rounded border border-atlantic/20 p-1"
                  />
                </label>
                <label className="flex flex-col text-sm text-atlantic">
                  Type
                  <select
                    name="type"
                    defaultValue={tag.type ?? ""}
                    className="rounded border border-atlantic/20 p-1"
                  >
                    <option value="">None</option>
                    <option value="positive">Positive</option>
                    <option value="challenging">Challenging</option>
                  </select>
                </label>
                <label className="flex flex-col text-sm text-atlantic">
                  Order
                  <input
                    name="sort_order"
                    type="number"
                    defaultValue={tag.sort_order}
                    className="w-16 rounded border border-atlantic/20 p-1"
                  />
                </label>
                <label className="flex items-center gap-1 text-sm text-atlantic">
                  <input
                    type="checkbox"
                    name="note_required"
                    defaultChecked={tag.note_required}
                  />
                  Note required
                </label>
                <button
                  type="submit"
                  className="rounded border border-atlantic/30 px-3 py-1 text-sm font-bold text-atlantic transition-colors hover:bg-atlantic/5"
                >
                  Save
                </button>
                <button
                  type="submit"
                  formAction={toggleActiveAction.bind(null, tag.id, !tag.is_active)}
                  className="rounded px-3 py-1 text-sm font-bold text-atlantic underline"
                >
                  {tag.is_active ? "Deactivate" : "Activate"}
                </button>
              </form>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
