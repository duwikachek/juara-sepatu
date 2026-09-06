"use client";

import { useState } from "react";
import { MessageCircle, Check, AlertCircle, Ruler } from "lucide-react";
import {
  formatRupiah,
  waLink,
  FALLBACK_STORE_NAME,
  type Product,
} from "@/lib/products";

export function ProductPurchase({ product }: { product: Product }) {
  // Kalau cuma ada 1 ukuran, langsung dipilihkan otomatis
  const [size, setSize] = useState<string | null>(
    product.sizes.length === 1 ? product.sizes[0] : null
  );
  const [warn, setWarn] = useState(false);

  const message = `Halo ${FALLBACK_STORE_NAME}! Saya tertarik dengan produk ini:

*${product.name}*
Harga: ${formatRupiah(product.price)}
Ukuran yang saya pilih: ${size ?? "-"}

Apakah masih ready?`;

  const pilihUkuran = (s: string) => {
    setSize(s);
    setWarn(false);
  };

  /* ---------- Sudah terjual ---------- */
  if (product.sold) {
    return (
      <div className="space-y-6">
        <div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            Ukuran
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <span
                key={s}
                className="rounded-lg border border-neutral-800 bg-neutral-900/50 px-5 py-3 text-sm font-bold text-neutral-600 line-through"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-neutral-800 bg-neutral-900 py-4 text-center text-sm font-bold uppercase tracking-widest text-neutral-500">
          Produk Sudah Terjual
        </div>
      </div>
    );
  }

  /* ---------- Masih tersedia ---------- */
  return (
    <div className="space-y-6">
      {/* Pilih ukuran */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            <Ruler className="h-3.5 w-3.5" /> Pilih Ukuran
          </p>
          {size && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-400">
              Terpilih: {size}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => {
            const active = size === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => pilihUkuran(s)}
                aria-pressed={active}
                className={`relative min-w-[62px] rounded-lg border px-5 py-3 text-sm font-bold transition-all duration-200 ${
                  active
                    ? "border-yellow-400 bg-yellow-400 text-black shadow-lg shadow-yellow-400/20"
                    : "border-neutral-700 bg-neutral-950 text-neutral-200 hover:border-yellow-400 hover:text-yellow-400"
                }`}
              >
                {s}
                {active && (
                  <Check className="absolute -right-1.5 -top-1.5 h-5 w-5 rounded-full bg-black p-0.5 text-yellow-400" />
                )}
              </button>
            );
          })}
        </div>

        {warn && (
          <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-red-400">
            <AlertCircle className="h-4 w-4" />
            Silakan pilih ukuran terlebih dahulu.
          </p>
        )}
      </div>

      {/* Tombol pesan */}
      <a
        href={waLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (!size) {
            e.preventDefault();
            setWarn(true);
          }
        }}
        className={`flex w-full items-center justify-center gap-2 rounded-lg py-4 text-sm font-black uppercase tracking-widest transition ${
          size
            ? "bg-green-500 text-black hover:bg-green-400"
            : "cursor-not-allowed bg-neutral-800 text-neutral-500"
        }`}
      >
        <MessageCircle className="h-5 w-5" />
        {size ? `Pesan Ukuran ${size} via WhatsApp` : "Pilih Ukuran Dulu"}
      </a>
    </div>
  );
}