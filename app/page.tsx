import Link from "next/link";
import {
  Boxes,
  CheckCircle2,
  ImageIcon,
  NotebookText,
  PackagePlus,
  Palette,
  ShoppingBag,
  TriangleAlert,
} from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { formatRupiah } from "@/lib/products";

export default async function AdminDashboardPage() {
  const { supabase, profile, isOwner } = await requireAdmin();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, sold, images, updated_at")
    .order("updated_at", { ascending: false });

  const list = products ?? [];
  const total = list.length;
  const available = list.filter((p) => !p.sold).length;
  const sold = list.filter((p) => p.sold).length;
  const noImage = list.filter(
    (p) => !p.images || p.images.length === 0
  ).length;
  const stockValue = list
    .filter((p) => !p.sold)
    .reduce((sum, p) => sum + (p.price || 0), 0);

  const recent = list.slice(0, 5);

  return (
    <main className="space-y-8">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-yellow-400">
          Halo, {profile.full_name || profile.email || "Admin"}
        </p>
        <h1 className="text-3xl font-black uppercase tracking-tight md:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-400">
          Ringkasan toko saat ini. Kelola produk lewat menu kiri, atau langsung
          tambah produk baru.
        </p>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Total Produk
            </span>
            <Boxes className="h-4 w-4 text-yellow-400" />
          </div>
          <p className="text-3xl font-black text-white">{total}</p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Tersedia
            </span>
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </div>
          <p className="text-3xl font-black text-green-400">{available}</p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Terjual
            </span>
            <ShoppingBag className="h-4 w-4 text-orange-300" />
          </div>
          <p className="text-3xl font-black text-orange-300">{sold}</p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Nilai Stok
            </span>
            <span className="text-[10px] font-bold text-yellow-400">IDR</span>
          </div>
          <p className="text-xl font-black text-yellow-400 md:text-2xl">
            {formatRupiah(stockValue)}
          </p>
          <p className="mt-1 text-[11px] text-neutral-500">
            Total harga produk yang masih tersedia
          </p>
        </div>
      </div>

      {/* Peringatan */}
      {noImage > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-200">
          <TriangleAlert className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-bold">{noImage} produk belum punya foto</p>
            <p className="mt-1 text-orange-200/80">
              Produk tanpa foto kurang menarik di katalog. Lengkapi lewat menu
              Produk → Edit.
            </p>
          </div>
        </div>
      )}

      {/* Aksi cepat */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link
          href="/admin/produk/baru"
          className="group rounded-xl border border-yellow-500/40 bg-yellow-400/10 p-5 transition hover:bg-yellow-400 hover:text-black"
        >
          <PackagePlus className="mb-3 h-6 w-6 text-yellow-400 group-hover:text-black" />
          <h2 className="font-black uppercase">Tambah Produk</h2>
          <p className="mt-1 text-sm opacity-80">
            Upload foto dan isi detail sepatu baru.
          </p>
        </Link>

        <Link
          href="/admin/produk"
          className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 transition hover:border-yellow-400/50"
        >
          <Boxes className="mb-3 h-6 w-6 text-yellow-400" />
          <h2 className="font-black uppercase">Kelola Produk</h2>
          <p className="mt-1 text-sm text-neutral-400">
            Edit, tandai terjual
            {isOwner ? ", atau hapus produk." : "."}
          </p>
        </Link>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 transition hover:border-yellow-400/50"
        >
          <ShoppingBag className="mb-3 h-6 w-6 text-yellow-400" />
          <h2 className="font-black uppercase">Lihat Toko</h2>
          <p className="mt-1 text-sm text-neutral-400">
            Buka tampilan publik di tab baru.
          </p>
        </a>
      </div>

      {/* Produk terbaru */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40">
        <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
          <h2 className="text-sm font-black uppercase tracking-wide">
            Produk Terbaru Diubah
          </h2>
          <Link
            href="/admin/produk"
            className="text-[11px] font-bold uppercase tracking-widest text-yellow-400 hover:underline"
          >
            Lihat semua
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-neutral-500">
            Belum ada produk.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-800">
            {recent.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-4 px-5 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold text-white">{p.name}</p>
                  <p className="text-xs text-neutral-500">
                    {formatRupiah(p.price)} ·{" "}
                    {p.sold ? "Terjual" : "Tersedia"}
                    {(!p.images || p.images.length === 0) && " · Tanpa foto"}
                  </p>
                </div>
                <Link
                  href={`/admin/produk/${p.id}`}
                  className="flex-shrink-0 text-[11px] font-bold uppercase tracking-widest text-neutral-400 hover:text-yellow-400"
                >
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Roadmap singkat */}
      <div>
        <h2 className="mb-4 text-sm font-black uppercase tracking-wide text-neutral-300">
          Menyusul
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-dashed border-neutral-800 p-4">
            <ImageIcon className="mb-2 h-5 w-5 text-neutral-500" />
            <p className="text-sm font-bold">Galeri</p>
            <p className="text-xs text-neutral-500">Tahap D</p>
          </div>
          <div className="rounded-xl border border-dashed border-neutral-800 p-4">
            <NotebookText className="mb-2 h-5 w-5 text-neutral-500" />
            <p className="text-sm font-bold">Teks & Kontak</p>
            <p className="text-xs text-neutral-500">Tahap D</p>
          </div>
          <div className="rounded-xl border border-dashed border-neutral-800 p-4">
            <Palette className="mb-2 h-5 w-5 text-neutral-500" />
            <p className="text-sm font-bold">Pesanan & Tema</p>
            <p className="text-xs text-neutral-500">Tahap E</p>
          </div>
        </div>
      </div>
    </main>
  );
}