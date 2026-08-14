import Link from "next/link";
import { requireUser } from "@/lib/auth/session";

export default async function AppLayout(props: LayoutProps<"/">) {
  const profile = await requireUser();

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between bg-midnight p-4 text-white">
        <span className="font-bold">Behavior Bridge</span>
        <div className="flex items-center gap-3 text-sm">
          <span>
            {profile.full_name} &middot; {profile.role}
          </span>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded border border-white/30 px-2 py-1 transition-colors hover:bg-white/10"
            >
              Log out
            </button>
          </form>
        </div>
      </header>
      <nav className="flex gap-4 border-b border-midnight/10 bg-white px-4 py-2 text-sm font-bold text-midnight">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/rewards" className="hover:underline">
          Stars
        </Link>
      </nav>
      <main className="p-4">{props.children}</main>
    </div>
  );
}
