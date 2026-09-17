"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  ClipboardList,
  Images,
  NotebookText,
  Palette,
} from "lucide-react";

function itemClass(active: boolean) {
  return active
    ? "flex items-center gap-2 whitespace-nowrap rounded-lg bg-brand px-3.5 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider text-black shadow-sm"
    : "flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-400 transition hover:bg-neutral-800 hover:text-brand";
}

export function AdminSidebar() {
  const pathname = usePathname() || "/admin/konten";

  const onContent = pathname.startsWith("/admin/konten") || pathname === "/admin";
  const onProducts = pathname.startsWith("/admin/produk");
  const onGallery = pathname.startsWith("/admin/galeri");
  const onTheme = pathname.startsWith("/admin/tema");
  const onOrders = pathname.startsWith("/admin/pesanan");

  return (
    <nav className="flex overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/60 p-1.5 sm:p-2 lg:flex-col lg:space-y-1 lg:overflow-visible">
      <Link href="/admin/konten" className={itemClass(onContent)}>
        <NotebookText className="h-4 w-4 flex-shrink-0" />
        <span>Edit Konten</span>
      </Link>

      <Link href="/admin/produk" className={itemClass(onProducts)}>
        <Boxes className="h-4 w-4 flex-shrink-0" />
        <span>Produk Sepatu</span>
      </Link>

      <Link href="/admin/galeri" className={itemClass(onGallery)}>
        <Images className="h-4 w-4 flex-shrink-0" />
        <span>Galeri Foto</span>
      </Link>

      <Link href="/admin/tema" className={itemClass(onTheme)}>
        <Palette className="h-4 w-4 flex-shrink-0" />
        <span>Tema Warna</span>
      </Link>

      <Link href="/admin/pesanan" className={itemClass(onOrders)}>
        <ClipboardList className="h-4 w-4 flex-shrink-0" />
        <span>Pesanan Masuk</span>
      </Link>
    </nav>
  );
}