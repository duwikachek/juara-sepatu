import { ImageResponse } from "next/og";
import { getSettings } from "@/lib/data";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

export const alt = "Juara Sepatu — Katalog Boots Thrift Premium";
export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";

// Gambar di-generate secara dinamis (tidak di-cache statis)
export const dynamic = "force-dynamic";

// Baca logo yang sudah di-crop dan dikompres di folder public
const logoBuf = await readFile(join(process.cwd(), "public/logo.png"));
const logoSrc = `data:image/png;base64,${logoBuf.toString("base64")}`;

// Baca font mesin ketik kuno (Special Elite)
const typewriterFont = await readFile(
  join(process.cwd(), "public/fonts/special-elite.ttf")
);

export default async function Image() {
  const settings = await getSettings();

  const heroImage = settings.hero_image;
  const titleLine1 = settings.hero_title_line1 ?? "Katalog";
  const titleLine2 = settings.hero_title_line2 ?? "Boots Thrift";
  const description = settings.hero_description ?? "";

  const imgResponse = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          fontFamily: '"Special Elite"',
          backgroundColor: "#0a0a0a",
        }}
      >
        {/* Background: Hero Image */}
        <img
          src={heroImage}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
          alt=""
        />

        {/* Gradient overlay — gelap tipis di atas untuk kontras logo, terang di bawah untuk teks hitam */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.05) 45%, rgba(255,255,255,0.2) 100%)",
            display: "flex",
          }}
        />

        {/* Top bar: logo Juara Sepatu di posisi kanan atas tanpa background hitam */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "36px 56px",
          }}
        >
          <img
            src={logoSrc}
            alt="Juara Sepatu"
            style={{
              height: "60px",
              width: "122px",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Bottom content: judul besar + deskripsi (skala 60%, font mesin ketik kuno, warna hitam) */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            padding: "0 56px 44px",
          }}
        >
          {/* Garis aksen kuning (skala 60%) */}
          <div
            style={{
              width: "36px",
              height: "4px",
              backgroundColor: "#eab308",
              borderRadius: "2px",
              marginBottom: "12px",
            }}
          />

          {/* Judul dua baris (skala 60% = 46px, baris 1 hitam, baris 2 kuning) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                fontSize: 46,
                fontWeight: 700,
                color: "#0a0a0a",
                lineHeight: 1.1,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              {titleLine1}
            </span>
            <span
              style={{
                fontSize: 46,
                fontWeight: 700,
                color: "#ca8a04",
                lineHeight: 1.1,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              {titleLine2}
            </span>
          </div>

          {/* Deskripsi (skala 60% = 14px, warna hitam) */}
          <span
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: "#1c1917",
              lineHeight: 1.6,
              maxWidth: "680px",
            }}
          >
            {description}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Special Elite",
          data: typewriterFont,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );

  const pngBuffer = Buffer.from(await imgResponse.arrayBuffer());
  const jpegBuffer = await sharp(pngBuffer)
    .jpeg({ quality: 82, progressive: true })
    .toBuffer();

  return new Response(jpegBuffer, {
    headers: {
      "Content-Type": "image/jpeg",
    },
  });
}
