import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/** Service-role client — bypasses RLS. Only call from Server Actions gated by requireParent(). */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
