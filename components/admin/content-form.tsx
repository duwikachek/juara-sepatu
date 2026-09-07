"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ImagePlus,
  LoaderCircle,
  Save,
  Store,
} from "lucide-react";
import type { SiteSettings } from "@/lib/products";
import { saveSiteContentAction } from "@/app/admin/konten/actions";

function Field({
  label,
  name,
  defaultValue,
  textarea = false,
  rows = 3,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  textarea?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  const className =
    "w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm outline-none focus:border-yellow-400";

  return (
    <div>
      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
        {label}
      </label>
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
}: {
  label: string;
  name: string;
  currentUrl: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
        {label}
      </p>

      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
        <Image
          src={preview || currentUrl}
          alt={label}
          fill
          sizes="400px"
          className="object-cover"
        />
      </div>

      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-700 px-3 py-3 text-xs font-bold uppercase tracking-widest text-neutral-300 transition hover:border-yellow-400 hover:text-yellow-400">
        <ImagePlus className="h-4 w-4" />
        Ganti Foto
        <input
          type="file"
          name={name}
          accept="image/jpeg,image/png,image/webp,image/jpg"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setPreview(URL.createObjectURL(file));
          }}
        />
      </label>
    </div>
  );
}

export function ContentForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await saveSiteContentAction(formData);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setSuccess(result.message);
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-yellow-400">
            <Store className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Konten Website
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight">
            Edit Teks & Foto
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Perubahan langsung tampil di beranda setelah disimpan.
          </p>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-yellow-400 px-5 py-3 text-xs font-black uppercase tracking-widest text-black transition hover:bg-yellow-300 disabled:opacity-60"
        >
          {pending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {success}
        </div>
      )}

      {/* Identitas toko */}
      <section className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-yellow-400">
          Identitas Toko
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label="Nama Toko"
            name="store_name"
            defaultValue={settings.store_name}
          />
          <Field
            label="Tagline"
            name="tagline"
            defaultValue={settings.tagline}
          />
        </div>
      </section>

      {/* Hero */}
      <section className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-yellow-400">
          Hero (Layar Utama)
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
                label="Judul Baris 2 (warna aksen)"
                name="hero_title_line2"
                defaultValue={settings.hero_title_line2}
              />
            </div>
            <Field
              label="Deskripsi Hero"
              name="hero_description"
              defaultValue={settings.hero_description}
              textarea
              rows={4}
            />
          </div>
          <ImagePicker
            label="Foto Latar Hero"
            name="hero_image_file"
            currentUrl={settings.hero_image}
          />
        </div>
      </section>

      {/* Tentang */}
      <section className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-yellow-400">
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
              rows={4}
            />
            <Field
              label="Paragraf 2"
              name="about_body_2"
              defaultValue={settings.about_body_2}
              textarea
              rows={4}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          />
        </div>
      </section>

      {/* Kontak */}
      <section className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-yellow-400">
          Kontak & Footer
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label="Alamat"
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
            label="WhatsApp (62... tanpa +)"
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
              rows={3}
            />
          </div>
        </div>
        {/* theme disimpan apa adanya dulu; UI pilih tema di Tahap E */}
        <input type="hidden" name="theme" value={settings.theme || "kuning-klasik"} />
      </section>
    </form>
  );
}