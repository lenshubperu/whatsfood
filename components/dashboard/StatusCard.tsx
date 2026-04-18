"use client";

import { useBusiness } from "@/hooks/useBusiness";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import { Check } from "lucide-react";

export default function StatusCard() {
  const { business, loading } = useBusiness();
  const [updating, setUpdating] = useState(false);

  // 🔥 estado local (optimista)
  const [localOpen, setLocalOpen] = useState<boolean | null>(null);

  if (loading || !business) return null;

  const isOpen = localOpen !== null ? localOpen : business.is_open;

  const toggleStatus = async () => {
    if (!business?.id) return;

    const newValue = !isOpen;

    // ⚡ UI inmediata
    setLocalOpen(newValue);
    setUpdating(true);

    const { error } = await supabase
      .from("businesses")
      .update({ is_open: newValue })
      .eq("id", business.id);

    setUpdating(false);

    if (error) {
      console.error(error);
      alert("Error al cambiar estado");

      // rollback si falla
      setLocalOpen(!newValue);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-green-200 bg-gradient-to-r from-[#d1fae5] via-[#bbf7d0] to-[#86efac] p-6 flex items-center justify-between shadow-[0_10px_30px_rgba(34,197,94,0.2)]">
      
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center shadow-md">
          <Check className="text-white w-8 h-8" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isOpen ? "bg-green-500" : "bg-red-500"}`} />
            <h2 className="text-2xl font-bold text-gray-900">
              {isOpen ? "Abierto" : "Cerrado"}
            </h2>
          </div>

          <p className={`mt-1 text-base ${isOpen ? "text-green-800" : "text-red-700"}`}>
            {isOpen
              ? "Recibiendo pedidos en tiempo real"
              : "No estás recibiendo pedidos"}
          </p>
        </div>
      </div>

      {/* TOGGLE */}
      <div
        onClick={toggleStatus}
        className={`
          w-16 h-9 rounded-full flex items-center px-1 cursor-pointer transition
          ${isOpen ? "bg-green-600" : "bg-gray-300"}
          ${updating ? "opacity-60 pointer-events-none" : ""}
        `}
      >
        <div
          className={`
            w-7 h-7 bg-white rounded-full shadow-md transition-all duration-300
            ${isOpen ? "ml-auto" : "ml-0"}
          `}
        />
      </div>
    </div>
  );
}