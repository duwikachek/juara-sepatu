import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { getSettings } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://juara-sepatu.vercel.app";

export const metadata: Metadata = {
  title: "Juara Sepatu",
  description: " ",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: "Juara Sepatu",
    title: "Juara Sepatu",
    description: " ",
    images: [
      {
        url: `${SITE_URL}/og.jpg`,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Juara Sepatu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Juara Sepatu",
    description: " ",
    images: [`${SITE_URL}/og.jpg`],
  },
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