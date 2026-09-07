import Link from "next/link";
import { ClipboardList, Search } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { FALLBACK_SETTINGS } from "@/lib/products";
import {
  OrderCard,
  type AdminOrder,
} from "@/components/admin/order-card";

type SearchParams = Promise<{
  q?: string;
  status?: string;
}>;

const STATUS_FILTERS = [
  { value: "all", label: "Semua" },
  { value: "menunggu", label: "Menunggu" },
  { value: "dikonfirmasi", label: "Dikonfirmasi" },
  { value: "dibayar", label: "Dibayar" },
  { value: "dikirim", label: "Dikirim" },
  { value: "selesai", label: "Selesai" },
  { value: "batal", label: "Batal" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { supabase, isOwner } = await requireAdmin();
  const params = await searchParams;

  const q = (params.q || "").trim();
  const status = params.status || "all";

  // Ambil nama toko untuk template WA
  const { data: settingsRow } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "general")
    .maybeSingle();

  const storeName =
    ((settingsRow?.value as { store_name?: string } | null)?.store_name) ||
    FALLBACK_SETTINGS.store_name;

  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  if (q) {
    query = query.or(
      `order_number.ilike.%${q}%,customer_name.ilike.%${q}%,customer_phone.ilike.%${q}%,product_name.ilike.%${q}%`
    );
  }

  const { data, error } = await query;
  const orders = (data as AdminOrder[]) ?? [];

  // Hitung ringkas dari hasil filter saat ini
  const countBy = (s: string) => orders.filter((o) => o.status === s).length;

  return (
    <main className="space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-yellow-400">
          <ClipboardList className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-widest">
            Manajemen Pesanan
          </span>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight">
          Daftar Pesanan
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Pesanan dari form website. Ubah status dan hubungi pembeli via WA.
        </p>
      </div>

      {/* Ringkasan cepat */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            Ditampilkan
          </p>
          <p className="mt-1 text-2xl font-black text-white">{orders.length}</p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            Menunggu
          </p>
          <p className="mt-1 text-2xl font-black text-yellow-400">
            {countBy("menunggu")}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            Proses
          </p>
          <p className="mt-1 text-2xl font-black text-blue-300">
            {countBy("dikonfirmasi") +
              countBy("dibayar") +
              countBy("dikirim")}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            Selesai
          </p>
          <p className="mt-1 text-2xl font-black text-green-400">
            {countBy("selesai")}
          </p>
        </div>
      </div>

      {/* Filter */}
      <form className="grid grid-cols-1 gap-3 rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 md:grid-cols-[1fr_200px_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Cari no. pesanan, nama, WA, produk..."
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-yellow-400"
          />
        </div>

        <select
          name="status"
          defaultValue={status}
          className="rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm outline-none focus:border-yellow-400"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="rounded-lg border border-yellow-400/50 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-yellow-400 transition hover:bg-yellow-400 hover:text-black"
        >
          Terapkan
        </button>
      </form>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          Gagal memuat pesanan: {error.message}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-800 px-4 py-16 text-center">
          <p className="text-neutral-400">Belum ada pesanan untuk filter ini.</p>
          <Link
            href="/admin/pesanan"
            className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-yellow-400 hover:underline"
          >
            Reset filter
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isOwner={isOwner}
              storeName={storeName}
            />
          ))}
        </div>
      )}
    </main>
  );
}