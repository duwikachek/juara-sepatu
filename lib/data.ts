import { createClient } from "@/lib/supabase/server";
import {
  FALLBACK_SETTINGS,
  type GalleryItem,
  type Product,
  type SiteSettings,
} from "@/lib/products";

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getProducts error:", error.message);
    return [];
  }
  return (data as Product[]) ?? [];
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("getProductBySlug error:", error.message);
    return null;
  }
  return data as Product | null;
}

export async function getRelated(
  slug: string,
  limit = 3
): Promise<Product[]> {
  const current = await getProductBySlug(slug);
  if (!current) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .neq("slug", slug)
    .eq("sold", false)
    .order("sort_order", { ascending: true })
    .limit(12);

  const list = (data as Product[]) ?? [];
  const sameBrand = list.filter((p) => p.brand === current.brand);
  const others = list.filter((p) => p.brand !== current.brand);
  return [...sameBrand, ...others].slice(0, limit);
}

export async function getProductSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("slug");
  return (data ?? []).map((r) => r.slug as string);
}

export async function getSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "general")
    .maybeSingle();

  if (error || !data?.value) {
    console.error("getSettings error:", error?.message);
    return FALLBACK_SETTINGS;
  }
  return { ...FALLBACK_SETTINGS, ...(data.value as SiteSettings) };
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getGalleryItems error:", error.message);
    return [];
  }
  return (data as GalleryItem[]) ?? [];
}