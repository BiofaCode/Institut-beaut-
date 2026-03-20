"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit, X, Loader2 } from "lucide-react";
import { slugify } from "@/lib/utils";

type Category = { id: string; name: string; slug: string; description: string | null; order: number; _count: { services: number } };

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [cats, setCats] = useState(categories);
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", order: 0 });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setAddOpen(false);
      setForm({ name: "", slug: "", description: "", order: 0 });
      router.refresh();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette catégorie ? Les services associés seront affectés.")) return;
    await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    setCats((prev) => prev.filter((c) => c.id !== id));
    router.refresh();
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="w-4 h-4" /> Ajouter une catégorie
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E0D5] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F5F0EB]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Catégorie</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Slug</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Services</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider">Ordre</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F0EB]">
            {cats.map((cat) => (
              <tr key={cat.id} className="hover:bg-[#FEFCF9]">
                <td className="px-4 py-3">
                  <div className="font-medium text-sm text-[#2C2C2C]">{cat.name}</div>
                  {cat.description && <div className="text-xs text-[#6B6B6B]">{cat.description}</div>}
                </td>
                <td className="px-4 py-3"><span className="text-xs font-mono text-[#6B6B6B] bg-[#F5F0EB] px-2 py-0.5 rounded">{cat.slug}</span></td>
                <td className="px-4 py-3"><span className="text-sm text-[#2C2C2C]">{cat._count.services}</span></td>
                <td className="px-4 py-3"><span className="text-sm text-[#6B6B6B]">{cat.order}</span></td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(cat.id)} className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAddOpen(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#2C2C2C]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Nouvelle catégorie
              </h2>
              <button onClick={() => setAddOpen(false)}><X className="w-5 h-5 text-[#6B6B6B]" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <Label>Nom *</Label>
                <Input className="mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })} required />
              </div>
              <div>
                <Label>Slug</Label>
                <Input className="mt-1" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
              <div>
                <Label>Description</Label>
                <Input className="mt-1" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <Label>Ordre d&apos;affichage</Label>
                <Input type="number" className="mt-1" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setAddOpen(false)} className="flex-1">Annuler</Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Créer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
