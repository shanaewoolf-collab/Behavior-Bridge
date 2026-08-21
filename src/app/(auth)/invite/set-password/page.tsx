import { setPasswordAction } from "./actions";

export default async function SetPasswordPage(
  props: PageProps<"/invite/set-password">,
) {
  const { error } = await props.searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold text-atlantic">
        Welcome to Behavior Bridge
      </h1>
      <p className="text-sm text-atlantic/70">
        Choose a password to finish setting up your account.
      </p>
      {error && (
        <p className="rounded bg-persimmon/10 p-2 text-sm text-persimmon">
          {error}
        </p>
      )}
      <form action={setPasswordAction} className="flex flex-col gap-3">
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="New password"
          className="rounded border border-atlantic/20 bg-white p-2 text-atlantic placeholder:text-atlantic/40"
        />
        <button
          type="submit"
          className="rounded bg-atlantic p-2 font-bold text-white transition-colors hover:bg-atlantic/90"
        >
          Set password &amp; continue
        </button>
      </form>
    </main>
  );
}
