import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-32 text-center">
      <p className="mb-4 text-8xl font-black tracking-tighter text-yellow-400 md:text-9xl">
        404
      </p>
      <h1 className="mb-3 text-2xl font-black uppercase tracking-tight md:text-3xl">
        Halaman Tidak Ditemukan
      </h1>
      <p className="mb-10 max-w-md text-neutral-400">
        Sepertinya sepatu yang kamu cari sudah pindah rak, atau alamatnya salah
        ketik.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-yellow-400 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-black transition hover:bg-yellow-500"
        >
          <Home className="h-4 w-4" /> Kembali ke Beranda
        </Link>
        <Link
          href="/#katalog"
          className="inline-flex items-center justify-center gap-2 border border-neutral-700 px-6 py-3.5 text-xs font-black uppercase tracking-widest transition hover:border-yellow-400 hover:text-yellow-400"
        >
          <Search className="h-4 w-4" /> Lihat Katalog
        </Link>
      </div>
    </main>
  );
}