"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X, Loader2 } from "lucide-react";
import { slugify } from "@/lib/utils";

type Category = { id: string; name: string };

export function AddServiceButton({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    duration: 60,
    price: "",
    categoryId: categories[0]?.id || "",
    isActive: true,
    order: 0,
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      if (res.ok) {
        setOpen(false);
        setForm({ name: "", slug: "", description: "", duration: 60, price: "", categoryId: categories[0]?.id || "", isActive: true, order: 0 });
        router.refresh();
      } else {
        const d = await res.json();
        setError(d.error || "Erreur");
      }
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4" /> Ajouter un service
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#2C2C2C]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Nouveau service
              </h2>
              <button onClick={() => setOpen(false)} className="text-[#6B6B6B] hover:text-[#2C2C2C]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label>Slug</Label>
                <Input
                  className="mt-1"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea className="mt-1" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Durée (min) *</Label>
                  <Input
                    type="number"
                    className="mt-1"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                    min={15}
                    step={15}
                    required
                  />
                </div>
                <div>
                  <Label>Prix CHF *</Label>
                  <Input
                    type="number"
                    className="mt-1"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    min={0}
                    step={0.5}
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Catégorie *</Label>
                <select
                  className="mt-1 w-full h-10 rounded-lg border border-[#E8E0D5] px-3 text-sm text-[#2C2C2C] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
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
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 accent-[#8B7355]"
                />
                <label htmlFor="isActive" className="text-sm text-[#2C2C2C]">Service actif</label>
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                  Annuler
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Créer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
