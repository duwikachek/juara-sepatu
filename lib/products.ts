export interface Product {
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
}

export const WHATSAPP_NUMBER = "6281234567890"; // ← ganti nomor tokomu
export const STORE_NAME = "Juara Sepatu";

const IMG = {
  ranger:
    "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1200&auto=format&fit=crop",
  timber:
    "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=1200&auto=format&fit=crop",
  cream:
    "https://images.unsplash.com/photo-1499013819532-e4ff41b00669?q=80&w=1200&auto=format&fit=crop",
  urban:
    "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1200&auto=format&fit=crop",
  studio:
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop",
};

export const products: Product[] = [
  {
    slug: "red-wing-iron-ranger-8111",
    name: "Red Wing Iron Ranger 8111",
    brand: "Red Wing",
    category: "Work Boots",
    price: 2500000,
    sizes: ["41", "42"],
    grade: "Grade A",
    condition: "9.5/10 — Like New",
    description:
      "Leather Amber Harness original dengan cap toe khas Iron Ranger. Outsole bawaan masih sangat tebal, kulit mulus tanpa crack. Sudah melalui deep clean dan leather conditioning.",
    highlights: [
      "Kulit Amber Harness original",
      "Outsole nitrile cork masih tebal",
      "Goodyear welt, bisa resole",
      "Sudah deep clean + conditioning",
    ],
    images: [IMG.ranger, IMG.studio, IMG.urban],
    sold: false,
  },
  {
    slug: "dr-martens-1460-smooth-black",
    name: "Dr. Martens 1460 Smooth Black",
    brand: "Dr. Martens",
    category: "Classic Boots",
    price: 1800000,
    sizes: ["40", "41", "43"],
    grade: "Grade A",
    condition: "9.0/10 — Sangat Baik",
    description:
      "Docmart 8 lubang legendaris. Kulit smooth empuk dan nyaman, insole bersih, jahitan kuning khas masih utuh rapi tanpa lepas.",
    highlights: [
      "8 eyelets original",
      "Air-cushioned sole masih empuk",
      "Jahitan kuning utuh",
      "Insole sudah disterilkan",
    ],
    images: [IMG.cream, IMG.ranger, IMG.timber],
    sold: false,
  },
  {
    slug: "timberland-6-inch-premium",
    name: "Timberland 6-Inch Premium Yellow",
    brand: "Timberland",
    category: "Outdoor Boots",
    price: 1350000,
    sizes: ["42", "43", "44"],
    grade: "Grade A",
    condition: "8.8/10 — Baik",
    description:
      "Ikon boots kuning yang tidak pernah mati gaya. Nubuck sudah di-treatment waterproof ulang, sol lug tebal siap untuk urban maupun outdoor.",
    highlights: [
      "Nubuck waterproof treatment ulang",
      "Sol lug masih tebal",
      "Padded collar nyaman",
      "Tali cadangan disertakan",
    ],
    images: [IMG.timber, IMG.urban, IMG.studio],
    sold: false,
  },
  {
    slug: "clarks-desert-boot-suede",
    name: "Clarks Desert Boot Suede",
    brand: "Clarks",
    category: "Casual Boots",
    price: 950000,
    sizes: ["39", "40"],
    grade: "Grade A",
    condition: "9.2/10 — Sangat Baik",
    description:
      "Chukka klasik paling serbaguna. Suede halus merata tanpa bagian botak, crepe sole original masih empuk khas Clarks.",
    highlights: [
      "Suede original tanpa botak",
      "Crepe sole masih empuk",
      "Ringan, cocok harian",
      "Sudah dry clean suede",
    ],
    images: [IMG.studio, IMG.cream, IMG.ranger],
    sold: false,
  },
  {
    slug: "thorogood-moc-toe-814",
    name: "Thorogood Moc Toe 814",
    brand: "Thorogood",
    category: "Work Boots",
    price: 2100000,
    sizes: ["42", "43"],
    grade: "Grade A",
    condition: "9.0/10 — Sangat Baik",
    description:
      "Workboots buatan Amerika dengan kulit oil-tanned tahan banting. Moc toe stitching rapi, wedge sole memberi kenyamanan berdiri lama.",
    highlights: [
      "Made in USA",
      "Kulit oil-tanned tebal",
      "Wedge sole nyaman",
      "Goodyear welt",
    ],
    images: [IMG.urban, IMG.timber, IMG.ranger],
    sold: false,
  },
  {
    slug: "blundstone-500-chelsea",
    name: "Blundstone 500 Chelsea Boots",
    brand: "Blundstone",
    category: "Chelsea Boots",
    price: 1650000,
    sizes: ["40", "41", "42"],
    grade: "Grade A",
    condition: "9.3/10 — Sangat Baik",
    description:
      "Slip-on tanpa tali, praktis untuk harian. Karet elastis kanan-kiri masih sangat kencang, kulit lentur dan nyaman dipakai seharian.",
    highlights: [
      "Elastic panel masih kencang",
      "Tanpa tali, praktis",
      "Sol anti selip",
      "Kulit lentur nyaman",
    ],
    images: [IMG.cream, IMG.urban, IMG.studio],
    sold: false,
  },
  {
    slug: "red-wing-blacksmith-3345",
    name: "Red Wing Blacksmith 3345",
    brand: "Red Wing",
    category: "Heritage Boots",
    price: 2750000,
    sizes: ["42", "43"],
    grade: "Grade A+",
    condition: "9.6/10 — Near Mint",
    description:
      "Briar Oil Slick leather dengan patina cantik. Kondisi hampir seperti baru, pemakaian sangat minim, box original ikut disertakan.",
    highlights: [
      "Briar Oil Slick leather",
      "Box original disertakan",
      "Patina alami mulai muncul",
      "Vibram 430 mini-lug",
    ],
    images: [IMG.ranger, IMG.timber, IMG.cream],
    sold: false,
  },
  {
    slug: "dr-martens-adrian-tassel",
    name: "Dr. Martens Adrian Tassel Loafer",
    brand: "Dr. Martens",
    category: "Loafer",
    price: 1250000,
    sizes: ["39", "40", "41"],
    grade: "Grade B+",
    condition: "8.5/10 — Baik",
    description:
      "Loafer tassel dengan sol Docmart. Ada sedikit lecet halus di bagian tumit, tidak mengganggu tampilan keseluruhan.",
    highlights: [
      "Tassel lengkap kanan-kiri",
      "Sol air-cushioned",
      "Minor scuff di tumit",
      "Sudah dipoles ulang",
    ],
    images: [IMG.studio, IMG.ranger, IMG.urban],
    sold: true,
  },
];

/* ---------- Fungsi bantu ---------- */

export function formatRupiah(value: number) {
  return "Rp " + value.toLocaleString("id-ID");
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getRelated(slug: string, limit = 3) {
  const current = getProductBySlug(slug);
  if (!current) return [];
  const sameBrand = products.filter(
    (p) => p.slug !== slug && p.brand === current.brand && !p.sold
  );
  const others = products.filter(
    (p) => p.slug !== slug && p.brand !== current.brand && !p.sold
  );
  return [...sameBrand, ...others].slice(0, limit);
}

export const brands = Array.from(new Set(products.map((p) => p.brand))).sort();

export const allSizes = Array.from(
  new Set(products.flatMap((p) => p.sizes))
).sort();

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}