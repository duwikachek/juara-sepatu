"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  ClipboardList,
  Images,
  LayoutDashboard,
  NotebookText,
  Palette,
} from "lucide-react";

function itemClass(active: boolean) {
  return active
    ? "flex items-center gap-3 rounded-lg bg-brand px-4 py-3 text-sm font-black uppercase tracking-wider text-black"
    : "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wider text-neutral-300 transition hover:bg-neutral-800 hover:text-brand";
}

export function AdminSidebar() {
  const pathname = usePathname() || "/admin";

  const onDashboard = pathname === "/admin";
  const onProducts = pathname.startsWith("/admin/produk");
  const onOrders = pathname.startsWith("/admin/pesanan");
  const onContent = pathname.startsWith("/admin/konten");
  const onGallery = pathname.startsWith("/admin/galeri");
  const onTheme = pathname.startsWith("/admin/tema");

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

      <Link href="/admin/pesanan" className={itemClass(onOrders)}>
        <ClipboardList className="h-4 w-4" />
        Pesanan
      </Link>

      <Link href="/admin/konten" className={itemClass(onContent)}>
        <NotebookText className="h-4 w-4" />
        Konten
      </Link>

      <Link href="/admin/galeri" className={itemClass(onGallery)}>
        <Images className="h-4 w-4" />
        Galeri
      </Link>

      <Link href="/admin/tema" className={itemClass(onTheme)}>
        <Palette className="h-4 w-4" />
        Tema
      </Link>
    </nav>
  );
}