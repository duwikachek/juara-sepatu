import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: {
    default: "Juara Sepatu — Katalog Boots Thrift Premium",
    template: "%s | Juara Sepatu",
  },
  description:
    "Toko boots thrift terkurasi. Red Wing, Dr. Martens, Timberland, Clarks — sudah direstorasi premium dan siap pakai.",
  keywords: [
    "sepatu thrift",
    "boots bekas",
    "red wing",
    "dr martens",
    "timberland",
  ],
};

const ALLOWED_THEMES = [
  "kuning-klasik",
  "amber-vintage",
  "militer",
  "steel-blue",
] as const;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const theme = ALLOWED_THEMES.includes(
    settings.theme as (typeof ALLOWED_THEMES)[number]
  )
    ? settings.theme
    : "kuning-klasik";

  return (
    <html lang="id" data-theme={theme}>
      <body className="min-h-screen bg-neutral-950 text-white antialiased selection:bg-brand selection:text-black">
        <SiteHeader />
        {children}
        <SiteFooter settings={settings} />
        <WhatsAppFloat
          phone={settings.whatsapp}
          storeName={settings.store_name}
        />
      </body>
    </html>
  );
}