import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { formatRupiah, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/produk/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/40 transition-all duration-300 hover:border-brand hover:bg-neutral-900"
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-950">
        <SafeImage
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
        />

        <span className="absolute left-3 top-3 rounded bg-brand px-2 py-1 text-[10px] font-black uppercase tracking-wider text-black">
          {product.grade}
        </span>

        {product.sold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <span className="rotate-[-8deg] border-2 border-red-500 px-4 py-1.5 text-sm font-black uppercase tracking-widest text-red-500">
              Terjual
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="mb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
          {product.brand} · {product.category}
        </span>

        <h4 className="mb-2 line-clamp-2 font-bold leading-snug transition-colors group-hover:text-brand">
          {product.name}
        </h4>

        <div className="mb-4 flex flex-wrap gap-1">
          {product.sizes.map((s) => (
            <span
              key={s}
              className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-bold text-neutral-300"
            >
              {s}
            </span>
          ))}
        </div>

        <p className="mt-auto text-xl font-black text-brand">
          {formatRupiah(product.price)}
        </p>
      </div>
    </Link>
  );
}