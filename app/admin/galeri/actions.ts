"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function storagePathFromPublicUrl(url: string) {
  const marker = "/object/public/site-assets/";
  const i = url.indexOf(marker);
  if (i === -1) return null;
  return decodeURIComponent(url.slice(i + marker.length));
}

async function uploadGalleryImage(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  file: File | null
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
  const path = `gallery/${Date.now()}-${Math.random()
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

export async function createGalleryItemAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const title = text(formData, "title");
  const category = text(formData, "category") || "Boots";
  const sort_order = Number(text(formData, "sort_order") || "0") || 0;
  const active = text(formData, "active") === "on";
  const file = formData.get("image_file");

  if (!title) {
    return { ok: false, message: "Judul wajib diisi." };
  }

  let image_url = "";
  try {
    if (file instanceof File && file.size > 0) {
      const url = await uploadGalleryImage(supabase, file);
      if (url) image_url = url;
    }
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Gagal upload gambar",
    };
  }

  // Boleh pakai URL manual kalau tidak upload file
  if (!image_url) {
    image_url = text(formData, "image_url");
  }

  if (!image_url) {
    return {
      ok: false,
      message: "Upload foto atau isi URL gambar.",
    };
  }

  const { error } = await supabase.from("gallery_items").insert({
    title,
    category,
    image_url,
    sort_order,
    active,
  });

  if (error) return { ok: false, message: error.message };

  revalidatePath("/");
  revalidatePath("/admin/galeri");
  return { ok: true, message: "Item galeri ditambahkan." };
}

export async function updateGalleryItemAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = text(formData, "id");
  const title = text(formData, "title");
  const category = text(formData, "category") || "Boots";
  const sort_order = Number(text(formData, "sort_order") || "0") || 0;
  const active = text(formData, "active") === "on";
  const file = formData.get("image_file");
  const keepUrl = text(formData, "image_url");

  if (!id) return { ok: false, message: "ID tidak valid." };
  if (!title) return { ok: false, message: "Judul wajib diisi." };

  const { data: existing } = await supabase
    .from("gallery_items")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  let image_url = keepUrl || existing?.image_url || "";

  try {
    if (file instanceof File && file.size > 0) {
      const url = await uploadGalleryImage(supabase, file);
      if (url) {
        const oldPath = storagePathFromPublicUrl(image_url);
        image_url = url;
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

  if (!image_url) {
    return { ok: false, message: "Gambar wajib ada." };
  }

  const { error } = await supabase
    .from("gallery_items")
    .update({
      title,
      category,
      image_url,
      sort_order,
      active,
    })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/");
  revalidatePath("/admin/galeri");
  return { ok: true, message: "Item galeri disimpan." };
}

export async function deleteGalleryItemAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = text(formData, "id");
  if (!id) return { ok: false, message: "ID tidak valid." };

  const { data: existing } = await supabase
    .from("gallery_items")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  const oldPath = storagePathFromPublicUrl(existing?.image_url || "");
  if (oldPath) {
    await supabase.storage.from("site-assets").remove([oldPath]);
  }

  revalidatePath("/");
  revalidatePath("/admin/galeri");
  return { ok: true, message: "Item galeri dihapus." };
}

export async function toggleGalleryActiveAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = text(formData, "id");
  const active = text(formData, "active") === "true";

  if (!id) return { ok: false, message: "ID tidak valid." };

  const { error } = await supabase
    .from("gallery_items")
    .update({ active: !active })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/");
  revalidatePath("/admin/galeri");
  return {
    ok: true,
    message: !active ? "Item diaktifkan." : "Item dinonaktifkan.",
  };
}