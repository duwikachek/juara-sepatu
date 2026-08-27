import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Check, ShieldCheck, Truck } from "lucide-react";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchase } from "@/components/product-purchase";
import { ProductCard } from "@/components/product-card";
import {
  formatRupiah,
  getProductBySlug,
  getRelated,
  products,
} from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Produk Tidak Ditemukan" };

  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [product.images[0]] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelated(slug);

  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      <Link
        href="/#katalog"
        className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 transition hover:text-yellow-400"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Katalog
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded bg-yellow-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-black">
              {product.grade}
            </span>
            <span className="rounded-full border border-neutral-700 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-300">
              {product.brand}
            </span>
            {product.sold && (
              <span className="rounded border border-red-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-red-500">
                Terjual
              </span>
            )}
          </div>

          <h1 className="mb-3 text-3xl font-black uppercase leading-tight tracking-tight md:text-4xl">
            {product.name}
          </h1>

          <p className="mb-6 text-3xl font-black text-yellow-400">
            {formatRupiah(product.price)}
          </p>

          <p className="mb-8 leading-relaxed text-neutral-400">
            {product.description}
          </p>

          {/* Kondisi & poin unggulan */}
          <div className="mb-8 rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-yellow-400">
              Kondisi: {product.condition}
            </p>
            <ul className="space-y-2.5">
              {product.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-2 text-sm text-neutral-300"
                >
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Pilih ukuran + tombol WhatsApp */}
          <ProductPurchase product={product} />

          <div className="mt-6 grid grid-cols-2 gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-yellow-400" /> Garansi
              keaslian
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-yellow-400" /> Kirim seluruh
              Indonesia
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24 border-t border-neutral-800 pt-16">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-8 w-2 bg-yellow-400" />
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Produk Lainnya
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}