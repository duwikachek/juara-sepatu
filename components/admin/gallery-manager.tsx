"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Check,
  Eye,
  EyeOff,
  ImagePlus,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
  X,
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createPreview, setCreatePreview] = useState<string | null>(null);
  const [createFileName, setCreateFileName] = useState<string | null>(null);

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

  const handleCreateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (createPreview) URL.revokeObjectURL(createPreview);
    setCreatePreview(URL.createObjectURL(file));
    setCreateFileName(file.name);
  };

  const handleClearCreateFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (createPreview) {
      URL.revokeObjectURL(createPreview);
    }
    setCreatePreview(null);
    setCreateFileName(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">
          Galeri Referensi
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
          const form = e.currentTarget;
          const fd = new FormData(form);
          run(async () => {
            const result = await createGalleryItemAction(fd);
            if (result.ok) {
              form.reset();
              handleClearCreateFile();
            }
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

            {/* Input file yang selalu ada di dalam form */}
            <input
              ref={fileInputRef}
              type="file"
              name="image_file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
              onChange={handleCreateFileChange}
            />

            {createPreview ? (
              <div className="flex items-center gap-3 rounded-lg border border-yellow-400/40 bg-neutral-950/80 p-2.5">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-neutral-800 bg-neutral-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={createPreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-neutral-200">
                    {createFileName}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-green-400">
                    <Check className="h-3 w-3" /> Siap di-upload
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-1 text-[11px] font-bold text-yellow-400 underline hover:text-yellow-300"
                  >
                    Ganti gambar
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleClearCreateFile}
                  title="Hapus gambar terpilih"
                  className="rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-red-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-neutral-700 px-3 py-3.5 text-xs font-bold uppercase tracking-widest text-neutral-300 transition hover:border-yellow-400 hover:text-yellow-400"
              >
                <div className="flex items-center gap-2">
                  <ImagePlus className="h-4 w-4" />
                  Pilih Gambar
                </div>
                <span className="text-[10px] font-normal normal-case tracking-normal text-neutral-500">
                  JPG, PNG, atau WEBP (Maks. 5MB)
                </span>
              </button>
            )}
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
            <GalleryItemRow
              key={item.id}
              item={item}
              pending={pending}
              run={run}
            />
          ))
        )}
      </div>
    </div>
  );
}

function GalleryItemRow({
  item,
  pending,
  run,
}: {
  item: GalleryItem;
  pending: boolean;
  run: (fn: () => Promise<{ ok: boolean; message: string }>) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rowPreview, setRowPreview] = useState<string | null>(null);

  const handleRowFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (rowPreview) URL.revokeObjectURL(rowPreview);
    setRowPreview(URL.createObjectURL(file));
  };

  const handleCancelRowFile = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (rowPreview) URL.revokeObjectURL(rowPreview);
    setRowPreview(null);
  };

  return (
    <form
      className="grid grid-cols-1 gap-4 rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 lg:grid-cols-[140px_1fr_auto]"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        fd.set("id", item.id || "");
        run(async () => {
          const res = await updateGalleryItemAction(fd);
          if (res.ok) {
            handleCancelRowFile();
          }
          return res;
        });
      }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950">
        {rowPreview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={rowPreview}
              alt={item.title}
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-1.5 left-1.5 rounded bg-yellow-400 px-1.5 py-0.5 text-[9px] font-black uppercase text-black">
              Foto Baru
            </span>
          </>
        ) : item.image_url ? (
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
            <div className="flex items-center justify-between">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                Ganti Foto
              </label>
              {rowPreview && (
                <button
                  type="button"
                  onClick={handleCancelRowFile}
                  className="mb-1 text-[10px] font-bold text-red-400 underline hover:text-red-300"
                >
                  Batal ganti
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              name="image_file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleRowFileChange}
              className="w-full text-xs text-neutral-400 file:mr-3 file:rounded file:border-0 file:bg-neutral-800 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white hover:file:bg-neutral-700"
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
  );
}