"use server";

import { createStaticClient } from "@/lib/supabase/static";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function makeOrderNumber() {
  const d = new Date();
  const date =
    d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `JS-${date}-${rand}`;
}

export async function createOrderAction(formData: FormData) {
  const supabase = createStaticClient();

  const productId = text(formData, "product_id");
  const productSlug = text(formData, "product_slug");
  const productName = text(formData, "product_name");
  const productPrice = Number(text(formData, "product_price") || "0");
  const productSize = text(formData, "product_size");
  const productImage = text(formData, "product_image");

  const customerName = text(formData, "customer_name");
  const customerPhone = text(formData, "customer_phone").replace(/\D/g, "");
  const customerAddress = text(formData, "customer_address");
  const customerNote = text(formData, "customer_note");

  if (!productName || !productSlug) {
    return { ok: false, message: "Produk tidak valid." };
  }
  if (!productSize) {
    return { ok: false, message: "Pilih ukuran terlebih dahulu." };
  }
  if (!customerName || customerName.length < 2) {
    return { ok: false, message: "Nama pembeli wajib diisi." };
  }
  if (!customerPhone || customerPhone.length < 10) {
    return { ok: false, message: "Nomor WhatsApp pembeli tidak valid." };
  }
  if (!customerAddress || customerAddress.length < 5) {
    return { ok: false, message: "Alamat pengiriman wajib diisi." };
  }
  if (!productPrice || productPrice < 0) {
    return { ok: false, message: "Harga produk tidak valid." };
  }

  // Cek produk masih ada & belum terjual
  if (productId) {
    const { data: product } = await supabase
      .from("products")
      .select("id, sold, name, price, slug")
      .eq("id", productId)
      .maybeSingle();

    if (!product) {
      return { ok: false, message: "Produk tidak ditemukan." };
    }
    if (product.sold) {
      return {
        ok: false,
        message: "Maaf, produk ini baru saja terjual.",
      };
    }
  }

  const orderNumber = makeOrderNumber();

  const { data, error } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      product_id: productId || null,
      product_slug: productSlug,
      product_name: productName,
      product_price: productPrice,
      product_size: productSize,
      product_image: productImage,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      customer_note: customerNote,
      status: "menunggu",
    })
    .select("id, order_number")
    .single();

  if (error) {
    console.error("createOrder error:", error.message);
    return {
      ok: false,
      message: error.message || "Gagal menyimpan pesanan.",
    };
  }

  return {
    ok: true,
    message: "Pesanan berhasil dikirim.",
    orderNumber: data.order_number as string,
    orderId: data.id as string,
  };
}