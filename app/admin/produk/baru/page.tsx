import { requireAdmin } from "@/lib/admin";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <main>
      <ProductForm mode="create" />
    </main>
  );
}