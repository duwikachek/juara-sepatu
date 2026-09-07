import { ShieldCheck, Sparkles, MapPin, Phone, Mail } from "lucide-react";
import { HeroSection } from "@/components/hero-section";
import { ElasticGallery } from "@/components/ui/elastic-gallery";
import { CatalogSection } from "@/components/catalog-section";
import { ContactForm } from "@/components/contact-form";
import { SafeImage } from "@/components/ui/safe-image";
import {
  getGalleryItems,
  getProducts,
  getSettings,
} from "@/lib/data";

export default async function Home() {
  const [products, settings, gallery] = await Promise.all([
    getProducts(),
    getSettings(),
    getGalleryItems(),
  ]);

  const galleryItems = gallery.map((g, i) => ({
    id: String(i + 1).padStart(2, "0"),
    title: g.title,
    category: g.category,
    src: g.image_url,
    alt: g.title,
  }));

  return (
    <main>
      {/* ---------- HERO ---------- */}
      <HeroSection settings={settings} />

      {/* ---------- KOLEKSI SPESIAL ---------- */}
      <section
        id="koleksi"
        className="scroll-mt-24 border-t border-neutral-800 bg-black py-16"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-2 flex items-center gap-4">
            <div className="h-8 w-2 bg-yellow-400" />
            <h2 className="text-3xl font-black uppercase tracking-tight">
              Koleksi Spesial
            </h2>
          </div>
          <p className="text-neutral-400">
            Pilihan boots langka yang baru saja direstorasi.
          </p>
        </div>
        <ElasticGallery items={galleryItems} />
      </section>

      {/* ---------- KATALOG ---------- */}
      <section
        id="katalog"
        className="mx-auto max-w-7xl scroll-mt-24 border-t border-neutral-800 px-6 py-24"
      >
        <div className="mb-12">
          <div className="mb-2 flex items-center gap-4">
            <div className="h-8 w-2 bg-yellow-400" />
            <h2 className="text-3xl font-black uppercase tracking-tight">
              Katalog Sepatu
            </h2>
          </div>
          <p className="text-neutral-400">
            Cari berdasarkan nama, merek, atau ukuran kaki Anda.
          </p>
        </div>

        <CatalogSection products={products} />
      </section>

      {/* ---------- TENTANG ---------- */}
      <section
        id="tentang"
        className="scroll-mt-24 border-t border-neutral-800 bg-neutral-900/40 py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center gap-4">
                <div className="h-8 w-2 bg-yellow-400" />
                <h2 className="text-3xl font-black uppercase tracking-tight md:text-5xl">
                  {settings.about_title}
                </h2>
              </div>

              <p className="mb-6 text-lg leading-relaxed text-neutral-300">
                {settings.about_body_1}
              </p>
              <p className="mb-8 leading-relaxed text-neutral-400">
                {settings.about_body_2}
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                  <ShieldCheck className="mb-2 h-6 w-6 text-yellow-400" />
                  <h4 className="mb-1 text-sm font-bold uppercase">
                    {settings.feature_1_title}
                  </h4>
                  <p className="text-xs text-neutral-400">
                    {settings.feature_1_text}
                  </p>
                </div>
                <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                  <Sparkles className="mb-2 h-6 w-6 text-yellow-400" />
                  <h4 className="mb-1 text-sm font-bold uppercase">
                    {settings.feature_2_title}
                  </h4>
                  <p className="text-xs text-neutral-400">
                    {settings.feature_2_text}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative h-[450px] overflow-hidden rounded-2xl border border-neutral-800">
              <SafeImage
                src={settings.about_image}
                alt={settings.about_title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute inset-x-8 bottom-8">
                <p className="mb-1 text-sm font-bold uppercase tracking-widest text-yellow-400">
                  {settings.about_philosophy_label}
                </p>
                <h3 className="text-2xl font-black uppercase">
                  {settings.about_philosophy_text}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- KONTAK ---------- */}
      <section
        id="kontak"
        className="mx-auto max-w-7xl scroll-mt-24 border-t border-neutral-800 px-6 py-24"
      >
        <div className="mb-4 flex items-center gap-4">
          <div className="h-8 w-2 bg-yellow-400" />
          <h2 className="text-3xl font-black uppercase tracking-tight md:text-5xl">
            Hubungi Kami
          </h2>
        </div>
        <p className="mb-12 max-w-xl text-neutral-400">
          Ada pertanyaan seputar ukuran atau kondisi sepatu? Tim kami siap
          membantu.
        </p>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Form kontak — nomor WA dari database */}
          <ContactForm
            phone={settings.whatsapp}
            storeName={settings.store_name}
          />

          <div className="flex flex-col justify-between gap-6">
            <div className="space-y-6 rounded-xl border border-neutral-800 bg-neutral-900/50 p-8">
              <h3 className="text-xl font-bold uppercase text-yellow-400">
                Informasi Kontak
              </h3>

              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-6 w-6 flex-shrink-0 text-yellow-400" />
                <div>
                  <h5 className="text-sm font-bold uppercase">Store Studio</h5>
                  <p className="text-sm text-neutral-400">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="h-6 w-6 flex-shrink-0 text-yellow-400" />
                <div>
                  <h5 className="text-sm font-bold uppercase">WhatsApp Admin</h5>
                  <p className="text-sm text-neutral-400">
                    +{settings.whatsapp}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Mail className="h-6 w-6 flex-shrink-0 text-yellow-400" />
                <div>
                  <h5 className="text-sm font-bold uppercase">Email</h5>
                  <p className="text-sm text-neutral-400">{settings.email}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/30 p-6">
              <div>
                <p className="text-xs font-bold uppercase text-neutral-400">
                  Jam Operasional
                </p>
                <p className="text-lg font-bold">{settings.hours}</p>
              </div>
              <span className="h-3 w-3 animate-ping rounded-full bg-green-500" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}