"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import {
  FALLBACK_SETTINGS,
  waLink,
  type SiteSettings,
} from "@/lib/products";

export function SiteFooter({
  settings = FALLBACK_SETTINGS,
}: {
  settings?: SiteSettings;
}) {
  const [imgError, setImgError] = useState(false);
  const year = new Date().getFullYear();
  const phone = settings.whatsapp || FALLBACK_SETTINGS.whatsapp;
  const storeName = settings.store_name || FALLBACK_SETTINGS.store_name;
  const email = settings.email || FALLBACK_SETTINGS.email || "juarasepatu888@gmail.com";

  return (
    <footer className="border-t border-neutral-800 bg-black">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <Link href="/" className="mb-4 inline-block transition hover:opacity-80">
            {!imgError ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src="/logo.png"
                alt={storeName}
                onError={() => setImgError(true)}
                className="h-14 w-auto object-contain"
              />
            ) : (
              <h3 className="text-xl font-black uppercase tracking-tighter text-brand">
                {storeName}.
              </h3>
            )}
          </Link>

          <p className="max-w-xs text-sm leading-relaxed text-neutral-400">
            {settings.footer_text || FALLBACK_SETTINGS.footer_text}
          </p>
          <p className="mt-4 text-xs leading-relaxed text-neutral-500">
            {settings.address}
            <br />
            {settings.hours}
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white">
            Navigasi
          </h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li>
              <Link href="/#beranda" className="hover:text-brand">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/#koleksi" className="hover:text-brand">
                Referensi
              </Link>
            </li>
            <li>
              <Link href="/#katalog" className="hover:text-brand">
                Katalog Sepatu
              </Link>
            </li>
            <li>
              <Link href="/#tentang" className="hover:text-brand">
                Tentang Kami
              </Link>
            </li>
            <li>
              <Link href="/#kontak" className="hover:text-brand">
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
              href={waLink(
                `Halo ${storeName}, saya mau tanya-tanya dulu.`,
                phone
              )}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="rounded-lg border border-neutral-800 p-3 text-neutral-400 transition hover:border-brand hover:text-brand"
            >
              <MessageCircle className="h-5 w-5" />
            </a>

            <a
              href={`mailto:${email}`}
              aria-label="Email"
              className="rounded-lg border border-neutral-800 p-3 text-neutral-400 transition hover:border-brand hover:text-brand"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>

          <div className="mt-5 space-y-1 text-sm text-neutral-400">
            <p>
              <span className="text-neutral-500">WA:</span> +{phone}
            </p>
            <p>
              <span className="text-neutral-500">Email:</span>{" "}
              {email}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-500">
        © {year} {storeName}. All rights reserved.
      </div>
    </footer>
  );
}