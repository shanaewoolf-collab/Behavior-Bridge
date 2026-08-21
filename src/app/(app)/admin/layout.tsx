import { requireParent } from "@/lib/auth/session";

export default async function AdminLayout(props: LayoutProps<"/admin">) {
  await requireParent();

  return <div className="flex flex-col gap-4">{props.children}</div>;
}
