"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  LoaderCircle,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";
import {
  deleteProductAction,
  toggleProductSoldAction,
} from "@/app/admin/produk/actions";

type Props = {
  id: string;
  name: string;
  sold: boolean;
  isOwner: boolean;
};

export function ProductRowActions({ id, name, sold, isOwner }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onToggle = () => {
    const formData = new FormData();
    formData.set("id", id);
    formData.set("sold", String(sold));

    startTransition(async () => {
      const result = await toggleProductSoldAction(formData);
      if (!result.ok) {
        alert(result.message);
        return;
      }
      router.refresh();
    });
  };

  const onDelete = () => {
    if (!isOwner) return;

    const ok = window.confirm(
      `Hapus produk "${name}"?\n\nTindakan ini tidak bisa dibatalkan.`
    );
    if (!ok) return;

    const formData = new FormData();
    formData.set("id", id);

    startTransition(async () => {
      const result = await deleteProductAction(formData);
      if (!result.ok) {
        alert(result.message);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/admin/produk/${id}`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-200 transition hover:border-yellow-400 hover:text-yellow-400"
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </Link>

      <button
        type="button"
        onClick={onToggle}
        disabled={pending}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition disabled:opacity-50 ${
          sold
            ? "border-green-500/40 text-green-400 hover:bg-green-500/10"
            : "border-orange-500/40 text-orange-300 hover:bg-orange-500/10"
        }`}
      >
        {pending ? (
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
        ) : sold ? (
          <RotateCcw className="h-3.5 w-3.5" />
        ) : (
          <CheckCircle2 className="h-3.5 w-3.5" />
        )}
        {sold ? "Stokkan Lagi" : "Terjual"}
      </button>

      {isOwner && (
        <button
          type="button"
          onClick={onDelete}
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
        >
          {pending ? (
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
          Hapus
        </button>
      )}
    </div>
  );
}