import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/products";

export function WhatsAppFloat() {
  return (
    <a
      href={waLink("Halo Juara Sepatu! Saya mau tanya stok boots.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp"
      className="fixed bottom-6 right-6 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-black shadow-lg shadow-green-500/30 transition hover:scale-110 hover:bg-green-400"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}