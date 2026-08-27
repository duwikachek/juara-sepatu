"use client";

import { useState } from "react";
import { SafeImage } from "@/components/ui/safe-image";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
        <SafeImage
          src={images[active]}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded-lg border transition ${
                active === i
                  ? "border-yellow-400 opacity-100"
                  : "border-neutral-800 opacity-60 hover:opacity-100"
              }`}
            >
              <SafeImage
                src={img}
                alt={`${name} ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}