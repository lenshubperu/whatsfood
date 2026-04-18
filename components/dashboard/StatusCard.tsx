"use client";

import { useBusiness } from "@/hooks/useBusiness";
import { supabase } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";

export default function StatusCard() {
  const { business, loading } = useBusiness();

  const [updating, setUpdating] = useState(false);
  const [localOpen, setLocalOpen] = useState<boolean | null>(null);

  // 🔥 sincroniza con DB cuando cambia
  useEffect(() => {
    if (business) {
      setLocalOpen(business.is_open);
    }
  }, [business]);

  if (loading || !business) return null;

  const isOpen = localOpen ?? business.is_open;

  const toggleStatus = async () => {
    const newValue = !isOpen;

    setLocalOpen(newValue);
    setUpdating(true);

    const { error } = await supabase
      .from("businesses")
      .update({ is_open: newValue })
      .eq("id", business.id);

    setUpdating(false);

    if (error) {
      console.error(error);
      setLocalOpen(!newValue);
      alert("Error al cambiar estado");
    }
  };

  return (
    <div
      className={`
        w-full rounded-2xl p-6 flex items-center justify-between transition-all duration-300
        ${
          isOpen
            ? "bg-gradient-to-r from-green-200 via-green-300 to-green-400 shadow-green-200"
            : "bg-gray-200 shadow-gray-200"
        }
      `}
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <div
          className={`
            w-16 h-16 rounded-2xl flex items-center justify-center shadow-md
            ${isOpen ? "bg-green-500" : "bg-gray-500"}
          `}
        >
          {isOpen ? (
            <Check className="text-white w-8 h-8" />
          ) : (
            <X className="text-white w-8 h-8" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isOpen ? "bg-green-600" : "bg-gray-600"
              }`}
            />

            <h2 className="text-2xl font-bold">
              {isOpen ? "Abierto" : "Cerrado"}
            </h2>
          </div>

          <p className="mt-1 text-sm">
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
          ${isOpen ? "bg-green-600" : "bg-gray-400"}
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