"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ExternalLink,
  ImagePlus,
  Info,
  Layers,
  LoaderCircle,
  Save,
  Store,
  XCircle,
} from "lucide-react";
import type { SiteSettings } from "@/lib/products";
import { saveSiteContentAction } from "@/app/admin/konten/actions";

// Kompresi foto otomatis di browser
async function compressImage(file: File, maxWidth = 1400, quality = 0.82): Promise<File> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/") || file.size < 250 * 1024) {
      resolve(file);
      return;
    }

    const img = document.createElement("img");
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxWidth) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxWidth) / height);
          height = maxWidth;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const compressedFile = new File(
            [blob],
            file.name.replace(/\.[^/.]+$/, "") + ".jpg",
            {
              type: "image/jpeg",
              lastModified: Date.now(),
            }
          );
          resolve(compressedFile);
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => resolve(file);
    img.src = url;
  });
}

function Field({
  label,
  name,
  defaultValue,
  textarea = false,
  rows = 3,
  placeholder,
  helper,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
  helper?: string;
}) {
  const className =
    "w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 outline-none transition focus:border-brand focus:ring-1 focus:ring-brand";

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">
          {label}
        </label>
        {helper && (
          <span className="text-[10px] text-neutral-500">{helper}</span>
        )}
      </div>
      {textarea ? (
        <textarea
          name={name}
          rows={rows}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={className + " resize-y"}
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={className}
        />
      )}
    </div>
  );
}

function ImagePicker({
  label,
  name,
  currentUrl,
  onFileChange,
}: {
  label: string;
  name: string;
  currentUrl: string;
  onFileChange: (file: File | null) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);

  return (
    <div className="space-y-2.5">
      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">
        {label}
      </p>

      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
        {preview || currentUrl ? (
          <Image
            src={preview || currentUrl}
            alt={label}
            fill
            unoptimized
            sizes="400px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-neutral-600">
            Belum ada foto
          </div>
        )}
        {compressing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-xs font-bold text-brand">
            <LoaderCircle className="mr-1.5 h-4 w-4 animate-spin" />
            Mengoptimasi foto...
          </div>
        )}
      </div>

      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-700 bg-neutral-900/40 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-300 transition hover:border-brand hover:text-brand">
        <ImagePlus className="h-4 w-4 flex-shrink-0" />
        <span>Ganti Foto</span>
        <input
          type="file"
          name={name}
          accept="image/jpeg,image/png,image/webp,image/jpg"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setCompressing(true);
            try {
              const compressed = await compressImage(file);
              setPreview(URL.createObjectURL(compressed));
              onFileChange(compressed);
            } finally {
              setCompressing(false);
            }
          }}
        />
      </label>
    </div>
  );
}

type TabKey = "all" | "hero" | "about" | "contact" | "store";

const TABS: { id: TabKey; label: string }[] = [
  { id: "all", label: "Semua Bagian" },
  { id: "hero", label: "Hero & Banner" },
  { id: "about", label: "Tentang Kami" },
  { id: "contact", label: "Kontak & Alamat" },
  { id: "store", label: "Identitas Toko" },
];

export function ContentForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [aboutFile, setAboutFile] = useState<File | null>(null);

  // Shortcut keyboard Ctrl+S / Cmd+S untuk simpan cepat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    if (heroFile) {
      formData.set("hero_image_file", heroFile);
    }
    if (aboutFile) {
      formData.set("about_image_file", aboutFile);
    }

    startTransition(async () => {
      const result = await saveSiteContentAction(formData);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setSuccess(result.message);
      router.refresh();
      // Auto hide success badge after 4 seconds
      setTimeout(() => setSuccess(""), 4000);
    });
  };

  const showSection = (tab: TabKey) => activeTab === "all" || activeTab === tab;

  return (
    <form ref={formRef} onSubmit={onSubmit} className="relative pb-24">
      {/* Header Kerja */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-brand">
            <Store className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Lembar Kerja Admin
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            Edit Teks & Konten Web
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Fokus edit teks dan foto website. Perubahan langsung aktif di beranda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-xs font-black uppercase tracking-wider text-black transition hover:opacity-90 disabled:opacity-50"
          >
            {pending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{pending ? "Menyimpan..." : "Simpan (Ctrl+S)"}</span>
          </button>
        </div>
      </div>

      {/* Filter Tab Bagian untuk Memudahkan Fokus Edit */}
      <div className="mb-6 flex overflow-x-auto gap-1.5 border-b border-neutral-800 pb-3 scrollbar-none">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                active
                  ? "bg-neutral-800 text-brand border border-neutral-700"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Pesan Notifikasi */}
      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <XCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Identitas Toko */}
        {showSection("store") && (
          <section className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 sm:p-5">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-brand">
              Identitas Toko
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="Nama Toko"
                name="store_name"
                defaultValue={settings.store_name}
              />
              <Field
                label="Tagline Toko"
                name="tagline"
                defaultValue={settings.tagline}
              />
            </div>
          </section>
        )}

        {/* Hero (Layar Utama) */}
        {showSection("hero") && (
          <section className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 sm:p-5">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-brand">
              Hero (Layar Utama Beranda)
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field
                    label="Judul Baris 1"
                    name="hero_title_line1"
                    defaultValue={settings.hero_title_line1}
                  />
                  <Field
                    label="Judul Baris 2 (Warna Aksen)"
                    name="hero_title_line2"
                    defaultValue={settings.hero_title_line2}
                  />
                </div>

                <Field
                  label="Deskripsi Hero"
                  name="hero_description"
                  defaultValue={settings.hero_description}
                  textarea
                  rows={3}
                />

                {/* Statistik & Ornamen Hero */}
                <div className="border-t border-neutral-800/80 pt-4">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-neutral-300">
                    Statistik & Kartu Hero
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field
                      label="Statistik 1 (Nilai)"
                      name="hero_stat_1_value"
                      defaultValue={settings.hero_stat_1_value || "100%"}
                      placeholder="100%"
                    />
                    <Field
                      label="Statistik 1 (Label)"
                      name="hero_stat_1_label"
                      defaultValue={settings.hero_stat_1_label || "Thrift Terkurasi"}
                      placeholder="Thrift Terkurasi"
                    />
                    <Field
                      label="Statistik 2 (Nilai)"
                      name="hero_stat_2_value"
                      defaultValue={settings.hero_stat_2_value || "98%"}
                      placeholder="98%"
                    />
                    <Field
                      label="Statistik 2 (Label)"
                      name="hero_stat_2_label"
                      defaultValue={settings.hero_stat_2_label || "Kepuasan Pembeli"}
                      placeholder="Kepuasan Pembeli"
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <Field
                        label="Teks Kartu Kanan Bawah"
                        name="hero_badge_text"
                        defaultValue={
                          settings.hero_badge_text ||
                          "Kurasi boots kulit second: Red Wing, Dr. Martens, Timberland, Clarks siap pakai."
                        }
                      />
                    </div>
                    <div>
                      <Field
                        label="Tag Badge Kartu"
                        name="hero_badge_tag"
                        defaultValue={settings.hero_badge_tag || "ORIGINAL GRADE"}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <ImagePicker
                label="Foto Latar Hero"
                name="hero_image_file"
                currentUrl={settings.hero_image}
                onFileChange={setHeroFile}
              />
            </div>
          </section>
        )}

        {/* Tentang Kami */}
        {showSection("about") && (
          <section className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 sm:p-5">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-brand">
              Tentang Kami
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                <Field
                  label="Judul Section"
                  name="about_title"
                  defaultValue={settings.about_title}
                />
                <Field
                  label="Paragraf 1"
                  name="about_body_1"
                  defaultValue={settings.about_body_1}
                  textarea
                  rows={3}
                />
                <Field
                  label="Paragraf 2"
                  name="about_body_2"
                  defaultValue={settings.about_body_2}
                  textarea
                  rows={3}
                />
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Field
                    label="Label Filosofi"
                    name="about_philosophy_label"
                    defaultValue={settings.about_philosophy_label}
                  />
                  <Field
                    label="Teks Filosofi"
                    name="about_philosophy_text"
                    defaultValue={settings.about_philosophy_text}
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Field
                    label="Fitur 1 — Judul"
                    name="feature_1_title"
                    defaultValue={settings.feature_1_title}
                  />
                  <Field
                    label="Fitur 1 — Teks"
                    name="feature_1_text"
                    defaultValue={settings.feature_1_text}
                  />
                  <Field
                    label="Fitur 2 — Judul"
                    name="feature_2_title"
                    defaultValue={settings.feature_2_title}
                  />
                  <Field
                    label="Fitur 2 — Teks"
                    name="feature_2_text"
                    defaultValue={settings.feature_2_text}
                  />
                </div>
              </div>

              <ImagePicker
                label="Foto Tentang Kami"
                name="about_image_file"
                currentUrl={settings.about_image}
                onFileChange={setAboutFile}
              />
            </div>
          </section>
        )}

        {/* Kontak & Footer */}
        {showSection("contact") && (
          <section className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 sm:p-5">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-brand">
              Kontak & Footer
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="Alamat Studio"
                name="address"
                defaultValue={settings.address}
                textarea
                rows={2}
              />
              <Field
                label="Jam Operasional"
                name="hours"
                defaultValue={settings.hours}
              />
              <Field
                label="WhatsApp Admin (628... tanpa +)"
                name="whatsapp"
                defaultValue={settings.whatsapp}
                placeholder="6281234567890"
              />
              <Field
                label="Email"
                name="email"
                defaultValue={settings.email}
              />
              <div className="md:col-span-2">
                <Field
                  label="Teks Footer"
                  name="footer_text"
                  defaultValue={settings.footer_text}
                  textarea
                  rows={2}
                />
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Hidden Theme agar tidak tertimpa saat simpan konten */}
      <input
        type="hidden"
        name="theme"
        value={settings.theme || "kuning-klasik"}
      />

      {/* Sticky Bottom Bar untuk Kemudahan Simpan Kapan Saja */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-800 bg-neutral-950/95 backdrop-blur-md px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {pending ? (
              <span className="flex items-center gap-1.5 text-xs text-brand font-medium">
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                <span className="truncate">Menyimpan perubahan web...</span>
              </span>
            ) : success ? (
              <span className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">Tersimpan ke website!</span>
              </span>
            ) : (
              <span className="hidden sm:inline-block text-xs text-neutral-400">
                Tekan <kbd className="rounded border border-neutral-700 bg-neutral-900 px-1.5 py-0.5 text-[10px] font-mono">Ctrl+S</kbd> untuk menyimpan cepat
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2 text-xs font-black uppercase tracking-wider text-black transition hover:opacity-90 disabled:opacity-50"
            >
              {pending ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{pending ? "Menyimpan..." : "Simpan Perubahan"}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}