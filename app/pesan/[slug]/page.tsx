import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getSettings } from "@/lib/data";
import { OrderForm } from "@/components/order-form";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ size?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Pesan Produk" };
  return {
    title: `Pesan ${product.name}`,
    description: `Form pemesanan ${product.name}`,
  };
}

export default async function OrderPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSettings(),
  ]);

  if (!product) notFound();

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <OrderForm
        product={product}
        initialSize={sp.size}
        adminPhone={settings.whatsapp}
        storeName={settings.store_name}
      />
    </main>
  );
}