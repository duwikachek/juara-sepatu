/* ---------- Tipe data ---------- */

export interface Product {
  id?: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  sizes: string[];
  grade: string;
  condition: string;
  description: string;
  highlights: string[];
  images: string[];
  sold: boolean;
  sort_order?: number;
}

export interface GalleryItem {
  id?: string;
  title: string;
  category: string;
  image_url: string;
  sort_order: number;
  active?: boolean;
}

export interface SiteSettings {
  store_name: string;
  tagline: string;
  hero_title_line1: string;
  hero_title_line2: string;
  hero_description: string;
  hero_image: string;
  about_title: string;
  about_body_1: string;
  about_body_2: string;
  about_image: string;
  about_philosophy_label: string;
  about_philosophy_text: string;
  feature_1_title: string;
  feature_1_text: string;
  feature_2_title: string;
  feature_2_text: string;
  address: string;
  whatsapp: string;
  email: string;
  hours: string;
  footer_text: string;
  theme: string;
}

/* ---------- Cadangan ---------- */

export const FALLBACK_WHATSAPP = "6281234567890";
export const FALLBACK_STORE_NAME = "Juara Sepatu";

export const FALLBACK_SETTINGS: SiteSettings = {
  store_name: "Juara Sepatu",
  tagline: "Curated Thrift Boots Store",
  hero_title_line1: "Katalog",
  hero_title_line2: "Boots Thrift",
  hero_description:
    "Pilihan sepatu bot urban yang kokoh untuk kolektor cerdas. Restorasi premium, terawat sempurna, dan siap pakai.",
  hero_image:
    "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=1920&auto=format&fit=crop",
  about_title: "Tentang Kami",
  about_body_1:
    "JUARA SEPATU hadir dari passion mendalam terhadap footwear kulit berkualitas tinggi. Kami percaya sepatu boots terbaik memiliki cerita dan karakter yang semakin indah seiring waktu.",
  about_body_2:
    "Setiap pasang melalui pemilihan ketat, sanitasi higienis, serta restorasi profesional agar siap langsung Anda pakai dengan bangga.",
  about_image:
    "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1200&auto=format&fit=crop",
  about_philosophy_label: "Filosofi Kami",
  about_philosophy_text: "Karakter Autentik Tanpa Kompromi",
  feature_1_title: "Kurasi Ketat",
  feature_1_text: "Hanya brand original dengan kondisi di atas 85%.",
  feature_2_title: "Restorasi Premium",
  feature_2_text: "Deep clean, conditioning, dan sterilisasi anti-bakteri.",
  address: "Jl. Pemuda No. 123, Bandung, Jawa Barat",
  whatsapp: "6281234567890",
  email: "halo@juarasepatu.com",
  hours: "Setiap Hari · 10.00 – 21.00 WIB",
  footer_text:
    "Toko boots thrift terkurasi. Setiap pasang melalui sanitasi dan restorasi premium sebelum sampai ke kaki Anda.",
  theme: "kuning-klasik",
};

/* ---------- Fungsi murni (aman di client) ---------- */

export function formatRupiah(value: number) {
  return "Rp " + value.toLocaleString("id-ID");
}

export function waLink(message: string, phone = FALLBACK_WHATSAPP) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function getBrands(products: Product[]) {
  return Array.from(new Set(products.map((p) => p.brand))).sort();
}

export function getAllSizes(products: Product[]) {
  return Array.from(new Set(products.flatMap((p) => p.sizes))).sort();
}