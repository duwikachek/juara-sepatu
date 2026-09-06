"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, PackageOpen } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import {
  getAllSizes,
  getBrands,
  type Product,
} from "@/lib/products";

type SortKey = "default" | "termurah" | "termahal";

export function CatalogSection({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("Semua");
  const [size, setSize] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("default");
  const [hideSold, setHideSold] = useState(true);

  const brands = useMemo(() => getBrands(products), [products]);
  const allSizes = useMemo(() => getAllSizes(products), [products]);

  const isFiltered =
    query !== "" || brand !== "Semua" || size !== null || sort !== "default";

  const resetAll = () => {
    setQuery("");
    setBrand("Semua");
    setSize(null);
    setSort("default");
  };

  const result = useMemo(() => {
    let list = [...products];

    if (hideSold) list = list.filter((p) => !p.sold);
    if (brand !== "Semua") list = list.filter((p) => p.brand === brand);
    if (size) list = list.filter((p) => p.sizes.includes(size));

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (sort === "termurah") list.sort((a, b) => a.price - b.price);
    if (sort === "termahal") list.sort((a, b) => b.price - a.price);

    return list;
  }, [products, query, brand, size, sort, hideSold]);

  return (
    <div className="flex flex-col gap-10 lg:flex-row">
      <aside className="w-full flex-shrink-0 lg:w-72">
        <div className="sticky top-28 space-y-6 rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-yellow-400">
              <SlidersHorizontal className="h-4 w-4" /> Filter
            </h3>
            {isFiltered && (
              <button
                onClick={resetAll}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-yellow-400"
              >
                <X className="h-3 w-3" /> Reset
              </button>
            )}
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Cari Sepatu
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Red Wing, Chelsea..."
                className="w-full rounded border border-neutral-800 bg-neutral-950 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-yellow-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Merek
            </label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full cursor-pointer rounded border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm outline-none transition focus:border-yellow-400"
            >
              <option>Semua</option>
              {brands.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Ukuran
            </label>
            <div className="grid grid-cols-3 gap-2">
              {allSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(size === s ? null : s)}
                  className={`rounded py-2.5 text-sm font-bold transition ${
                    size === s
                      ? "bg-yellow-400 text-black shadow-md shadow-yellow-400/20"
                      : "border border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-yellow-400 hover:text-yellow-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Urutkan Harga
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="w-full cursor-pointer rounded border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm outline-none transition focus:border-yellow-400"
            >
              <option value="default">Paling Sesuai</option>
              <option value="termurah">Termurah Dulu</option>
              <option value="termahal">Termahal Dulu</option>
            </select>
          </div>

          <label className="flex cursor-pointer items-center gap-2 border-t border-neutral-800 pt-4 text-xs text-neutral-400">
            <input
              type="checkbox"
              checked={hideSold}
              onChange={(e) => setHideSold(e.target.checked)}
              className="h-4 w-4 accent-yellow-400"
            />
            Sembunyikan yang terjual
          </label>
        </div>
      </aside>

      <div className="flex-1">
        <p className="mb-6 text-sm text-neutral-400">
          Menampilkan{" "}
          <span className="font-bold text-yellow-400">{result.length}</span>{" "}
          produk
          {size && (
            <>
              {" "}
              untuk ukuran <span className="font-bold text-white">{size}</span>
            </>
          )}
        </p>

        {result.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {result.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-800 py-24 text-center">
            <PackageOpen className="mb-4 h-12 w-12 text-neutral-700" />
            <h4 className="mb-1 text-lg font-bold">Produk tidak ditemukan</h4>
            <p className="mb-6 max-w-xs text-sm text-neutral-500">
              Coba ubah kata kunci, merek, atau ukuran yang dipilih.
            </p>
            <button
              onClick={resetAll}
              className="bg-yellow-400 px-6 py-3 text-xs font-black uppercase tracking-widest text-black transition hover:bg-yellow-500"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}