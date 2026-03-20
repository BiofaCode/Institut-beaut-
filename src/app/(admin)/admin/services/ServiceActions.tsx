"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Edit, Trash2, X, Loader2 } from "lucide-react";
import { slugify } from "@/lib/utils";

type Service = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  duration: number;
  price: unknown;
  categoryId: string;
  isActive: boolean;
  order: number;
};
type Category = { id: string; name: string };

export function ServiceActions({
  service,
  categories,
}: {
  service: Service;
  categories: Category[];
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: service.name,
    slug: service.slug,
    description: service.description || "",
    duration: service.duration,
    price: Number(service.price).toString(),
    categoryId: service.categoryId,
    isActive: service.isActive,
    order: service.order,
  });
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: service.id, ...form, price: Number(form.price) }),
      });
      setEditOpen(false);
      router.refresh();
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Supprimer ce service ? Cette action est irréversible.")) return;
    await fetch(`/api/services?id=${service.id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-lg hover:bg-[#F5F0EB] text-[#6B6B6B]"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1 bg-white border border-[#E8E0D5] rounded-xl shadow-lg z-40 min-w-[140px]">
              <button
                onClick={() => { setMenuOpen(false); setEditOpen(true); }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-[#2C2C2C] hover:bg-[#F5F0EB]"
              >
                <Edit className="w-3.5 h-3.5" /> Modifier
              </button>
              <button
                onClick={() => { setMenuOpen(false); handleDelete(); }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-3.5 h-3.5" /> Supprimer
              </button>
            </div>
          </>
        )}
      </div>

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditOpen(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#2C2C2C]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Modifier le service
              </h2>
              <button onClick={() => setEditOpen(false)}>
                <X className="w-5 h-5 text-[#6B6B6B]" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <Label>Nom *</Label>
                <Input
                  className="mt-1"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea className="mt-1" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Durée (min)</Label>
                  <Input type="number" className="mt-1" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} min={15} step={15} />
                </div>
                <div>
                  <Label>Prix CHF</Label>
                  <Input type="number" className="mt-1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} min={0} step={0.5} />
                </div>
              </div>
              <div>
                <Label>Catégorie</Label>
                <select
                  className="mt-1 w-full h-10 rounded-lg border border-[#E8E0D5] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 accent-[#8B7355]"
                />
                <span className="text-sm text-[#2C2C2C]">Service actif</span>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)} className="flex-1">Annuler</Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enregistrer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
