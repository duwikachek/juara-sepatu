import Link from "next/link";
import Image from "next/image";
import {
  PackagePlus,
  Search,
  Boxes,
  CircleAlert,
} from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { formatRupiah } from "@/lib/products";
import { ProductRowActions } from "@/components/admin/product-row-actions";

type SearchParams = Promise<{
  q?: string;
  status?: string;
}>;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { supabase, isOwner } = await requireAdmin();
  const params = await searchParams;

  const q = (params.q || "").trim();
  const status = params.status || "all";

  let query = supabase
    .from("products")
    .select(
      "id, slug, name, brand, category, price, sizes, grade, images, sold, updated_at"
    )
    .order("sort_order", { ascending: true });

  if (status === "available") query = query.eq("sold", false);
  if (status === "sold") query = query.eq("sold", true);

  if (q) {
    // Pencarian sederhana di nama/merek/kategori
    query = query.or(
      `name.ilike.%${q}%,brand.ilike.%${q}%,category.ilike.%${q}%`
    );
  }

  const { data, error } = await query;
  const products = data ?? [];

  const total = products.length;
  const availableCount = products.filter((p) => !p.sold).length;
  const soldCount = products.filter((p) => p.sold).length;

  return (
    <main>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-yellow-400">
            <Boxes className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Manajemen Produk
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight">
            Daftar Produk
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Tambah, edit, tandai terjual
            {isOwner ? ", dan hapus produk." : "."}
          </p>
        </div>

        <Link
          href="/admin/produk/baru"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-yellow-400 px-5 py-3 text-xs font-black uppercase tracking-widest text-black transition hover:bg-yellow-300"
        >
          <PackagePlus className="h-4 w-4" />
          Tambah Produk
        </Link>
      </div>

      {/* Ringkasan */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            Ditampilkan
          </p>
          <p className="mt-1 text-2xl font-black text-white">{total}</p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            Tersedia (filter ini)
          </p>
          <p className="mt-1 text-2xl font-black text-green-400">
            {availableCount}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            Terjual (filter ini)
          </p>
          <p className="mt-1 text-2xl font-black text-orange-300">
            {soldCount}
          </p>
        </div>
      </div>

      {/* Filter */}
      <form className="mb-6 grid grid-cols-1 gap-3 rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 md:grid-cols-[1fr_180px_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Cari nama, merek, kategori..."
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-yellow-400"
          />
        </div>

        <select
          name="status"
          defaultValue={status}
          className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm outline-none focus:border-yellow-400"
        >
          <option value="all">Semua status</option>
          <option value="available">Tersedia</option>
          <option value="sold">Terjual</option>
        </select>

        <button
          type="submit"
          className="rounded-lg border border-yellow-400/50 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
        >
          Terapkan
        </button>
      </form>

      {error && (
        <div className="mb-6 flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <CircleAlert className="mt-0.5 h-4 w-4" />
          Gagal memuat produk: {error.message}
        </div>
      )}

      {/* Tabel */}
      <div className="overflow-hidden rounded-xl border border-neutral-800">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-neutral-900 text-[10px] uppercase tracking-widest text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-bold">Produk</th>
                <th className="px-4 py-3 font-bold">Harga</th>
                <th className="px-4 py-3 font-bold">Ukuran</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-16 text-center text-neutral-500"
                  >
                    Tidak ada produk untuk filter ini.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const image = product.images?.[0];

                  return (
                    <tr
                      key={product.id}
                      className="border-t border-neutral-800/80 bg-neutral-950/40 hover:bg-neutral-900/50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
                            {image ? (
                              <Image
                                src={image}
                                alt={product.name}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-[10px] text-neutral-600">
                                No img
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-bold text-white">
                              {product.name}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {product.brand} · {product.category} ·{" "}
                              {product.grade}
                            </p>
                            <p className="truncate text-[10px] text-neutral-600">
                              /{product.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 font-bold text-yellow-400">
                        {formatRupiah(product.price)}
                      </td>

                      <td className="px-4 py-3 text-neutral-300">
                        {(product.sizes || []).join(", ") || "-"}
                      </td>

                      <td className="px-4 py-3">
                        {product.sold ? (
                          <span className="rounded-full border border-orange-500/40 bg-orange-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-300">
                            Terjual
                          </span>
                        ) : (
                          <span className="rounded-full border border-green-500/40 bg-green-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-green-400">
                            Tersedia
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <ProductRowActions
                          id={product.id}
                          name={product.name}
                          sold={product.sold}
                          isOwner={isOwner}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}