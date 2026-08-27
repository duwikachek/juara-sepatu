import Link from "next/link";
import { ShoppingBag, Sparkles, ShieldCheck, MapPin, Phone, Mail } from "lucide-react";
import { ElasticGallery } from "@/components/ui/elastic-gallery";
import { CatalogSection } from "@/components/catalog-section";
import { ContactForm } from "@/components/contact-form";
import { SafeImage } from "@/components/ui/safe-image";

export default function Home() {
  return (
    <main>
      {/* ---------- HERO ---------- */}
      <section id="beranda" className="mx-auto max-w-7xl scroll-mt-28 px-6 pb-16 pt-36 text-center md:pb-24 md:pt-48">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-yellow-400">
          <Sparkles className="h-4 w-4" /> Curated Thrift Boots Store
        </div>

        <h1 className="mb-6 text-5xl font-black uppercase leading-none tracking-tighter md:text-8xl">
          Katalog{" "}
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Boots Thrift
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-neutral-400 md:text-lg">
          Pilihan sepatu bot urban yang kokoh untuk kolektor cerdas. Restorasi
          premium, terawat sempurna, dan siap pakai.
        </p>

        <Link
          href="#katalog"
          className="mx-auto inline-flex items-center gap-3 bg-yellow-400 px-8 py-4 font-black uppercase tracking-widest text-black shadow-lg shadow-yellow-500/20 transition-all hover:-translate-y-1 hover:bg-yellow-500"
        >
          Eksplorasi Sekarang <ShoppingBag className="h-5 w-5" />
        </Link>
      </section>

      {/* ---------- KOLEKSI SPESIAL ---------- */}
      <section id="koleksi" className="scroll-mt-24 border-t border-neutral-800 bg-black py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-2 flex items-center gap-4">
            <div className="h-8 w-2 bg-yellow-400" />
            <h2 className="text-3xl font-black uppercase tracking-tight">Koleksi Spesial</h2>
          </div>
          <p className="text-neutral-400">Pilihan boots langka yang baru saja direstorasi.</p>
        </div>
        <ElasticGallery />
      </section>

      {/* ---------- KATALOG ---------- */}
      <section id="katalog" className="mx-auto max-w-7xl scroll-mt-24 border-t border-neutral-800 px-6 py-24">
        <div className="mb-12">
          <div className="mb-2 flex items-center gap-4">
            <div className="h-8 w-2 bg-yellow-400" />
            <h2 className="text-3xl font-black uppercase tracking-tight">Katalog Sepatu</h2>
          </div>
          <p className="text-neutral-400">Cari berdasarkan nama, merek, atau ukuran kaki Anda.</p>
        </div>

        <CatalogSection />
      </section>

      {/* ---------- TENTANG ---------- */}
      <section id="tentang" className="scroll-mt-24 border-t border-neutral-800 bg-neutral-900/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center gap-4">
                <div className="h-8 w-2 bg-yellow-400" />
                <h2 className="text-3xl font-black uppercase tracking-tight md:text-5xl">Tentang Kami</h2>
              </div>

              <p className="mb-6 text-lg leading-relaxed text-neutral-300">
                <strong className="text-yellow-400">JUARA SEPATU</strong> hadir dari
                passion mendalam terhadap footwear kulit berkualitas tinggi. Kami
                percaya sepatu boots terbaik memiliki cerita dan karakter yang
                semakin indah seiring waktu.
              </p>

              <p className="mb-8 leading-relaxed text-neutral-400">
                Setiap pasang melalui pemilihan ketat, sanitasi higienis, serta
                restorasi profesional agar siap langsung Anda pakai dengan bangga.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                  <ShieldCheck className="mb-2 h-6 w-6 text-yellow-400" />
                  <h4 className="mb-1 text-sm font-bold uppercase">Kurasi Ketat</h4>
                  <p className="text-xs text-neutral-400">Hanya brand original dengan kondisi di atas 85%.</p>
                </div>
                <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                  <Sparkles className="mb-2 h-6 w-6 text-yellow-400" />
                  <h4 className="mb-1 text-sm font-bold uppercase">Restorasi Premium</h4>
                  <p className="text-xs text-neutral-400">Deep clean, conditioning, dan sterilisasi anti-bakteri.</p>
                </div>
              </div>
            </div>

            <div className="relative h-[450px] overflow-hidden rounded-2xl border border-neutral-800">
              <SafeImage
                src="https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1200&auto=format&fit=crop"
                alt="Workshop Juara Sepatu"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute inset-x-8 bottom-8">
                <p className="mb-1 text-sm font-bold uppercase tracking-widest text-yellow-400">Filosofi Kami</p>
                <h3 className="text-2xl font-black uppercase">Karakter Autentik Tanpa Kompromi</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- KONTAK ---------- */}
      <section id="kontak" className="mx-auto max-w-7xl scroll-mt-24 border-t border-neutral-800 px-6 py-24">
        <div className="mb-4 flex items-center gap-4">
          <div className="h-8 w-2 bg-yellow-400" />
          <h2 className="text-3xl font-black uppercase tracking-tight md:text-5xl">Hubungi Kami</h2>
        </div>
        <p className="mb-12 max-w-xl text-neutral-400">
          Ada pertanyaan seputar ukuran atau kondisi sepatu? Tim kami siap membantu.
        </p>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <ContactForm />

          <div className="flex flex-col justify-between gap-6">
            <div className="space-y-6 rounded-xl border border-neutral-800 bg-neutral-900/50 p-8">
              <h3 className="text-xl font-bold uppercase text-yellow-400">Informasi Kontak</h3>

              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-6 w-6 flex-shrink-0 text-yellow-400" />
                <div>
                  <h5 className="text-sm font-bold uppercase">Store Studio</h5>
                  <p className="text-sm text-neutral-400">Jl. Pemuda No. 123, Bandung, Jawa Barat</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="h-6 w-6 flex-shrink-0 text-yellow-400" />
                <div>
                  <h5 className="text-sm font-bold uppercase">WhatsApp Admin</h5>
                  <p className="text-sm text-neutral-400">+62 812-3456-7890</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Mail className="h-6 w-6 flex-shrink-0 text-yellow-400" />
                <div>
                  <h5 className="text-sm font-bold uppercase">Email</h5>
                  <p className="text-sm text-neutral-400">halo@juarasepatu.com</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/30 p-6">
              <div>
                <p className="text-xs font-bold uppercase text-neutral-400">Jam Operasional</p>
                <p className="text-lg font-bold">Setiap Hari · 10.00 – 21.00 WIB</p>
              </div>
              <span className="h-3 w-3 animate-ping rounded-full bg-green-500" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}