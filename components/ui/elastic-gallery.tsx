"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ElasticItem {
  id: string;
  title: string;
  category: string;
  src: string;
  alt: string;
}

const items: ElasticItem[] = [
  {
    id: "01",
    title: "Iron Ranger",
    category: "Boots",
    src: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1200&auto=format&fit=crop",
    alt: "Iron Ranger Leather Boots",
  },
  {
    id: "02",
    title: "Nightwalker",
    category: "Urban",
    src: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=1200&auto=format&fit=crop",
    alt: "Nightwalker Urban Boots",
  },
  {
    id: "03",
    title: "Desert Chukka",
    category: "Casual",
    src: "https://images.unsplash.com/photo-1542280756-74b2f55e73e1?q=80&w=1200&auto=format&fit=crop",
    alt: "Desert Chukka Suede",
  },
  {
    id: "04",
    title: "Vintage 1460",
    category: "Classic",
    src: "https://images.unsplash.com/photo-1499013819532-e4ff41b00669?q=80&w=1200&auto=format&fit=crop",
    alt: "Vintage Classic Boots",
  },
  {
    id: "05",
    title: "Chelsea Core",
    category: "Slip-on",
    src: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1200&auto=format&fit=crop",
    alt: "Chelsea Core Boots",
  },
];

const galleryStyles = `
.jsg-list{display:flex;flex-direction:row;gap:1rem;height:550px;width:100%;}

.jsg-item{
  position:relative;
  flex:1 1 0%;
  min-width:0;
  overflow:hidden;
  border-radius:1rem;
  border:1px solid #262626;
  background:#0a0a0a;
  cursor:pointer;
  filter:brightness(.45);
  transition:flex-grow .7s cubic-bezier(.25,1,.5,1), filter .7s ease, border-color .4s ease;
}

/* MELEBAR saat kursor mengarah ke kartu */
.jsg-item:hover{flex-grow:4;filter:brightness(1);border-color:#facc15;}

/* Kartu default terbuka saat kursor belum menyentuh galeri */
.jsg-list:not(:hover) .jsg-item.jsg-active{flex-grow:4;filter:brightness(1);border-color:#facc15;}
.jsg-list:not(:has(.jsg-item:hover)) .jsg-item.jsg-active{flex-grow:4;filter:brightness(1);border-color:#facc15;}

.jsg-media{position:absolute;inset:0;pointer-events:none;}
.jsg-img{transform:scale(1.12);transition:transform 1s ease;}
.jsg-item:hover .jsg-img,
.jsg-list:not(:hover) .jsg-item.jsg-active .jsg-img,
.jsg-list:not(:has(.jsg-item:hover)) .jsg-item.jsg-active .jsg-img{transform:scale(1);}

.jsg-overlay{
  position:absolute;inset:0;
  background:linear-gradient(to top,rgba(0,0,0,.92) 0%,rgba(0,0,0,.35) 45%,transparent 100%);
  opacity:.45;transition:opacity .5s ease;
}
.jsg-item:hover .jsg-overlay,
.jsg-list:not(:hover) .jsg-item.jsg-active .jsg-overlay,
.jsg-list:not(:has(.jsg-item:hover)) .jsg-item.jsg-active .jsg-overlay{opacity:1;}

.jsg-body{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:2rem;pointer-events:none;}

.jsg-content{
  display:flex;flex-direction:column;align-items:flex-start;gap:.65rem;
  opacity:0;transform:translateY(2.5rem);
  transition:opacity .5s ease, transform .5s ease;
}
.jsg-item:hover .jsg-content,
.jsg-list:not(:hover) .jsg-item.jsg-active .jsg-content,
.jsg-list:not(:has(.jsg-item:hover)) .jsg-item.jsg-active .jsg-content{opacity:1;transform:translateY(0);transition-delay:.15s;}

.jsg-badge{
  border:1px solid rgba(250,204,21,.4);background:rgba(250,204,21,.18);
  color:#facc15;border-radius:999px;padding:.28rem .8rem;
  font-size:.65rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
  backdrop-filter:blur(6px);
}
.jsg-title{
  font-size:clamp(1.9rem,3.2vw,3.4rem);font-weight:900;line-height:.92;
  text-transform:uppercase;color:#fff;letter-spacing:-.02em;white-space:nowrap;
}
.jsg-cta{
  display:inline-flex;align-items:center;gap:.4rem;margin-top:.3rem;
  font-size:.75rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#facc15;
}

.jsg-vertical{
  position:absolute;bottom:1.75rem;left:50%;transform:translateX(-50%);
  writing-mode:vertical-rl;white-space:nowrap;
  font-size:1rem;font-weight:700;letter-spacing:.25em;text-transform:uppercase;
  color:#d4d4d4;opacity:1;transition:opacity .4s ease;
}
.jsg-item:hover .jsg-vertical,
.jsg-list:not(:hover) .jsg-item.jsg-active .jsg-vertical,
.jsg-list:not(:has(.jsg-item:hover)) .jsg-item.jsg-active .jsg-vertical{opacity:0;}

/* Tampilan HP */
@media (max-width:767px){
  .jsg-list{flex-direction:column;height:auto;gap:.75rem;}
  .jsg-item{flex:none;height:200px;filter:brightness(1);}
  .jsg-body{padding:1.25rem;}
  .jsg-content{opacity:1;transform:none;}
  .jsg-overlay{opacity:1;}
  .jsg-img{transform:none;}
  .jsg-vertical{display:none;}
  .jsg-title{font-size:1.9rem;}
}
`;

export function ElasticGallery() {
  const [activeId, setActiveId] = useState("02");

  return (
    <div className="w-full px-4 py-8 md:py-16">
      <style>{galleryStyles}</style>

      <div className="jsg-list mx-auto max-w-7xl">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveId(item.id)}
            className={`jsg-item ${activeId === item.id ? "jsg-active" : ""}`}
          >
            <div className="jsg-media">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="jsg-img object-cover"
                priority={item.id === "01" || item.id === "02"}
              />
              <div className="jsg-overlay" />
            </div>

            <div className="jsg-body">
              <div className="jsg-content">
                <span className="jsg-badge">{item.category}</span>
                <h3 className="jsg-title">{item.title}</h3>
                <span className="jsg-cta">
                  Lihat Sepatu <ArrowUpRight size={16} />
                </span>
              </div>

              <span className="jsg-vertical">{item.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}