"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Image, X, Loader2 } from "lucide-react";

type GalleryImage = { id: string; url: string; alt: string | null; category: string | null; order: number };

const CATEGORIES = ["soins", "ambiance", "onglerie", "equipe", "avant-apres"];

export function GalerieManager({ images }: { images: GalleryImage[] }) {
  const [imgs, setImgs] = useState(images);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ url: "", alt: "", category: "ambiance", order: 0 });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const { image } = await res.json();
      setImgs((prev) => [...prev, image]);
      setAddOpen(false);
      setForm({ url: "", alt: "", category: "ambiance", order: 0 });
      router.refresh();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette image ?")) return;
    await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
    setImgs((prev) => prev.filter((img) => img.id !== id));
    router.refresh();
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="w-4 h-4" /> Ajouter une image
        </Button>
      </div>

      {imgs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E8E0D5]">
          <Image className="w-12 h-12 text-[#E8E0D5] mx-auto mb-3" />
          <p className="text-[#6B6B6B]">Aucune image dans la galerie</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imgs.map((img) => (
            <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-[#F5F0EB] border border-[#E8E0D5]">
              <div className="w-full h-full flex items-center justify-center text-[#8B7355]/30">
                <Image className="w-8 h-8" />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              {img.alt && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs">{img.alt}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAddOpen(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#2C2C2C]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Ajouter une image
              </h2>
              <button onClick={() => setAddOpen(false)}><X className="w-5 h-5 text-[#6B6B6B]" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <Label>URL de l&apos;image *</Label>
                <Input className="mt-1" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." required />
              </div>
              <div>
                <Label>Texte alternatif</Label>
                <Input className="mt-1" value={form.alt} onChange={(e) => setForm({ ...form, alt: e.target.value })} placeholder="Description de l'image" />
              </div>
              <div>
                <Label>Catégorie</Label>
                <select
                  className="mt-1 w-full h-10 rounded-lg border border-[#E8E0D5] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setAddOpen(false)} className="flex-1">Annuler</Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ajouter"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
