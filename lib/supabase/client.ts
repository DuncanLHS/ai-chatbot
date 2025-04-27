import { createBrowserClient } from '@supabase/ssr';

export function createClient<Database>() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      throw new Error('Missing Supabase URL');
    }
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase Anon Key');
    }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
