"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ImagePlus,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import type { GalleryItem } from "@/lib/products";
import {
  createGalleryItemAction,
  deleteGalleryItemAction,
  toggleGalleryActiveAction,
  updateGalleryItemAction,
} from "@/app/admin/galeri/actions";

export function GalleryManager({ items }: { items: GalleryItem[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const run = (fn: () => Promise<{ ok: boolean; message: string }>) => {
    setMessage("");
    setError("");
    startTransition(async () => {
      const result = await fn();
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setMessage(result.message);
      router.refresh();
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">
          Galeri Koleksi Spesial
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Atur foto, judul, kategori, dan urutan yang tampil di beranda.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {message}
        </div>
      )}

      {/* Form tambah */}
      <form
        className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          run(async () => {
            const result = await createGalleryItemAction(fd);
            if (result.ok) e.currentTarget.reset();
            return result;
          });
        }}
      >
        <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-yellow-400">
          <Plus className="h-4 w-4" /> Tambah Item Galeri
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Judul *
            </label>
            <input
              name="title"
              required
              placeholder="Iron Ranger"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Kategori
            </label>
            <input
              name="category"
              placeholder="Boots"
              defaultValue="Boots"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Urutan
            </label>
            <input
              name="sort_order"
              type="number"
              defaultValue={items.length + 1}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm outline-none focus:border-yellow-400"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 pb-3 text-sm text-neutral-300">
              <input
                type="checkbox"
                name="active"
                defaultChecked
                className="h-4 w-4 accent-yellow-400"
              />
              Aktif di beranda
            </label>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Upload Foto
            </label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-700 px-3 py-4 text-xs font-bold uppercase tracking-widest text-neutral-300 transition hover:border-yellow-400 hover:text-yellow-400">
              <ImagePlus className="h-4 w-4" />
              Pilih Gambar
              <input
                type="file"
                name="image_file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Atau URL Gambar
            </label>
            <input
              name="image_url"
              placeholder="https://..."
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm outline-none focus:border-yellow-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-5 py-3 text-xs font-black uppercase tracking-widest text-black transition hover:bg-yellow-300 disabled:opacity-60"
        >
          {pending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Tambah
        </button>
      </form>

      {/* Daftar item */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          Semua Item ({items.length})
        </h2>

        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-800 px-4 py-10 text-center text-sm text-neutral-500">
            Belum ada item galeri.
          </p>
        ) : (
          items.map((item) => (
            <form
              key={item.id}
              className="grid grid-cols-1 gap-4 rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 lg:grid-cols-[140px_1fr_auto]"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                fd.set("id", item.id || "");
                run(() => updateGalleryItemAction(fd));
              }}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    sizes="140px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-neutral-600">
                    No image
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <input type="hidden" name="image_url" value={item.image_url} />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                      Judul
                    </label>
                    <input
                      name="title"
                      defaultValue={item.title}
                      required
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                      Kategori
                    </label>
                    <input
                      name="category"
                      defaultValue={item.category}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                      Urutan
                    </label>
                    <input
                      name="sort_order"
                      type="number"
                      defaultValue={item.sort_order}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                      Ganti Foto
                    </label>
                    <input
                      type="file"
                      name="image_file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      className="w-full text-xs text-neutral-400 file:mr-3 file:rounded file:border-0 file:bg-neutral-800 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-neutral-300">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={item.active !== false}
                    className="h-4 w-4 accent-yellow-400"
                  />
                  Tampilkan di beranda
                </label>
              </div>

              <div className="flex flex-row flex-wrap items-start gap-2 lg:flex-col">
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-yellow-400/50 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-yellow-400 transition hover:bg-yellow-400 hover:text-black disabled:opacity-50"
                >
                  {pending ? (
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  Simpan
                </button>

                <button
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    const fd = new FormData();
                    fd.set("id", item.id || "");
                    fd.set("active", String(item.active !== false));
                    run(() => toggleGalleryActiveAction(fd));
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-300 transition hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-50"
                >
                  {item.active !== false ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" /> Nonaktif
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" /> Aktifkan
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    const ok = window.confirm(
                      `Hapus "${item.title}" dari galeri?`
                    );
                    if (!ok) return;
                    const fd = new FormData();
                    fd.set("id", item.id || "");
                    run(() => deleteGalleryItemAction(fd));
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus
                </button>
              </div>
            </form>
          ))
        )}
      </div>
    </div>
  );
}