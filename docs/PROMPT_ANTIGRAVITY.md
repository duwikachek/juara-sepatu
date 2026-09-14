# PANDUAN PROMPT UNTUK ANTIGRAVITY IDE (JUARA SEPATU)

> File ini berisi kumpulan template prompt siap pakai ketika kamu ingin melanjutkan project **Juara Sepatu** menggunakan Antigravity IDE atau AI agent lainnya.

---

## 1. PROMPT VERSI PENDEK (Rekomendasi Utama)

*Tempelkan teks di bawah ini ke chat Antigravity IDE pada pesan pertama:*

```text
@docs/HANDOFF.md

Project existing: Juara Sepatu (Katalog Boots Thrift) — jangan buat ulang dari nol.

Repo: https://github.com/duwikachek/juara-sepatu
Stack: Next.js App Router + TypeScript + Tailwind + Supabase + Vercel
Live: https://juara-sepatu.vercel.app
Lokal: npm.cmd run dev → http://localhost:3000

Aturan Kerja:
1. Baca docs/HANDOFF.md dan struktur repo dulu sebelum mengubah kode.
2. lib/products.ts = client-safe | lib/data.ts = server/static only.
3. Jangan import server Supabase ke file "use client".
4. Untuk UI/Komponen besar: kirim KODE FULL FILE (bukan potongan).
5. Jangan commit .env.local.
6. Jangan hapus fitur yang sudah berjalan tanpa diminta.
7. Setelah mengubah kode: jelaskan file apa saja yang diubah + cara tes di localhost.

Tugas saya sekarang:
[TULISKAN TUGAS / FITUR BARU KAMU DI SINI]

PROMPT VERSI LENGKAP
@docs/HANDOFF.md
@package.json
@app/layout.tsx

Saya melanjutkan project EXISTING. Jangan scaffold project baru. Jangan rewrite dari nol.

## Identitas Project
- Nama: Juara Sepatu (Katalog Boots Thrift)
- Repo: https://github.com/duwikachek/juara-sepatu
- Branch: main
- Live: https://juara-sepatu.vercel.app
- Lokal: folder C:\Users\birud\juara-sepatu
- Jalankan: npm.cmd install && npm.cmd run dev
- Env lokal: .env.local (NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY)
- Env production: diisi di Vercel → Environment Variables

## Tech Stack
Next.js App Router, TypeScript, Tailwind CSS, Supabase (Auth/DB/Storage/RLS), Vercel

## Arsitektur Singkat
- Publik: Beranda (/), Detail Produk (/produk/[slug]), Form Order (/pesan/[slug])
- Admin: Login (/login), Dashboard (/admin), CRUD Produk (/admin/produk), Pesanan (/admin/pesanan), Konten (/admin/konten), Galeri (/admin/galeri), Tema (/admin/tema)
- Data: Supabase tables (products, gallery_items, site_settings, orders, profiles)
- Storage Buckets: product-images, site-assets
- lib/products.ts = types, formatRupiah, waLink, FALLBACK_* (CLIENT-SAFE)
- lib/data.ts = getProducts/getSettings/... (SERVER/STATIC ONLY)
- lib/supabase/client.ts = browser client
- lib/supabase/server.ts = server client + cookies
- lib/supabase/static.ts = public read TANPA cookies (SSG/build safe)
- JANGAN import lib/data atau server.ts ke file "use client"

## Fitur yang Sudah Selesai 100%
Frontend toko, Supabase DB/Storage, Auth Owner & Staff, CRUD produk + upload & kompresi foto HP otomatis,
Pesanan publik + Admin status pesanan & chat WA pembeli, Edit teks/konten & galeri, 4 Tema warna,
Logo vintage di Header/Footer, Font Special Elite (Mesin Tik), Hero Section sinematik, Deploy Vercel.

## Aturan Output AI
1. Baca file terkait dulu sebelum melakukan perubahan.
2. Untuk komponen besar: berikan KODE FULL FILE.
3. Setelah selesai: sebutkan daftar file yang diubah + langkah tes di localhost.
4. Jangan commit secret atau file .env.local.
5. Windows Environment: perhatikan penggunaan npm.cmd jika diperlukan.

## Tugas saya sekarang:
[TULISKAN TUGAS / FITUR BARU KAMU DI SINI]

PROMPT VERSI SUPER PENDEK (Untuk Chat Lanjutan)
Lanjut project Juara Sepatu (@docs/HANDOFF.md). Jangan rewrite dari nol.
Tugas: [TULISKAN TUGAS KAMU DI SINI]
Berikan KODE FULL FILE untuk UI besar. Tes di localhost dulu.