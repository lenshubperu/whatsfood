"use client";

import { useBusiness } from "@/hooks/useBusiness";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";

export default function StatusCard() {
  const { business, loading } = useBusiness();
  const [updating, setUpdating] = useState(false);

  if (loading || !business) return null;

  const toggleStatus = async () => {
    if (!business?.id) return;

    setUpdating(true);

    const { error } = await supabase
      .from("businesses")
      .update({ is_open: !business.is_open })
      .eq("id", business.id);

    setUpdating(false);

    if (error) {
      console.error(error);
      alert("Error al cambiar estado");
    }
  };

  const isOpen = business.is_open;

  return (
    <div className="bg-card p-6 rounded-lg border border-border shadow-sm flex items-center justify-between gap-6">

      {/* INFO */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          Estado del negocio
        </p>

        <p className="text-base text-foreground font-medium">
          {isOpen
            ? "Recibiendo pedidos en tiempo real"
            : "Tu tienda está cerrada"}
        </p>
      </div>

      {/* ACTION */}
      <button
        onClick={toggleStatus}
        disabled={updating}
        className={`px-5 py-2 rounded-full text-sm font-medium transition ${
          isOpen
            ? "bg-primary text-primary-foreground"
            : "bg-destructive text-destructive-foreground"
        } ${updating ? "opacity-60" : "hover:opacity-90"}`}
      >
        {updating
          ? "Actualizando..."
          : isOpen
          ? "🟢 Abierto"
          : "🔴 Cerrado"}
      </button>

    </div>
  );
}