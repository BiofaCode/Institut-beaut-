"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type ClosedDate = { id: string; date: Date | string; reason: string | null };

export function ClosedDatesEditor({ closedDates }: { closedDates: ClosedDate[] }) {
  const [dates, setDates] = useState(closedDates);
  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");
  const router = useRouter();

  const handleAdd = async () => {
    if (!newDate) return;
    const res = await fetch("/api/admin/horaires/closed-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newDate, reason: newReason }),
    });
    if (res.ok) {
      const { closedDate } = await res.json();
      setDates((prev) => [...prev, closedDate]);
      setNewDate("");
      setNewReason("");
      router.refresh();
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/horaires/closed-dates?id=${id}`, { method: "DELETE" });
    setDates((prev) => prev.filter((d) => d.id !== id));
    router.refresh();
  };

  const formatClosedDate = (d: Date | string) => {
    try {
      return format(new Date(d), "dd.MM.yyyy", { locale: fr });
    } catch {
      return String(d);
    }
  };

  return (
    <div>
      {/* Add form */}
      <div className="flex gap-2 mb-4">
        <Input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Raison (optionnel)"
          value={newReason}
          onChange={(e) => setNewReason(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleAdd} disabled={!newDate} size="icon">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* List */}
      {dates.length === 0 ? (
        <p className="text-sm text-[#A0A0A0] italic text-center py-6">
          Aucun jour de fermeture exceptionnel
        </p>
      ) : (
        <div className="space-y-2">
          {dates.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between p-3 bg-[#F5F0EB] rounded-lg"
            >
              <div>
                <span className="text-sm font-medium text-[#2C2C2C]">
                  {formatClosedDate(d.date)}
                </span>
                {d.reason && (
                  <span className="text-xs text-[#6B6B6B] ml-2">— {d.reason}</span>
                )}
              </div>
              <button
                onClick={() => handleDelete(d.id)}
                className="text-red-400 hover:text-red-600 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
