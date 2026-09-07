import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function createStaticClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Jangan hard-crash seluruh build; biarkan pemanggil menangani
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY belum di-set. " +
        "Isi di .env.local (lokal) atau Vercel → Environment Variables (production)."
    );
  }

  return createClient(url, key);
}

/** true kalau env Supabase sudah terisi */
export function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}