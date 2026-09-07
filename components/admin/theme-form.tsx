"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, LoaderCircle, Palette } from "lucide-react";
import { saveThemeAction } from "@/app/admin/tema/actions";

const THEMES = [
  {
    id: "kuning-klasik",
    name: "Kuning Klasik",
    desc: "Aksen kuning tegas. Cocok untuk thrift urban & boots.",
    swatch: "#facc15",
  },
  {
    id: "amber-vintage",
    name: "Amber Vintage",
    desc: "Oranye bata hangat. Nuansa leather & heritage.",
    swatch: "#f59e0b",
  },
  {
    id: "militer",
    name: "Militer",
    desc: "Hijau zaitun. Kesan workwear & outdoor.",
    swatch: "#a3b18a",
  },
  {
    id: "steel-blue",
    name: "Steel Blue",
    desc: "Biru baja. Tampil minimalis & modern.",
    swatch: "#38bdf8",
  },
] as const;

export function ThemeForm({ currentTheme }: { currentTheme: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState(currentTheme || "kuning-klasik");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSave = () => {
    setMessage("");
    setError("");
    const fd = new FormData();
    fd.set("theme", selected);

    startTransition(async () => {
      const result = await saveThemeAction(fd);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setMessage(result.message);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center gap-2 text-brand">
          <Palette className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-widest">
            Tampilan
          </span>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight">
          Pilih Tema Warna
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-400">
          Pilih salah satu tema. Aksen tombol, highlight, dan badge utama akan
          mengikuti tema yang aktif.
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {THEMES.map((theme) => {
          const active = selected === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => setSelected(theme.id)}
              className={`rounded-2xl border p-5 text-left transition ${
                active
                  ? "border-brand bg-brand-soft shadow-brand"
                  : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-600"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div
                  className="h-10 w-10 rounded-full border border-white/10 shadow-inner"
                  style={{ backgroundColor: theme.swatch }}
                />
                {active && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-black">
                    <Check className="h-3 w-3" /> Dipilih
                  </span>
                )}
              </div>
              <h2 className="text-lg font-black uppercase tracking-tight">
                {theme.name}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                {theme.desc}
              </p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
                ID: {theme.id}
              </p>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-xs font-black uppercase tracking-widest text-black shadow-brand transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <Palette className="h-4 w-4" />
        )}
        {pending ? "Menerapkan..." : "Terapkan Tema"}
      </button>
    </div>
  );
}