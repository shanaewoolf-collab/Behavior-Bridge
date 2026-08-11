import { requireUser } from "@/lib/auth/session";

export default async function AppLayout(props: LayoutProps<"/">) {
  const profile = await requireUser();

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between bg-navy p-4 text-beige">
        <span className="font-bold">Behavior Bridge</span>
        <div className="flex items-center gap-3 text-sm">
          <span>
            {profile.full_name} &middot; {profile.role}
          </span>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded border border-beige/30 px-2 py-1 transition-colors hover:bg-beige/10"
            >
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="p-4">{props.children}</main>
    </div>
  );
}
