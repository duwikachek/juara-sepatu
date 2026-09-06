import {
  Boxes,
  ImageIcon,
  NotebookText,
  Palette,
  ShieldCheck,
} from "lucide-react";

const upcomingFeatures = [
  {
    title: "Kelola Produk",
    description: "Tambah, edit, hapus, dan tandai produk sebagai terjual.",
    icon: Boxes,
  },
  {
    title: "Kelola Galeri",
    description: "Ubah foto, judul, kategori, dan urutan galeri.",
    icon: ImageIcon,
  },
  {
    title: "Kelola Konten",
    description: "Ubah teks hero, tentang, kontak, foto, dan jam operasional.",
    icon: NotebookText,
  },
  {
    title: "Pilih Tema",
    description: "Gunakan salah satu dari empat pilihan tema toko.",
    icon: Palette,
  },
];

export default function AdminPage() {
  return (
    <main>
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-3 text-yellow-400">
          <ShieldCheck className="h-6 w-6" />
          <span className="text-xs font-bold uppercase tracking-widest">
            Login berhasil
          </span>
        </div>

        <h1 className="text-3xl font-black uppercase tracking-tight md:text-4xl">
          Dashboard Admin
        </h1>

        <p className="mt-3 max-w-2xl text-neutral-400">
          Sistem login sudah aktif. Pada tahap berikutnya kita akan mengaktifkan
          pengelolaan produk, galeri, konten, pesanan, dan tema.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {upcomingFeatures.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6"
            >
              <Icon className="mb-4 h-7 w-7 text-yellow-400" />

              <h2 className="mb-2 font-black uppercase">
                {feature.title}
              </h2>

              <p className="text-sm leading-relaxed text-neutral-400">
                {feature.description}
              </p>

              <span className="mt-5 inline-block rounded-full border border-neutral-700 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                Tahap berikutnya
              </span>
            </div>
          );
        })}
      </div>
    </main>
  );
}