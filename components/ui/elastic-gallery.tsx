"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export interface ElasticGalleryItem {
  id: string;
  title: string;
  category: string;
  src: string;
  alt?: string;
}

const DEFAULT_ITEMS: ElasticGalleryItem[] = [
  {
    id: "01",
    title: "Iron Ranger",
    category: "Boots",
    src: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "02",
    title: "Nightwalker",
    category: "Urban",
    src: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "03",
    title: "Desert Chukka",
    category: "Casual",
    src: "https://images.unsplash.com/photo-1542280756-74b2f55e73e1?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "04",
    title: "Vintage 1460",
    category: "Classic",
    src: "https://images.unsplash.com/photo-1499013819532-e4ff41b00669?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "05",
    title: "Chelsea Core",
    category: "Slip-on",
    src: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1000&auto=format&fit=crop",
  },
];

export function ElasticGallery({
  items = DEFAULT_ITEMS,
}: {
  items?: ElasticGalleryItem[];
}) {
  const list = items.length > 0 ? items : DEFAULT_ITEMS;
  const [activeId, setActiveId] = useState<string>(list[1]?.id ?? list[0].id);

  return (
    <div className="w-full py-8 md:py-16">
      <div className="mx-auto flex h-[500px] w-full max-w-7xl flex-col gap-3 px-4 md:h-[550px] md:flex-row md:gap-4">
        {list.map((item) => {
          const isActive = activeId === item.id;
          return (
            <div
              key={item.id}
              onMouseEnter={() => setActiveId(item.id)}
              onClick={() => setActiveId(item.id)}
              style={{
                flexGrow: isActive ? 4 : 1,
                flexShrink: 1,
                flexBasis: "0px",
                transition:
                  "flex-grow 700ms cubic-bezier(0.25, 1, 0.5, 1), filter 700ms ease, border-color 500ms ease",
              }}
              className={cn(
                "relative h-full min-h-0 min-w-0 cursor-pointer select-none overflow-hidden rounded-2xl border bg-neutral-950",
                isActive
                  ? "border-yellow-400 brightness-100 shadow-2xl shadow-yellow-500/20"
                  : "border-neutral-800 brightness-40 hover:brightness-75"
              )}
            >
              <div className="pointer-events-none absolute inset-0 h-full w-full">
                <Image
                  src={item.src}
                  alt={item.alt ?? item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={cn(
                    "object-cover transition-transform duration-1000 ease-out",
                    isActive ? "scale-100" : "scale-110"
                  )}
                />
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-500",
                    isActive ? "opacity-100" : "opacity-40"
                  )}
                />
              </div>

              <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end p-5 md:p-8">
                <div
                  className={cn(
                    "flex transform flex-col gap-2 transition-all duration-500",
                    isActive
                      ? "translate-y-0 opacity-100 delay-150"
                      : "translate-y-12 opacity-0"
                  )}
                >
                  <span className="w-fit rounded-full border border-yellow-500/40 bg-yellow-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-yellow-400 md:text-xs">
                    {item.category}
                  </span>
                  <h3 className="text-3xl font-black uppercase leading-none tracking-tight text-white md:text-5xl">
                    {item.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-yellow-400 md:mt-4 md:text-sm">
                    Lihat Sepatu <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                <div
                  className={cn(
                    "absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-500",
                    isActive ? "scale-50 opacity-0" : "opacity-100 delay-200"
                  )}
                >
                  <span className="hidden whitespace-nowrap text-lg font-bold uppercase tracking-widest text-neutral-300 [writing-mode:vertical-rl] md:block">
                    {item.title}
                  </span>
                  <span className="block text-xs font-bold text-neutral-300 md:hidden">
                    {item.id}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}