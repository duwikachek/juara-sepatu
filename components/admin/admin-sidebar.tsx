"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  Images,
  LayoutDashboard,
  NotebookText,
} from "lucide-react";

function itemClass(active: boolean) {
  return active
    ? "flex items-center gap-3 rounded-lg bg-yellow-400 px-4 py-3 text-sm font-black uppercase tracking-wider text-black"
    : "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wider text-neutral-300 transition hover:bg-neutral-800 hover:text-yellow-400";
}

export function AdminSidebar() {
  const pathname = usePathname() || "/admin";

  const onDashboard = pathname === "/admin";
  const onProducts = pathname.startsWith("/admin/produk");
  const onContent = pathname.startsWith("/admin/konten");
  const onGallery = pathname.startsWith("/admin/galeri");

  return (
    <nav className="space-y-2 rounded-xl border border-neutral-800 bg-neutral-900/50 p-3">
      <Link href="/admin" className={itemClass(onDashboard)}>
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </Link>

      <Link href="/admin/produk" className={itemClass(onProducts)}>
        <Boxes className="h-4 w-4" />
        Produk
      </Link>

      <Link href="/admin/konten" className={itemClass(onContent)}>
        <NotebookText className="h-4 w-4" />
        Konten
      </Link>

      <Link href="/admin/galeri" className={itemClass(onGallery)}>
        <Images className="h-4 w-4" />
        Galeri
      </Link>

      <p className="px-4 py-3 text-xs leading-relaxed text-neutral-500">
        Menu Galeri aktif di tahap D2. Pesanan & tema menyusul di tahap E.
      </p>
    </nav>
  );
}