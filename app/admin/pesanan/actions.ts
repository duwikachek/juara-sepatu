"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

const ALLOWED_STATUS = [
  "menunggu",
  "dikonfirmasi",
  "dibayar",
  "dikirim",
  "selesai",
  "batal",
] as const;

type OrderStatus = (typeof ALLOWED_STATUS)[number];

function isStatus(value: string): value is OrderStatus {
  return (ALLOWED_STATUS as readonly string[]).includes(value);
}

export async function updateOrderStatusAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  const adminNote = String(formData.get("admin_note") || "").trim();

  if (!id) {
    return { ok: false, message: "ID pesanan tidak valid." };
  }
  if (!isStatus(status)) {
    return { ok: false, message: "Status tidak valid." };
  }

  const { error } = await supabase
    .from("orders")
    .update({
      status,
      admin_note: adminNote,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin/pesanan");
  revalidatePath("/admin");

  return { ok: true, message: "Pesanan berhasil diperbarui." };
}

export async function deleteOrderAction(formData: FormData) {
  const { supabase, isOwner } = await requireAdmin();

  if (!isOwner) {
    return { ok: false, message: "Hanya Owner yang boleh menghapus pesanan." };
  }

  const id = String(formData.get("id") || "");
  if (!id) {
    return { ok: false, message: "ID pesanan tidak valid." };
  }

  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin/pesanan");
  revalidatePath("/admin");

  return { ok: true, message: "Pesanan dihapus." };
}