"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const links = [
  { label: "Beranda", href: "/#beranda" },
  { label: "Referensi", href: "/#koleksi" },
  { label: "Katalog", href: "/#katalog" },
  { label: "Tentang", href: "/#tentang" },
  { label: "Kontak", href: "/#kontak" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  // true = di paling atas (hero terlihat) → nav normal di desktop
  // false = setelah scroll (> 60px) → logo ke tengah & nav disembunyikan jadi hamburger
  const [isAtTop, setIsAtTop] = useState(true);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const atTop = window.scrollY < 60;
      setIsAtTop(atTop);
      if (atTop) {
        setOpen(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup menu jika klik di luar header
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-[100] border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md"
    >
      {/* Container header */}
      <div className="relative flex h-20 w-full items-center justify-between px-6 md:px-8">
        {/* LOGO — di kiri saat di atas, pindah ke tengah saat di-scroll */}
        <Link
          href="/"
          className={[
            "flex items-center transition-all duration-500 ease-in-out hover:opacity-80",
            isAtTop
              ? "relative translate-x-0"
              : "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
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

        {/* NAVIGASI DESKTOP — hanya tampil saat di paling atas (isAtTop) */}
        <nav
          className={[
            "ml-auto items-center gap-8 text-sm font-bold uppercase tracking-wider text-neutral-400 transition-all duration-300",
            isAtTop ? "hidden md:flex" : "hidden",
          ].join(" ")}
        >
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

        {/* TOMBOL HAMBURGER MENU — selalu muncul di mobile, dan otomatis muncul di desktop saat di-scroll */}
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          className={[
            "ml-auto items-center justify-center rounded-lg p-2 text-brand transition hover:bg-neutral-900 hover:text-white",
            isAtTop ? "flex md:hidden" : "flex",
          ].join(" ")}
        >
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* DROPDOWN / POPOVER MENU (MOBILE & DESKTOP KETIKA HAMBURGER AKTIF) */}
      {open && (
        <div className="w-full border-b border-neutral-800 bg-neutral-950/95 px-6 py-6 shadow-2xl backdrop-blur-xl md:absolute md:right-8 md:top-full md:mt-2 md:w-64 md:rounded-2xl md:border md:p-4">
          <div className="flex flex-col gap-3 text-sm font-bold uppercase tracking-wider text-neutral-300">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 transition-colors hover:bg-neutral-900 hover:text-brand"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}