"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import {
  FALLBACK_SETTINGS,
  type SiteSettings,
} from "@/lib/products";

const ALLOWED = [
  "kuning-klasik",
  "amber-vintage",
  "militer",
  "steel-blue",
] as const;

type ThemeId = (typeof ALLOWED)[number];

function isTheme(v: string): v is ThemeId {
  return (ALLOWED as readonly string[]).includes(v);
}

export async function saveThemeAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const theme = String(formData.get("theme") || "").trim();
  if (!isTheme(theme)) {
    return { ok: false, message: "Tema tidak valid." };
  }

  const { data: existing } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "general")
    .maybeSingle();

  const prev: SiteSettings = {
    ...FALLBACK_SETTINGS,
    ...((existing?.value as SiteSettings) || {}),
  };

  const nextValue: SiteSettings = {
    ...prev,
    theme,
  };

  const { error } = await supabase.from("site_settings").upsert(
    {
      key: "general",
      value: nextValue,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/tema");
  revalidatePath("/admin");

  return { ok: true, message: `Tema "${theme}" berhasil diterapkan.` };
}