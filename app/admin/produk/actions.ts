"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, createProductSlug } from "@/lib/admin";

function parseSizes(raw: string): string[] {
  return raw
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseLines(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parsePrice(raw: string): number {
  const n = Number(String(raw).replace(/[^\d]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function storageInfoFromPublicUrl(url: string): { bucket: string; path: string } | null {
  for (const bucket of ["product-images", "site-assets"]) {
    const marker = `/object/public/${bucket}/`;
    const i = url.indexOf(marker);
    if (i !== -1) {
      return {
        bucket,
        path: decodeURIComponent(url.slice(i + marker.length)),
      };
    }
  }
  return null;
}

async function uploadProductImages(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  files: File[]
) {
  const urls: string[] = [];

  for (const file of files) {
    if (!file || file.size === 0) continue;

    const isImage = file.type.startsWith("image/");
    const isVideo =
      file.type.startsWith("video/") ||
      file.name.toLowerCase().endsWith(".mp4");

    if (!isImage && !isVideo) {
      throw new Error(
        `Format file tidak didukung (hanya foto atau video MP4): ${file.name}`
      );
    }

    if (isVideo && file.size > 50 * 1024 * 1024) {
      throw new Error(
        `Ukuran video terlalu besar (maksimal 50 MB): ${file.name}`
      );
    }

    let ext =
      file.name.split(".").pop()?.toLowerCase().replace("jpeg", "jpg") ||
      (isVideo ? "mp4" : "jpg");

    const contentType = isVideo
      ? "video/mp4"
      : file.type || "image/jpeg";

    const path = `products/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // Bucket product-images hanya mengizinkan foto di konfigurasi Supabase.
    // Video MP4 disimpan di bucket site-assets yang tidak memiliki batasan MIME foto.
    let targetBucket = isVideo ? "site-assets" : "product-images";

    let uploadRes = await supabase.storage
      .from(targetBucket)
      .upload(path, buffer, {
        contentType,
        upsert: false,
      });

    // Fallback jika bucket mengembalikan error mime type
    if (uploadRes.error && uploadRes.error.message.toLowerCase().includes("mime")) {
      targetBucket = targetBucket === "product-images" ? "site-assets" : "product-images";
      uploadRes = await supabase.storage
        .from(targetBucket)
        .upload(path, buffer, {
          contentType,
          upsert: false,
        });
    }

    if (uploadRes.error) throw new Error(uploadRes.error.message);

    const { data } = supabase.storage
      .from(targetBucket)
      .getPublicUrl(path);

    urls.push(data.publicUrl);
  }

  return urls;
}

export async function createProductAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const brand = String(formData.get("brand") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const price = parsePrice(String(formData.get("price") || "0"));
  const sizes = parseSizes(String(formData.get("sizes") || ""));
  const grade = String(formData.get("grade") || "Grade A").trim();
  const condition = String(formData.get("condition") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const highlights = parseLines(String(formData.get("highlights") || ""));
  const sold = String(formData.get("sold") || "") === "on";
  const sort_order = Number(formData.get("sort_order") || 0) || 0;

  if (!name || !brand || !category || price <= 0) {
    return {
      ok: false,
      message: "Nama, merek, kategori, dan harga wajib diisi.",
    };
  }

  const baseSlug = createProductSlug(name) || `produk-${Date.now()}`;
  let slug = baseSlug;

  for (let i = 0; i < 20; i++) {
    const { data: exists } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!exists) break;
    slug = `${baseSlug}-${i + 2}`;
  }

  const files = formData
    .getAll("images")
    .filter((f): f is File => typeof File !== "undefined" && f instanceof File);

  let images: string[] = [];
  try {
    images = await uploadProductImages(supabase, files);
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Gagal upload gambar",
    };
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      slug,
      name,
      brand,
      category,
      price,
      sizes,
      grade,
      condition,
      description,
      highlights,
      images,
      sold,
      sort_order,
    })
    .select("id")
    .single();

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin/produk");
  revalidatePath("/");
  revalidatePath("/produk", "layout");

  return {
    ok: true,
    message: "Produk berhasil ditambahkan.",
    redirectUrl: `/admin/produk/${data.id}?saved=1`,
  };
}

export async function updateProductAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = String(formData.get("id") || "");
  if (!id) return { ok: false, message: "ID produk tidak valid." };

  const name = String(formData.get("name") || "").trim();
  const brand = String(formData.get("brand") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const price = parsePrice(String(formData.get("price") || "0"));
  const sizes = parseSizes(String(formData.get("sizes") || ""));
  const grade = String(formData.get("grade") || "Grade A").trim();
  const condition = String(formData.get("condition") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const highlights = parseLines(String(formData.get("highlights") || ""));
  const sold = String(formData.get("sold") || "") === "on";
  const sort_order = Number(formData.get("sort_order") || 0) || 0;
  const keepImages = formData
    .getAll("keep_images")
    .map((v) => String(v))
    .filter(Boolean);

  if (!name || !brand || !category || price <= 0) {
    return {
      ok: false,
      message: "Nama, merek, kategori, dan harga wajib diisi.",
    };
  }

  const { data: existing, error: findError } = await supabase
    .from("products")
    .select("images")
    .eq("id", id)
    .maybeSingle();

  if (findError || !existing) {
    return { ok: false, message: "Produk tidak ditemukan." };
  }

  const oldImages = (existing.images as string[]) || [];
  const removed = oldImages.filter((url) => !keepImages.includes(url));

  const files = formData
    .getAll("images")
    .filter((f): f is File => typeof File !== "undefined" && f instanceof File);

  let newUrls: string[] = [];
  try {
    newUrls = await uploadProductImages(supabase, files);
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Gagal upload gambar",
    };
  }

  const images = [...keepImages, ...newUrls];

  const { error } = await supabase
    .from("products")
    .update({
      name,
      brand,
      category,
      price,
      sizes,
      grade,
      condition,
      description,
      highlights,
      images,
      sold,
      sort_order,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { ok: false, message: error.message };
  }

  const toRemove = removed
    .map(storageInfoFromPublicUrl)
    .filter(Boolean) as { bucket: string; path: string }[];

  for (const item of toRemove) {
    await supabase.storage.from(item.bucket).remove([item.path]);
  }

  revalidatePath("/admin/produk");
  revalidatePath(`/admin/produk/${id}`);
  revalidatePath("/");
  revalidatePath("/produk", "layout");

  return { ok: true, message: "Produk berhasil disimpan." };
}

export async function toggleProductSoldAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = String(formData.get("id") || "");
  const sold = String(formData.get("sold") || "") === "true";

  if (!id) return { ok: false, message: "ID produk tidak valid." };

  const { error } = await supabase
    .from("products")
    .update({
      sold: !sold,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/produk");
  revalidatePath("/");
  revalidatePath("/produk", "layout");

  return {
    ok: true,
    message: !sold ? "Produk ditandai terjual." : "Produk dikembalikan ke tersedia.",
  };
}

export async function deleteProductAction(formData: FormData) {
  const { supabase, isOwner } = await requireAdmin();

  if (!isOwner) {
    return { ok: false, message: "Hanya Owner yang boleh menghapus produk." };
  }

  const id = String(formData.get("id") || "");
  if (!id) return { ok: false, message: "ID produk tidak valid." };

  const { data: product } = await supabase
    .from("products")
    .select("images")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  const images = (product?.images as string[] | null) ?? [];
  const toRemove = images
    .map(storageInfoFromPublicUrl)
    .filter(Boolean) as { bucket: string; path: string }[];

  for (const item of toRemove) {
    await supabase.storage.from(item.bucket).remove([item.path]);
  }

  revalidatePath("/admin/produk");
  revalidatePath("/");
  revalidatePath("/produk", "layout");

  return { ok: true, message: "Produk berhasil dihapus." };
}