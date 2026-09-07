"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, LayoutDashboard } from "lucide-react";

function itemClass(active: boolean) {
  return active
    ? "flex items-center gap-3 rounded-lg bg-yellow-400 px-4 py-3 text-sm font-black uppercase tracking-wider text-black"
    : "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wider text-neutral-300 transition hover:bg-neutral-800 hover:text-yellow-400";
}

export function AdminSidebar() {
  const pathname = usePathname() || "/admin";
  const onProducts = pathname.startsWith("/admin/produk");
  const onDashboard = pathname === "/admin";

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

      <p className="px-4 py-3 text-xs leading-relaxed text-neutral-500">
        Galeri, konten, pesanan, dan tema menyusul di tahap berikutnya.
      </p>
    </nav>
  );
}