"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import {
  FALLBACK_SETTINGS,
  type SiteSettings,
} from "@/lib/products";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function storagePathFromPublicUrl(url: string, bucket: string) {
  const marker = `/object/public/${bucket}/`;
  const i = url.indexOf(marker);
  if (i === -1) return null;
  return decodeURIComponent(url.slice(i + marker.length));
}

async function uploadSiteImage(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  file: File | null,
  folder: string
) {
  if (!file || file.size === 0) return null;

  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar (JPG/PNG/WEBP).");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Ukuran gambar maksimal 5MB.");
  }

  const ext =
    file.name.split(".").pop()?.toLowerCase().replace("jpeg", "jpg") || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from("site-assets")
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
  return data.publicUrl;
}

export async function saveSiteContentAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  // Ambil settings lama
  const { data: existing } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "general")
    .maybeSingle();

  const prev: SiteSettings = {
    ...FALLBACK_SETTINGS,
    ...((existing?.value as SiteSettings) || {}),
  };

  let heroImage = prev.hero_image;
  let aboutImage = prev.about_image;

  const heroFile = formData.get("hero_image_file");
  const aboutFile = formData.get("about_image_file");

  try {
    if (heroFile instanceof File && heroFile.size > 0) {
      const url = await uploadSiteImage(supabase, heroFile, "hero");
      if (url) {
        // hapus file lama di bucket kita (jika ada)
        const oldPath = storagePathFromPublicUrl(heroImage, "site-assets");
        heroImage = url;
        if (oldPath) {
          await supabase.storage.from("site-assets").remove([oldPath]);
        }
      }
    }

    if (aboutFile instanceof File && aboutFile.size > 0) {
      const url = await uploadSiteImage(supabase, aboutFile, "about");
      if (url) {
        const oldPath = storagePathFromPublicUrl(aboutImage, "site-assets");
        aboutImage = url;
        if (oldPath) {
          await supabase.storage.from("site-assets").remove([oldPath]);
        }
      }
    }
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Gagal upload gambar",
    };
  }

  const nextValue: SiteSettings = {
    store_name: text(formData, "store_name") || prev.store_name,
    tagline: text(formData, "tagline") || prev.tagline,
    hero_title_line1:
      text(formData, "hero_title_line1") || prev.hero_title_line1,
    hero_title_line2:
      text(formData, "hero_title_line2") || prev.hero_title_line2,
    hero_description:
      text(formData, "hero_description") || prev.hero_description,
    hero_image: heroImage,
    about_title: text(formData, "about_title") || prev.about_title,
    about_body_1: text(formData, "about_body_1") || prev.about_body_1,
    about_body_2: text(formData, "about_body_2") || prev.about_body_2,
    about_image: aboutImage,
    about_philosophy_label:
      text(formData, "about_philosophy_label") ||
      prev.about_philosophy_label,
    about_philosophy_text:
      text(formData, "about_philosophy_text") || prev.about_philosophy_text,
    feature_1_title:
      text(formData, "feature_1_title") || prev.feature_1_title,
    feature_1_text: text(formData, "feature_1_text") || prev.feature_1_text,
    feature_2_title:
      text(formData, "feature_2_title") || prev.feature_2_title,
    feature_2_text: text(formData, "feature_2_text") || prev.feature_2_text,
    address: text(formData, "address") || prev.address,
    whatsapp: text(formData, "whatsapp").replace(/\D/g, "") || prev.whatsapp,
    email: text(formData, "email") || prev.email,
    hours: text(formData, "hours") || prev.hours,
    footer_text: text(formData, "footer_text") || prev.footer_text,
    theme: text(formData, "theme") || prev.theme || "kuning-klasik",
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
  revalidatePath("/admin/konten");

  return { ok: true, message: "Konten website berhasil disimpan." };
}