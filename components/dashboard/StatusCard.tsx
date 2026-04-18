"use client";

import { useBusiness } from "@/lib/useBusiness";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";

export default function StatusCard() {
  const { business, loading } = useBusiness();
  const [updating, setUpdating] = useState(false);

  if (loading) return null;
  if (!business) return null;

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

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">

      <p className="text-sm text-gray-500 mb-2">
        Estado del negocio
      </p>

      <p className="mb-4 text-gray-600">
        {business.is_open
          ? "Recibiendo pedidos en tiempo real"
          : "Tu tienda está cerrada"}
      </p>

      <button
        onClick={toggleStatus}
        disabled={updating}
        className={`inline-block px-4 py-2 rounded-full text-white font-medium transition ${
          business.is_open ? "bg-green-500" : "bg-red-500"
        } ${updating ? "opacity-60" : ""}`}
      >
        {updating
          ? "Actualizando..."
          : business.is_open
          ? "🟢 Abierto"
          : "🔴 Cerrado"}
      </button>

    </div>
  );
}