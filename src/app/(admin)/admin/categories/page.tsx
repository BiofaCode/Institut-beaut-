import { prisma } from "@/lib/prisma";
import { CategoryManager } from "./CategoryManager";

async function getCategories() {
  try {
    return await prisma.serviceCategory.findMany({
      include: { _count: { select: { services: true } } },
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl text-[#2C2C2C]" style={{ fontFamily: "'Playfair Display', serif" }}>
          Catégories
        </h1>
        <p className="text-[#6B6B6B] mt-1">{categories.length} catégorie(s)</p>
      </div>
      <CategoryManager categories={categories as never} />
    </div>
  );
}
