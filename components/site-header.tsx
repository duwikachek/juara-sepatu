"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const links = [
  { label: "Beranda", href: "/#beranda" },
  { label: "Koleksi", href: "/#koleksi" },
  { label: "Katalog", href: "/#katalog" },
  { label: "Tentang", href: "/#tentang" },
  { label: "Kontak", href: "/#kontak" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  // true = di paling atas (hero terlihat) → logo ke tengah
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 60);
    };
    // Cek posisi awal
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[100] border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      {/* Container dengan position relative agar logo bisa absolute ke tengah */}
      <div className="relative flex h-20 w-full items-center justify-between px-8">

        {/* LOGO — absolute ke tengah saat di atas, kembali ke kiri saat scroll */}
        <Link
          href="/"
          className={[
            "flex items-center transition-all duration-500 ease-in-out hover:opacity-80",
            isAtTop
              ? "relative translate-x-0"               // pojok kiri (di atas)
              : "absolute left-1/2 -translate-x-1/2",  // tengah (saat scroll)
          ].join(" ")}
        >
          {!imgError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src="/logo.png"
              alt="Juara Sepatu Logo"
              onError={() => setImgError(true)}
              style={{ height: "48px", width: "auto", maxHeight: "48px" }}
              className="h-12 w-auto object-contain py-1 md:h-14"
            />
          ) : (
            <span className="text-2xl font-black uppercase tracking-tighter text-brand">
              JUARA SEPATU.
            </span>
          )}
        </Link>

        {/* SPACER kiri — menjaga flex layout agar nav tetap di kanan */}
        <div className="h-12 w-auto opacity-0 pointer-events-none" aria-hidden>
          {/* placeholder setara lebar logo agar nav tidak geser */}
          <img
            src="/logo.png"
            alt=""
            style={{ height: "48px", width: "auto", maxHeight: "48px" }}
            className="h-12 w-auto object-contain py-1 md:h-14"
          />
        </div>

        {/* NAVIGASI DESKTOP */}
        <nav className="ml-auto hidden items-center gap-8 text-sm font-bold uppercase tracking-wider text-neutral-400 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="py-2 transition-colors hover:text-brand"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* TOMBOL MENU MOBILE (HP) */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Buka menu"
          className="p-2 text-brand transition hover:text-white md:hidden"
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
              className="py-1 hover:text-brand"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}