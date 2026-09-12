"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ImagePlus,
  LoaderCircle,
  Save,
  Trash2,
  X,
} from "lucide-react";
import type { Product } from "@/lib/products";
import {
  createProductAction,
  updateProductAction,
} from "@/app/admin/produk/actions";

type Mode = "create" | "edit";

// Fungsi Kompresi Foto Otomatis di Browser HP
async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/") || file.size < 300 * 1024) {
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

export function ProductForm({
  mode,
  product,
}: {
  mode: Mode;
  product?: Product;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [keepImages, setKeepImages] = useState<string[]>(
    product?.images ?? []
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const title = mode === "create" ? "Tambah Produk" : "Edit Produk";

  const initialHighlights = useMemo(
    () => (product?.highlights ?? []).join("\n"),
    [product]
  );

  const onFilesChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setCompressing(true);
    setError("");

    try {
      const fileList = Array.from(files);
      const compressedList = await Promise.all(
        fileList.map((f) => compressImage(f))
      );
      setSelectedFiles((prev) => [...prev, ...compressedList]);

      const urls = compressedList.map((f) => URL.createObjectURL(f));
      setPreviews((prev) => [...prev, ...urls]);
    } catch {
      setError("Gagal memproses gambar.");
    } finally {
      setCompressing(false);
    }
  };

  const removeKeepImage = (url: string) => {
    setKeepImages((prev) => prev.filter((u) => u !== url));
  };

  const clearNewImages = () => {
    setSelectedFiles([]);
    setPreviews([]);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    formData.delete("images");
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    formData.delete("keep_images");
    keepImages.forEach((url) => formData.append("keep_images", url));

    startTransition(async () => {
      if (mode === "create") {
        const result = await createProductAction(formData);
        if (!result.ok) {
          setError(result.message);
          return;
        }
        if (result.redirectUrl) {
          router.push(result.redirectUrl);
          router.refresh();
        }
        return;
      }

      formData.set("id", product?.id || "");
      const result = await updateProductAction(formData);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setSuccess(result.message);
      setSelectedFiles([]);
      setPreviews([]);
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/produk"
            className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-yellow-400"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tight">
            {title}
          </h1>
        </div>

        <button
          type="submit"
          disabled={pending || compressing}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-yellow-400 px-5 py-3 text-xs font-black uppercase tracking-widest text-black transition hover:bg-yellow-300 disabled:opacity-60"
        >
          {pending || compressing ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {compressing
            ? "Mengecilkan Foto..."
            : pending
            ? "Menyimpan..."
            : "Simpan Produk"}
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-yellow-400">
              Informasi Utama
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Nama Produk *
                </label>
                <input
                  name="name"
                  required
                  defaultValue={product?.name}
                  placeholder="Red Wing Iron Ranger 8111"
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Merek *
                </label>
                <input
                  name="brand"
                  required
                  defaultValue={product?.brand}
                  placeholder="Red Wing"
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Kategori *
                </label>
                <input
                  name="category"
                  required
                  defaultValue={product?.category}
                  placeholder="Work Boots"
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Harga (angka saja) *
                </label>
                <input
                  name="price"
                  required
                  defaultValue={product?.price}
                  placeholder="2500000"
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Grade
                </label>
                <input
                  name="grade"
                  defaultValue={product?.grade || "Grade A"}
                  placeholder="Grade A"
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Ukuran (pisah koma/spasi)
                </label>
                <input
                  name="sizes"
                  defaultValue={(product?.sizes || []).join(", ")}
                  placeholder="41, 42, 43"
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Urutan Tampil
                </label>
                <input
                  name="sort_order"
                  type="number"
                  defaultValue={product?.sort_order ?? 0}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm outline-none focus:border-yellow-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Kondisi
                </label>
                <input
                  name="condition"
                  defaultValue={product?.condition}
                  placeholder="9.5/10 — Like New"
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm outline-none focus:border-yellow-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={product?.description}
                  placeholder="Ceritakan kondisi, bahan, dan keunggulan sepatu..."
                  className="w-full resize-y rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm outline-none focus:border-yellow-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Poin Unggulan (1 baris = 1 poin)
                </label>
                <textarea
                  name="highlights"
                  rows={4}
                  defaultValue={initialHighlights}
                  placeholder={"Kulit original\nSol masih tebal\nSudah deep clean"}
                  className="w-full resize-y rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm outline-none focus:border-yellow-400"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-neutral-300 md:col-span-2">
                <input
                  type="checkbox"
                  name="sold"
                  defaultChecked={product?.sold}
                  className="h-4 w-4 accent-yellow-400"
                />
                Tandai sebagai <strong className="text-orange-300">Terjual</strong>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-yellow-400">
              Foto Produk
            </h2>

            {keepImages.length > 0 && (
              <div className="mb-4 grid grid-cols-2 gap-3">
                {keepImages.map((url) => (
                  <div
                    key={url}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950"
                  >
                    <Image
                      src={url}
                      alt="Foto produk"
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeKeepImage(url)}
                      className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-red-400 opacity-100 transition hover:bg-red-500 hover:text-white md:opacity-0 md:group-hover:opacity-100"
                      title="Hapus foto ini"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-700 bg-neutral-950/60 px-4 py-8 text-center transition hover:border-yellow-400/60">
              <ImagePlus className="h-7 w-7 text-yellow-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-300">
                Upload Foto Dari HP / Laptop
              </span>
              <span className="text-[11px] text-neutral-500">
                Otomatis dikompres & diperkecil
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onFilesChange(e.target.files)}
              />
            </label>

            {previews.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  Preview Foto Dikompres ({previews.length})
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {previews.map((url, i) => (
                    <div
                      key={i}
                      className="relative aspect-square overflow-hidden rounded-lg border border-yellow-500/30"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={clearNewImages}
                  className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-neutral-500 hover:text-yellow-400"
                >
                  <X className="h-3.5 w-3.5" /> Bersihkan preview
                </button>
              </div>
            )}
          </div>

          <p className="text-xs leading-relaxed text-neutral-500">
            Foto dari kamera HP kamu akan otomatis diperkecil ukurannya sehingga upload di HP sangat cepat dan tidak memicu error server.
          </p>
        </div>
      </div>
    </form>
  );
}