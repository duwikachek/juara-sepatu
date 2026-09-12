"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import {
  FALLBACK_SETTINGS,
  FALLBACK_STORE_NAME,
  waLink,
} from "@/lib/products";

export function ContactForm({
  phone = FALLBACK_SETTINGS.whatsapp,
  storeName = FALLBACK_STORE_NAME,
}: {
  phone?: string;
  storeName?: string;
}) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nama: "", telp: "", pesan: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const text = `Halo ${storeName || FALLBACK_STORE_NAME}!\n\n*Nama:* ${form.nama}\n*No. HP:* ${form.telp}\n\n${form.pesan}`;

    window.open(
      waLink(text, phone || FALLBACK_SETTINGS.whatsapp),
      "_blank"
    );

    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ nama: "", telp: "", pesan: "" });
  };

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-8">
      <h3 className="mb-6 text-xl font-bold uppercase text-brand">
        Kirim Pesan
      </h3>

      {sent && (
        <div className="mb-5 flex items-center gap-2 rounded border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          <CheckCircle2 className="h-4 w-4" />
          Pesan dialihkan ke WhatsApp kami.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            Nama Lengkap
          </label>
          <input
            required
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            placeholder="Masukkan nama kamu"
            className="w-full rounded border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm outline-none focus:border-brand"
          />
        </div>

        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            Nomor WhatsApp
          </label>
          <input
            required
            type="tel"
            value={form.telp}
            onChange={(e) => setForm({ ...form, telp: e.target.value })}
            placeholder="0812xxxxxxx"
            className="w-full rounded border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm outline-none focus:border-brand"
          />
        </div>

        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            Pesan
          </label>
          <textarea
            required
            rows={4}
            value={form.pesan}
            onChange={(e) => setForm({ ...form, pesan: e.target.value })}
            placeholder="Tanyakan seputar produk atau ukuran..."
            className="w-full resize-none rounded border border-neutral-800 bg-neutral-950 px-4 py-3 text-sm outline-none focus:border-brand"
          />
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 bg-brand py-4 text-sm font-black uppercase tracking-widest text-black transition hover:bg-brand-hover"
        >
          Kirim Pesan <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}