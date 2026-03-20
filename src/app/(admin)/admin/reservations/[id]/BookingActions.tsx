"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Check, AlertCircle, Loader2 } from "lucide-react";

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";

export function BookingActions({
  bookingId,
  currentStatus,
}: {
  bookingId: string;
  currentStatus: BookingStatus;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const updateStatus = async (status: BookingStatus) => {
    setLoading(status);
    setError("");
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Erreur lors de la mise à jour");
      }
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(null);
    }
  };

  const actions: Array<{
    status: BookingStatus;
    label: string;
    icon: React.ElementType;
    variant: "default" | "secondary" | "destructive" | "outline";
    show: BookingStatus[];
  }> = [
    {
      status: "CONFIRMED",
      label: "Confirmer",
      icon: CheckCircle,
      variant: "default",
      show: ["PENDING"],
    },
    {
      status: "COMPLETED",
      label: "Marquer terminé",
      icon: Check,
      variant: "secondary",
      show: ["CONFIRMED"],
    },
    {
      status: "NO_SHOW",
      label: "Marquer absent",
      icon: AlertCircle,
      variant: "outline",
      show: ["CONFIRMED", "PENDING"],
    },
    {
      status: "CANCELLED",
      label: "Annuler",
      icon: XCircle,
      variant: "destructive",
      show: ["PENDING", "CONFIRMED"],
    },
  ];

  const availableActions = actions.filter((a) => a.show.includes(currentStatus));

  if (availableActions.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D5] p-6">
      <h2 className="font-semibold text-[#2C2C2C] mb-4">Actions</h2>
      <div className="space-y-2">
        {availableActions.map((action) => (
          <Button
            key={action.status}
            variant={action.variant}
            className="w-full"
            onClick={() => updateStatus(action.status)}
            disabled={loading !== null}
          >
            {loading === action.status ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <action.icon className="w-4 h-4" />
            )}
            {action.label}
          </Button>
        ))}
      </div>
      {error && (
        <p className="text-red-600 text-xs mt-2">{error}</p>
      )}
    </div>
  );
}
