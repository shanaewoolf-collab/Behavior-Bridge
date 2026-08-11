import { login } from "./actions";

export default async function LoginPage(props: PageProps<"/login">) {
  const { error } = await props.searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold text-navy">Behavior Bridge</h1>
      {error && (
        <p className="rounded bg-red/10 p-2 text-sm text-red">{error}</p>
      )}
      <form action={login} className="flex flex-col gap-3">
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email"
          className="rounded border border-navy/20 bg-white p-2 text-navy placeholder:text-navy/40"
        />
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Password"
          className="rounded border border-navy/20 bg-white p-2 text-navy placeholder:text-navy/40"
        />
        <button
          type="submit"
          className="rounded bg-navy p-2 font-bold text-beige transition-colors hover:bg-navy/90"
        >
          Log in
        </button>
      </form>
    </main>
  );
}
