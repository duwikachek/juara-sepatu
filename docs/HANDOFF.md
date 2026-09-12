# HANDOFF.md — Juara Sepatu

> Dokumen ini untuk developer / AI agent yang melanjutkan project.
> **Jangan membuat ulang dari nol.** Baca file ini dulu, lalu kerjakan tugas yang diminta.

---

## 1. Ringkasan project

| Item | Nilai |
|------|--------|
| Nama toko | **Juara Sepatu** |
| Jenis | Katalog e-commerce thrift boots (frontend + admin + Supabase) |
| Alur belanja | Form pesanan → database `orders` → admin proses → WA |
| Repo | https://github.com/duwikachek/juara-sepatu |
| Production | https://juara-sepatu.vercel.app |
| Local | http://localhost:3000 |
| Branch utama | `main` |

Bukan full payment gateway. Thrift: konfirmasi & bayar via WhatsApp.

---

## 2. Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | **Next.js App Router** (bukan Pages Router) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS** + CSS Variables untuk 4 Tema Warna |
| Typography | **Special Elite** (Font Mesin Tik Vintage via Google Fonts @import) |
| Branding | **Logo Vintage** (`/public/logo.png`) di Header & Footer |
| Backend/DB | **Supabase** (Auth, Postgres, Storage, RLS) |
| Hosting | **Vercel** |
| Icons | `lucide-react` (Ikon Instagram pakai SVG manual di site-footer.tsx) |

---

## 3. Menjalankan lokal (Windows)

```bash
cd path/to/juara-sepatu
npm install
# Jika PowerShell memblokir npm:
npm.cmd install
npm.cmd run dev