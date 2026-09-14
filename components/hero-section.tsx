import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import {
  FALLBACK_SETTINGS,
  type SiteSettings,
} from "@/lib/products";

export function HeroSection({
  settings = FALLBACK_SETTINGS,
}: {
  settings?: SiteSettings;
}) {
  const heroImg = settings.hero_image || FALLBACK_SETTINGS.hero_image;
  const titleLine1 = settings.hero_title_line1 || FALLBACK_SETTINGS.hero_title_line1;
  const titleLine2 = settings.hero_title_line2 || FALLBACK_SETTINGS.hero_title_line2;
  const description = settings.hero_description || FALLBACK_SETTINGS.hero_description;
  const storeName = settings.store_name || FALLBACK_SETTINGS.store_name;
  const stat1Val = settings.hero_stat_1_value || "100%";
  const stat1Label = settings.hero_stat_1_label || "Thrift Terkurasi";
  const stat2Val = settings.hero_stat_2_value || "98%";
  const stat2Label = settings.hero_stat_2_label || "Kepuasan Pembeli";
  const badgeText =
    settings.hero_badge_text ||
    "Kurasi boots kulit second: Red Wing, Dr. Martens, Timberland, Clarks siap pakai.";
  const badgeTag = settings.hero_badge_tag || "ORIGINAL GRADE";

  return (
    <section
      id="beranda"
      className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-neutral-950 pt-24 pb-8 md:pt-28 md:pb-12"
    >
      {/* STYLE ANIMASI GERAK ZOOM-IN */}
      <style>{`
        @keyframes kenburnsZoom {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.12);
          }
        }
        .hero-kenburns-motion {
          animation: kenburnsZoom 22s ease-in-out infinite alternate;
        }
      `}</style>

      {/* 1. FOTO LATAR EXISTING - TERANG, CERAH & CLEAN */}
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <Image
          src={heroImg}
          alt={`${storeName} hero`}
          fill
          priority
          quality={95}
          sizes="100vw"
          className="hero-kenburns-motion object-cover object-center brightness-115 contrast-[1.05] saturate-[1.08]"
        />
      </div>

      {/* 2. LAPISAN PENEDUH MINIMALIS & BERSIH (TIDAK GELAP, FOTO TETAP VIBRANT & CLEAN) */}
      <div className="absolute inset-0 bg-neutral-950/15" />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/50 via-transparent to-neutral-950/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/25" />
      
      {/* Cahaya aksen tema lembut */}
      <div
        className="pointer-events-none absolute left-1/3 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] opacity-20"
        style={{ backgroundColor: "var(--brand-soft)" }}
      />


      {/* 5. KONTEN GRID UTAMA */}
      <div className="relative z-10 flex h-full w-full flex-1 flex-col justify-between px-8">
        
        {/* BAGIAN ATAS: STATISTIK DI KIRI + PARAGRAF EDITORIAL DI KANAN (UKURAN 70%) */}
        <div className="flex flex-col gap-6 pt-4 sm:flex-row sm:items-start sm:justify-between">
          
          {/* STATS (DIPERKECIL KE 70% DARI SEBELUMNYA) */}
          <div className="flex items-center gap-5 sm:gap-8">
            <div>
              <div className="text-[17px] font-normal tracking-tight text-white sm:text-[22px] lg:text-[30px]">
                {stat1Val}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[6px] font-normal uppercase tracking-wider text-neutral-300 sm:text-[7px]">
                <span className="inline-block h-1 w-1 rounded-full bg-brand shadow-[0_0_4px_var(--brand)] animate-pulse" />
                {stat1Label}
              </div>
            </div>

            <div>
              <div className="text-[17px] font-normal tracking-tight text-white sm:text-[22px] lg:text-[30px]">
                {stat2Val}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[6px] font-normal uppercase tracking-wider text-neutral-300 sm:text-[7px]">
                <span className="inline-block h-1 w-1 rounded-full bg-brand shadow-[0_0_4px_var(--brand)]" />
                {stat2Label}
              </div>
            </div>
          </div>

          {/* TEKS EDITORIAL KANAN (FORMAT NORMAL/REGULAR) */}
          <div className="max-w-[280px] sm:text-right">
            <p className="text-[8px] font-normal uppercase leading-normal tracking-wider text-neutral-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] sm:text-[8.5px]">
              {description}
            </p>
          </div>
        </div>

        {/* BAGIAN BAWAH: HEADLINE BESAR & TOMBOL DI KIRI + FLOATING CARD DI KANAN */}
        <div className="mt-16 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          
          {/* SISI KIRI: HEADLINE & GROUP BUTTON (DIPERKECIL KE 70%) */}
          <div className="max-w-xl space-y-4">
            <h1 className="text-2xl font-black uppercase leading-[0.95] tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] sm:text-4xl md:text-5xl lg:text-[64px]">
              {titleLine1} <br />
              <span className="text-white">
                {titleLine2}
              </span>
            </h1>

            {/* BUTTON CTA: DIPERKECIL KE 70% */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              
              {/* TOMBOL UTAMA MODEL DUA BAGIAN (PUTIH + KOTAK AKSEN BRAND) */}
              <div className="inline-flex items-stretch rounded-md overflow-hidden shadow-2xl transition hover:opacity-95">
                <Link
                  href="#katalog"
                  className="flex items-center bg-white px-3.5 py-2 sm:px-4 sm:py-2.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-black transition hover:bg-neutral-200"
                >
                  Eksplorasi Katalog
                </Link>
                <Link
                  href="#katalog"
                  aria-label="Buka katalog"
                  className="flex items-center justify-center bg-brand px-2.5 py-2 sm:px-3 sm:py-2.5 text-black transition hover:brightness-110"
                >
                  <ArrowUpRight className="h-4 w-4 stroke-[2.8]" />
                </Link>
              </div>

              {/* SECONDARY TEXT LINK: DIPERKECIL KE 70% */}
              <Link
                href="#koleksi"
                className="group flex items-center gap-1.5 px-2 py-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-neutral-200 transition hover:text-brand"
              >
                <span>Lihat Koleksi Spesial</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1 text-brand">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* SISI KANAN: FLOATING GLASS CARD DENGAN MINI THUMBNAIL (PERSIS SEPERTI WIDGET KANAN BAWAH DI REFERENSI) */}
          <div className="w-full max-w-sm">
            <div className="flex items-center gap-4 rounded-2xl border border-white/20 bg-black/60 p-4 backdrop-blur-xl shadow-[0_12px_36px_rgba(0,0,0,0.7)] transition-all hover:border-brand/40">
              <div className="flex-1 space-y-2">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-brand">
                    {storeName}
                  </span>
                </div>
                <p className="text-[11px] font-medium leading-snug text-neutral-300">
                  {badgeText}
                </p>
                <div className="flex items-center justify-between pt-1 text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                  <span>{"// 2026"}</span>
                  <span className="text-white font-black">{badgeTag}</span>
                </div>
              </div>

              {/* MINI THUMBNAIL FOTO BOOTS DENGAN ROUNDED CORNERS */}
              <div className="relative h-20 w-16 sm:h-24 sm:w-20 shrink-0 overflow-hidden rounded-xl border border-white/25 shadow-inner">
                <Image
                  src={heroImg}
                  alt="Mini preview boots"
                  fill
                  sizes="100px"
                  className="object-cover object-center brightness-110"
                />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* PANAH SCROLL KE BAWAH */}
      <Link
        href="#koleksi"
        aria-label="Gulir ke bawah"
        className="absolute bottom-2 left-1/2 z-10 -translate-x-1/2 text-white/70 transition hover:text-brand"
      >
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </Link>
    </section>
  );
}