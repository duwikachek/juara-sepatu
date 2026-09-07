"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LoaderCircle,
  MessageCircle,
  Save,
  Trash2,
} from "lucide-react";
import { formatRupiah, waLink } from "@/lib/products";
import {
  deleteOrderAction,
  updateOrderStatusAction,
} from "@/app/admin/pesanan/actions";

export type AdminOrder = {
  id: string;
  order_number: string;
  product_id: string | null;
  product_slug: string;
  product_name: string;
  product_price: number;
  product_size: string;
  product_image: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_note: string;
  status: string;
  admin_note: string;
  created_at: string;
};

const STATUS_OPTIONS = [
  { value: "menunggu", label: "Menunggu" },
  { value: "dikonfirmasi", label: "Dikonfirmasi" },
  { value: "dibayar", label: "Dibayar" },
  { value: "dikirim", label: "Dikirim" },
  { value: "selesai", label: "Selesai" },
  { value: "batal", label: "Batal" },
] as const;

function statusClass(status: string) {
  switch (status) {
    case "menunggu":
      return "border-yellow-500/40 bg-yellow-500/10 text-yellow-400";
    case "dikonfirmasi":
      return "border-blue-500/40 bg-blue-500/10 text-blue-300";
    case "dibayar":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
    case "dikirim":
      return "border-purple-500/40 bg-purple-500/10 text-purple-300";
    case "selesai":
      return "border-green-500/40 bg-green-500/10 text-green-400";
    case "batal":
      return "border-red-500/40 bg-red-500/10 text-red-400";
    default:
      return "border-neutral-700 text-neutral-300";
  }
}

export function OrderCard({
  order,
  isOwner,
  storeName,
}: {
  order: AdminOrder;
  isOwner: boolean;
  storeName: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(order.status);
  const [adminNote, setAdminNote] = useState(order.admin_note || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const created = new Date(order.created_at).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const buyerWa = order.customer_phone.replace(/\D/g, "");
  const chatText = `Halo ${order.customer_name}, ini admin ${storeName}.\n\nTerkait pesanan *${order.order_number}*\nProduk: ${order.product_name}\nUkuran: ${order.product_size}\nHarga: ${formatRupiah(order.product_price)}\n\nKami ingin konfirmasi ketersediaan dan ongkirnya.`;

  const onSave = () => {
    setMessage("");
    setError("");
    const fd = new FormData();
    fd.set("id", order.id);
    fd.set("status", status);
    fd.set("admin_note", adminNote);

    startTransition(async () => {
      const result = await updateOrderStatusAction(fd);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setMessage(result.message);
      router.refresh();
    });
  };

  const onDelete = () => {
    if (!isOwner) return;
    const ok = window.confirm(
      `Hapus pesanan ${order.order_number}? Tindakan ini permanen.`
    );
    if (!ok) return;

    const fd = new FormData();
    fd.set("id", order.id);

    startTransition(async () => {
      const result = await deleteOrderAction(fd);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.refresh();
    });
  };

  return (
    <article className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 md:p-5">
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Foto produk */}
        <div className="relative h-28 w-full flex-shrink-0 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 sm:h-32 sm:w-32">
          {order.product_image ? (
            <Image
              src={order.product_image}
              alt={order.product_name}
              fill
              sizes="128px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-neutral-600">
              No img
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                {order.order_number} · {created}
              </p>
              <h2 className="mt-1 text-lg font-black uppercase leading-tight text-white">
                {order.product_name}
              </h2>
              <p className="mt-1 text-sm text-neutral-400">
                Ukuran {order.product_size || "-"} ·{" "}
                <span className="font-bold text-yellow-400">
                  {formatRupiah(order.product_price)}
                </span>
              </p>
              {order.product_slug && (
                <Link
                  href={`/produk/${order.product_slug}`}
                  target="_blank"
                  className="mt-1 inline-block text-[11px] font-bold uppercase tracking-wider text-neutral-500 hover:text-yellow-400"
                >
                  Lihat produk ↗
                </Link>
              )}
            </div>

            <span
              className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusClass(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 rounded-lg border border-neutral-800 bg-neutral-950/50 p-3 text-sm md:grid-cols-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                Pembeli
              </p>
              <p className="font-bold text-white">{order.customer_name}</p>
              <p className="text-neutral-400">+{buyerWa}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                Alamat
              </p>
              <p className="text-neutral-300">{order.customer_address}</p>
            </div>
            {order.customer_note && (
              <div className="md:col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  Catatan Pembeli
                </p>
                <p className="text-neutral-300">{order.customer_note}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[180px_1fr_auto]">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm outline-none focus:border-yellow-400"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                Catatan Admin
              </label>
              <input
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Contoh: sudah chat, tunggu TF..."
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm outline-none focus:border-yellow-400"
              />
            </div>

            <div className="flex flex-wrap items-end gap-2">
              <button
                type="button"
                onClick={onSave}
                disabled={pending}
                className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-400 px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-black transition hover:bg-yellow-300 disabled:opacity-50"
              >
                {pending ? (
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                Simpan
              </button>

              <a
                href={waLink(chatText, buyerWa)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-green-500/40 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-green-400 transition hover:bg-green-500/10"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WA Pembeli
              </a>

              {isOwner && (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={pending}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus
                </button>
              )}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          {message && (
            <p className="text-sm text-green-400">{message}</p>
          )}
        </div>
      </div>
    </article>
  );
}