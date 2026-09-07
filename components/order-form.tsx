"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";
import {
  FALLBACK_SETTINGS,
  formatRupiah,
  waLink,
  type Product,
} from "@/lib/products";
import { createOrderAction } from "@/app/pesan/actions";

export function OrderForm({
  product,
  initialSize,
  adminPhone = FALLBACK_SETTINGS.whatsapp,
  storeName = FALLBACK_SETTINGS.store_name,
}: {
  product: Product;
  initialSize?: string;
  adminPhone?: string;
  storeName?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [size, setSize] = useState(
    initialSize && product.sizes.includes(initialSize)
      ? initialSize
      : product.sizes.length === 1
        ? product.sizes[0]
        : ""
  );
  const [error, setError] = useState("");
  const [done, setDone] = useState<{
    orderNumber: string;
  } | null>(null);

  const [nama, setNama] = useState("");
  const [telp, setTelp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [catatan, setCatatan] = useState("");

  const image = product.images?.[0] || "";

  const waMessage = useMemo(() => {
    if (!done) return "";
    return `Halo ${storeName}!\n\nSaya baru saja memesan lewat website:\n\n*No. Pesanan:* ${done.orderNumber}\n*Produk:* ${product.name}\n*Ukuran:* ${size}\n*Harga:* ${formatRupiah(product.price)}\n*Nama:* ${nama}\n*WA:* ${telp}\n*Alamat:* ${alamat}\n${catatan ? `*Catatan:* ${catatan}\n` : ""}\nMohon konfirmasinya ya.`;
  }, [done, storeName, product.name, product.price, size, nama, telp, alamat, catatan]);

  if (product.sold) {
    return (
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 text-center">
        <h1 className="text-2xl font-black uppercase">Produk Sudah Terjual</h1>
        <p className="mt-3 text-neutral-400">
          Silakan pilih produk lain di katalog.
        </p>
        <Link
          href="/#katalog"
          className="mt-6 inline-flex rounded-lg bg-yellow-400 px-5 py-3 text-xs font-black uppercase tracking-widest text-black"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-green-500/30 bg-neutral-900/50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-400" />
        <h1 className="mt-4 text-2xl font-black uppercase tracking-tight">
          Pesanan Terkirim
        </h1>
        <p className="mt-2 text-neutral-400">
          Nomor pesanan kamu:
        </p>
        <p className="mt-2 text-2xl font-black text-yellow-400">
          {done.orderNumber}
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm text-neutral-400">
          Tim {storeName} akan menghubungi kamu via WhatsApp untuk konfirmasi
          stok, ongkir, dan pembayaran.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={waLink(waMessage, adminPhone)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 text-xs font-black uppercase tracking-widest text-black transition hover:bg-green-400"
          >
            <MessageCircle className="h-4 w-4" />
            Chat Admin via WhatsApp
          </a>
          <Link
            href="/#katalog"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-6 py-3 text-xs font-black uppercase tracking-widest text-neutral-300 transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Lihat Katalog Lagi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
      {/* Ringkasan produk */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
        <Link
          href={`/produk/${product.slug}`}
          className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-yellow-400"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Detail
        </Link>

        <div className="relative mb-4 aspect-square overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
              priority
            />
          ) : null}
        </div>

        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
          {product.brand} · {product.grade}
        </p>
        <h1 className="mt-1 text-2xl font-black uppercase leading-tight">
          {product.name}
        </h1>
        <p className="mt-2 text-2xl font-black text-yellow-400">
          {formatRupiah(product.price)}
        </p>
      </div>

      {/* Form */}
      <form
        className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 md:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          setError("");

          if (!size) {
            setError("Silakan pilih ukuran.");
            return;
          }

          const fd = new FormData();
          fd.set("product_id", product.id || "");
          fd.set("product_slug", product.slug);
          fd.set("product_name", product.name);
          fd.set("product_price", String(product.price));
          fd.set("product_size", size);
          fd.set("product_image", image);
          fd.set("customer_name", nama);
          fd.set("customer_phone", telp);
          fd.set("customer_address", alamat);
          fd.set("customer_note", catatan);

          startTransition(async () => {
            const result = await createOrderAction(fd);
            if (!result.ok) {
              setError(result.message);
              return;
            }
            setDone({ orderNumber: result.orderNumber || "" });
          });
        }}
      >
        <div className="mb-6 flex items-center gap-2 text-yellow-400">
          <ShoppingBag className="h-5 w-5" />
          <h2 className="text-sm font-black uppercase tracking-widest">
            Form Pemesanan
          </h2>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Ukuran */}
        <div className="mb-5">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            Pilih Ukuran *
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => {
              const active = size === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`min-w-[56px] rounded-lg border px-4 py-2.5 text-sm font-bold transition ${
                    active
                      ? "border-yellow-400 bg-yellow-400 text-black"
                      : "border-neutral-700 bg-neutral-950 text-neutral-200 hover:border-yellow-400 hover:text-yellow-400"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Nama Lengkap *
            </label>
            <input
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama kamu"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              No. WhatsApp *
            </label>
            <input
              required
              value={telp}
              onChange={(e) => setTelp(e.target.value)}
              placeholder="08xxxxxxxxxx"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Alamat Pengiriman *
            </label>
            <textarea
              required
              rows={3}
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Jalan, kecamatan, kota, kode pos"
              className="w-full resize-y rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Catatan (opsional)
            </label>
            <textarea
              rows={2}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: tolong packing aman, kirim via JNE..."
              className="w-full resize-y rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm outline-none focus:border-yellow-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-400 py-4 text-sm font-black uppercase tracking-widest text-black transition hover:bg-yellow-300 disabled:opacity-60"
        >
          {pending ? (
            <>
              <LoaderCircle className="h-5 w-5 animate-spin" />
              Mengirim...
            </>
          ) : (
            <>
              <ShoppingBag className="h-5 w-5" />
              Kirim Pesanan
            </>
          )}
        </button>

        <p className="mt-4 text-center text-xs text-neutral-500">
          Setelah pesanan masuk, kamu bisa lanjut chat admin via WhatsApp untuk
          konfirmasi pembayaran.
        </p>
      </form>
    </div>
  );
}