import Link from "next/link";

export default function AdminIndexPage() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-lg font-bold text-atlantic">Admin</h1>
      <Link href="/admin/tags" className="text-atlantic underline">
        Behavior tags
      </Link>
      <Link href="/admin/team" className="text-atlantic underline">
        Team
      </Link>
    </div>
  );
}
