import { prisma } from "@/lib/prisma";
import { GalerieManager } from "./GalerieManager";

async function getImages() {
  try {
    return await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });
  } catch {
    return [];
  }
}

export default async function GalerieAdminPage() {
  const images = await getImages();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl text-[#2C2C2C]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Galerie
        </h1>
        <p className="text-[#6B6B6B] mt-1">{images.length} image(s)</p>
      </div>
      <GalerieManager images={images as never} />
    </div>
  );
}
