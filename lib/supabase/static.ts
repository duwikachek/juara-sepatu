import { createClient } from "@supabase/supabase-js";

export function createStaticClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase URL atau Key tidak ditemukan di .env.local"
    );
  }

  // Client murni tanpa cookie (khusus baca data publik)
  return createClient(url, key);
}