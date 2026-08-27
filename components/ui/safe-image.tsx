"use client";

import Image, { type ImageProps } from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";

export function SafeImage(props: ImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-900 text-neutral-600">
        <ImageOff className="h-7 w-7" />
        <span className="text-[10px] font-bold uppercase tracking-widest">
          Foto tidak tersedia
        </span>
      </div>
    );
  }

  return <Image {...props} onError={() => setFailed(true)} />;
}