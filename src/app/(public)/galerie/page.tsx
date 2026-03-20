import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galerie",
  description: "Découvrez nos soins et l'ambiance de l'Institut Belle & Sereine à Lausanne.",
};

async function getGalleryImages() {
  try {
    return await prisma.galleryImage.findMany({
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
}

const categoryLabels: Record<string, string> = {
  soins: "Soins",
  ambiance: "Ambiance",
  onglerie: "Onglerie",
  equipe: "Équipe",
};

export default async function GaleriePage() {
  const images = await getGalleryImages();
  const categories = [...new Set(images.map((img) => img.category).filter(Boolean))];

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#F5F0EB] text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[#8B7355] text-sm font-medium uppercase tracking-widest">
            Galerie photos
          </span>
          <h1
            className="text-5xl text-[#2C2C2C] mt-2 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Notre univers
          </h1>
          <p className="text-[#6B6B6B] max-w-2xl mx-auto">
            Découvrez l&apos;ambiance de notre institut, nos soins et les résultats obtenus par nos clientes.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-[#FEFCF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.length > 0 ? (
            categories.map((cat) => {
              const catImages = images.filter((img) => img.category === cat);
              return (
                <div key={cat} className="mb-16">
                  <h2
                    className="text-2xl text-[#2C2C2C] mb-6"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {cat ? categoryLabels[cat] || cat : ""}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {catImages.map((image) => (
                      <div
                        key={image.id}
                        className="aspect-square rounded-xl overflow-hidden bg-[#F5F0EB] group cursor-pointer relative"
                      >
                        <div className="w-full h-full bg-gradient-to-br from-[#E8E0D5] to-[#D5C9BC] flex items-center justify-center">
                          <span className="text-[#8B7355]/40 text-sm">{image.alt || "Photo"}</span>
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                        {image.alt && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                            <p className="text-white text-xs">{image.alt}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-[#F5F0EB] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📸</span>
              </div>
              <p className="text-[#6B6B6B]">La galerie sera bientôt disponible.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
