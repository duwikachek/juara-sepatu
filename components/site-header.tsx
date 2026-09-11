"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { label: "Beranda", href: "/#beranda" },
  { label: "Koleksi", href: "/#koleksi" },
  { label: "Katalog", href: "/#katalog" },
  { label: "Tentang", href: "/#tentang" },
  { label: "Kontak", href: "/#kontak" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-[100] border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* LOGO GAMBAR VINTAGE */}
        <Link href="/" className="flex items-center transition hover:opacity-80">
          <Image
            src="/logo.jpg"
            alt="Juara Sepatu Logo"
            width={200}
            height={70}
            className="h-12 w-auto object-contain py-1 md:h-14"
            priority
          />
        </Link>

        {/* NAVIGASI DESKTOP */}
        <nav className="hidden items-center gap-8 text-sm font-bold uppercase tracking-wider text-neutral-400 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="py-2 transition-colors hover:text-yellow-400"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* TOMBOL MENU MOBILE (HP) */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Buka menu"
          className="p-2 text-yellow-400 transition hover:text-white md:hidden"
        >
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* DROPDOWN MENU MOBILE */}
      {open && (
        <div className="flex flex-col gap-4 border-b border-neutral-800 bg-neutral-950 px-6 py-6 text-sm font-bold uppercase tracking-wider text-neutral-300 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-1 hover:text-yellow-400"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}