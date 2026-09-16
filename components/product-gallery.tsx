"use client";

import { useState } from "react";
import { Play, Video } from "lucide-react";
import { SafeImage } from "@/components/ui/safe-image";
import { isVideoUrl } from "@/lib/products";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const currentMedia = images[active] || images[0] || "";

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
        {isVideoUrl(currentMedia) ? (
          <div className="relative flex h-full w-full items-center justify-center bg-black">
            <video
              key={currentMedia}
              src={currentMedia}
              controls
              playsInline
              autoPlay
              muted
              className="h-full w-full object-contain"
            />
            <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-yellow-400 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-black shadow-lg pointer-events-none">
              <Video className="h-3.5 w-3.5" /> Video MP4
            </span>
          </div>
        ) : (
          <SafeImage
            src={currentMedia}
            alt={name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((item, i) => {
            const isVid = isVideoUrl(item);
            return (
              <button
                key={item + i}
                onClick={() => setActive(i)}
                className={`relative aspect-square overflow-hidden rounded-lg border transition ${
                  active === i
                    ? "border-yellow-400 opacity-100 ring-2 ring-yellow-400/40"
                    : "border-neutral-800 opacity-60 hover:opacity-100"
                }`}
              >
                {isVid ? (
                  <div className="relative flex h-full w-full items-center justify-center bg-neutral-950">
                    <video
                      src={item}
                      className="h-full w-full object-cover opacity-70"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400 text-black shadow-md">
                        <Play className="h-3.5 w-3.5 fill-black translate-x-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[8px] font-black uppercase text-yellow-400">
                      MP4
                    </span>
                  </div>
                ) : (
                  <SafeImage
                    src={item}
                    alt={`${name} ${i + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}