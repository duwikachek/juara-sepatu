import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { ProductForm } from "@/components/admin/product-form";
import type { Product } from "@/lib/products";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function EditProductPage({
  params,
  searchParams,
}: Props) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  return (
    <main>
      {sp.saved === "1" && (
        <div className="mb-6 rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          Produk berhasil ditambahkan. Kamu bisa lanjut edit atau upload foto
          tambahan.
        </div>
      )}
      <ProductForm mode="edit" product={data as Product} />
    </main>
  );
}