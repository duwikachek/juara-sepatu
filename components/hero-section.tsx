import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Sparkles, ChevronDown } from "lucide-react";
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
            transform: scale(1.18);
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

      {/* Lapisan peneduh dibuat tipis (25% kegelapan) agar gambar sepatu SANGAT CERAH */}
      <div className="absolute inset-0 bg-neutral-950/25" />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-transparent to-neutral-950" />

      {/* Cahaya aksen tema di tengah */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
        style={{ backgroundColor: "var(--brand-soft)" }}
      />

      {/* Konten Utama */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand bg-neutral-950/80 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-brand backdrop-blur-md md:text-xs shadow-xl">
          <Sparkles className="h-3.5 w-3.5" />
          {settings.tagline || FALLBACK_SETTINGS.tagline}
        </div>

        <h1 className="mb-6 text-5xl font-black uppercase leading-[0.9] tracking-tighter text-white drop-shadow-[0_10px_12px_rgba(0,0,0,0.9)] md:text-8xl">
          {settings.hero_title_line1 || FALLBACK_SETTINGS.hero_title_line1}{" "}
          <span className="text-brand drop-shadow-[0_10px_12px_rgba(0,0,0,0.9)]">
            {settings.hero_title_line2 || FALLBACK_SETTINGS.hero_title_line2}
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-white drop-shadow-[0_4px_6px_rgba(0,0,0,1)] md:text-lg font-medium">
          {settings.hero_description || FALLBACK_SETTINGS.hero_description}
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="#katalog"
            className="inline-flex w-full items-center justify-center gap-3 rounded-none bg-brand px-8 py-4 text-xs font-black uppercase tracking-widest text-black shadow-brand transition-all hover:-translate-y-1 hover:opacity-90 sm:w-auto md:text-sm"
          >
            Eksplorasi Sekarang <ShoppingBag className="h-5 w-5" />
          </Link>

          <Link
            href="#koleksi"
            className="inline-flex w-full items-center justify-center border border-white/40 bg-black/60 px-8 py-4 text-xs font-black uppercase tracking-widest text-white backdrop-blur-md transition-all hover:border-brand hover:text-brand sm:w-auto md:text-sm"
          >
            Lihat Koleksi
          </Link>
        </div>
      </div>

      {/* Panah scroll */}
      <Link
        href="#koleksi"
        aria-label="Gulir ke bawah"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white transition hover:text-brand"
      >
        <ChevronDown className="h-7 w-7 animate-bounce" />
      </Link>
    </section>
  );
}