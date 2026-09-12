import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ChevronDown } from "lucide-react";
import {
  FALLBACK_SETTINGS,
  type SiteSettings,
} from "@/lib/products";

export function HeroSection({
  settings = FALLBACK_SETTINGS,
}: {
  settings?: SiteSettings;
}) {
  return (
    <section
      id="beranda"
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden"
    >
      {/* STYLE ANIMASI GERAK ZOOM-IN MENDEKAT KE LAYAR */}
      <style>{`
        @keyframes kenburnsZoom {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.15);
          }
        }
        .hero-kenburns-motion {
          animation: kenburnsZoom 18s ease-in-out infinite alternate;
        }
      `}</style>

      {/* Foto Latar Bergerak Zoom-In */}
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <Image
          src={settings.hero_image || FALLBACK_SETTINGS.hero_image}
          alt={`${settings.store_name || "Juara Sepatu"} hero`}
          fill
          priority
          quality={95}
          sizes="100vw"
          className="hero-kenburns-motion object-cover object-center brightness-110"
        />
      </div>

      {/* Lapisan peneduh tipis agar gambar sepatu CERAH */}
      <div className="absolute inset-0 bg-neutral-950/25" />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-transparent to-neutral-950" />

      {/* Cahaya aksen tema di tengah */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ backgroundColor: "var(--brand-soft)" }}
      />

      {/* KONTEN UTAMA MINIMALIS */}
      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        {/* Judul Utama Minimalis */}
        <h1 className="mb-4 text-3xl font-black uppercase leading-tight tracking-tight text-white drop-shadow-[0_8px_10px_rgba(0,0,0,0.9)] md:text-5xl">
          {settings.hero_title_line1 || FALLBACK_SETTINGS.hero_title_line1}{" "}
          <span className="text-brand drop-shadow-[0_8px_10px_rgba(0,0,0,0.9)]">
            {settings.hero_title_line2 || FALLBACK_SETTINGS.hero_title_line2}
          </span>
        </h1>

        {/* Deskripsi Minimalis */}
        <p className="mx-auto mb-8 max-w-md text-xs leading-relaxed text-neutral-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] md:text-sm font-medium">
          {settings.hero_description || FALLBACK_SETTINGS.hero_description}
        </p>

        {/* Tombol CTA Minimalis */}
        <div className="flex flex-col items-center justify-center gap-2.5 sm:flex-row">
          <Link
            href="#katalog"
            className="inline-flex w-full items-center justify-center gap-2 rounded-none bg-brand px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-black shadow-brand transition-all hover:-translate-y-0.5 hover:opacity-90 sm:w-auto md:text-xs"
          >
            Eksplorasi Sekarang <ShoppingBag className="h-4 w-4" />
          </Link>

          <Link
            href="#koleksi"
            className="inline-flex w-full items-center justify-center border border-white/40 bg-black/60 px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-white backdrop-blur-md transition-all hover:border-brand hover:text-brand sm:w-auto md:text-xs"
          >
            Lihat Koleksi
          </Link>
        </div>
      </div>

      {/* Panah scroll */}
      <Link
        href="#koleksi"
        aria-label="Gulir ke bawah"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white transition hover:text-brand"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </Link>
    </section>
  );
}