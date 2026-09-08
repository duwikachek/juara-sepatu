# HANDOFF.md — Juara Sepatu

> Untuk developer / AI agent yang melanjutkan project.
> **Jangan membuat ulang dari nol.** Baca file ini dulu, lalu kerjakan tugas yang diminta.

---

## 1. Ringkasan project

| Item | Nilai |
|------|--------|
| Nama toko | **Juara Sepatu** |
| Jenis | Katalog thrift boots (publik + admin + Supabase) |
| Alur belanja | Form pesanan → tabel `orders` → admin proses → WA |
| Repo | https://github.com/duwikachek/juara-sepatu |
| Production | https://juara-sepatu.vercel.app |
| Local | http://localhost:3000 |
| Branch | `main` |

Bukan full payment gateway. Thrift: konfirmasi & bayar via WhatsApp.

---

## 2. Stack

- **Next.js App Router** + **TypeScript** + **Tailwind CSS**
- **Supabase** (Auth, Postgres, Storage, RLS)
- **Vercel** hosting
- **lucide-react** (ikon brand Instagram: pakai SVG manual, jangan import `Instagram` dari lucide)

Cek versi pasti di `package.json`.

---

## 3. Menjalankan lokal (Windows)

```bash
cd path/to/juara-sepatu
npm install
# PowerShell sering perlu:
npm.cmd install
npm.cmd run dev