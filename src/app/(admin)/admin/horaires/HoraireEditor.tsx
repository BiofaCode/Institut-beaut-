"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save } from "lucide-react";

type Hour = {
  id: string;
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
};

export function HoraireEditor({
  hours,
  dayNames,
}: {
  hours: Hour[];
  dayNames: string[];
}) {
  const [form, setForm] = useState(hours);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch("/api/admin/horaires", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours: form }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const toggle = (i: number) => {
    setForm((prev) =>
      prev.map((h, idx) =>
        idx === i
          ? {
              ...h,
              isClosed: !h.isClosed,
              openTime: h.isClosed ? "09:00" : null,
              closeTime: h.isClosed ? "18:00" : null,
            }
          : h
      )
    );
  };

  return (
    <div>
      <div className="space-y-3">
        {form.map((h, i) => (
          <div key={h.dayOfWeek} className="flex items-center gap-3">
            <div className="w-24 text-sm font-medium text-[#2C2C2C]">{dayNames[h.dayOfWeek]}</div>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={!h.isClosed}
                onChange={() => toggle(i)}
                className="w-4 h-4 accent-[#8B7355]"
              />
              <span className="text-xs text-[#6B6B6B]">Ouvert</span>
            </label>
            {!h.isClosed ? (
              <>
                <Input
                  type="time"
                  value={h.openTime || "09:00"}
                  onChange={(e) =>
                    setForm((prev) =>
                      prev.map((x, idx) => idx === i ? { ...x, openTime: e.target.value } : x)
                    )
                  }
                  className="w-28 text-sm h-8"
                />
                <span className="text-[#6B6B6B] text-sm">—</span>
                <Input
                  type="time"
                  value={h.closeTime || "18:00"}
                  onChange={(e) =>
                    setForm((prev) =>
                      prev.map((x, idx) => idx === i ? { ...x, closeTime: e.target.value } : x)
                    )
                  }
                  className="w-28 text-sm h-8"
                />
              </>
            ) : (
              <span className="text-sm text-red-400 italic">Fermé</span>
            )}
          </div>
        ))}
      </div>

      <Button onClick={handleSave} disabled={loading} className="mt-6">
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : saved ? (
          "✓ Sauvegardé"
        ) : (
          <>
            <Save className="w-4 h-4" /> Enregistrer
          </>
        )}
      </Button>
    </div>
  );
}
