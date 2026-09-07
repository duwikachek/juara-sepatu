import { requireAdmin } from "@/lib/admin";
import type { GalleryItem } from "@/lib/products";
import { GalleryManager } from "@/components/admin/gallery-manager";

export default async function AdminGalleryPage() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return (
      <main className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-red-400">
        Gagal memuat galeri: {error.message}
      </main>
    );
  }

  return (
    <main>
      <GalleryManager items={(data as GalleryItem[]) ?? []} />
    </main>
  );
}