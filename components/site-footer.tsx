import Link from "next/link";
import { MessageCircle, Mail } from "lucide-react";
import { waLink } from "@/lib/products";

/* Ikon Instagram digambar manual, tidak bergantung lucide */
function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-800 bg-black">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <h3 className="mb-3 text-xl font-black uppercase tracking-tighter text-yellow-400">
            Juara Sepatu.
          </h3>
          <p className="max-w-xs text-sm leading-relaxed text-neutral-400">
            Toko boots thrift terkurasi. Setiap pasang melalui sanitasi dan
            restorasi premium sebelum sampai ke kaki Anda.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
            Navigasi
          </h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li>
              <Link href="/#beranda" className="hover:text-yellow-400">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/#koleksi" className="hover:text-yellow-400">
                Koleksi Spesial
              </Link>
            </li>
            <li>
              <Link href="/#katalog" className="hover:text-yellow-400">
                Katalog Sepatu
              </Link>
            </li>
            <li>
              <Link href="/#tentang" className="hover:text-yellow-400">
                Tentang Kami
              </Link>
            </li>
            <li>
              <Link href="/#kontak" className="hover:text-yellow-400">
                Kontak
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
            Terhubung
          </h4>
          <div className="flex gap-3">
            <a
              href={waLink("Halo Juara Sepatu, saya mau tanya-tanya dulu.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="rounded-lg border border-neutral-800 p-3 text-neutral-400 transition hover:border-yellow-400 hover:text-yellow-400"
            >
              <MessageCircle className="h-5 w-5" />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-lg border border-neutral-800 p-3 text-neutral-400 transition hover:border-yellow-400 hover:text-yellow-400"
            >
              <InstagramIcon />
            </a>

            <a
              href="mailto:halo@juarasepatu.com"
              aria-label="Email"
              className="rounded-lg border border-neutral-800 p-3 text-neutral-400 transition hover:border-yellow-400 hover:text-yellow-400"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-500">
        © {year} Juara Sepatu Thrift. All rights reserved.
      </div>
    </footer>
  );
}