"use client";

import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { useBusinessContext } from "@/app/context/BusinessProvider";

export default function StatusCard() {
  const { business, loading } = useBusinessContext();
  const [updating, setUpdating] = useState(false);
  const [pressed, setPressed] = useState(false);

  if (loading || !business) return null;

  const isOpen = business.is_open;

  const toggleStatus = async () => {
    if (!business?.id) return;

    setPressed(true);
    setTimeout(() => setPressed(false), 300);

    setUpdating(true);

    const { error } = await supabase
      .from("businesses")
      .update({ is_open: !isOpen })
      .eq("id", business.id);

    setUpdating(false);

    if (error) {
      console.error(error);
      alert("Error al cambiar estado");
    }
  };

  return (
    <div
      className={`
        relative overflow-hidden
        w-full rounded-2xl
        p-4 sm:p-6
        flex items-center justify-between gap-4
        transition-all duration-500 ease-out
        ${
          isOpen
            ? "bg-gradient-to-r from-green-200 via-green-300 to-green-400 shadow-[0_10px_40px_rgba(34,197,94,0.25)]"
            : "bg-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
        }
        hover:scale-[1.01]
      `}
    >
      {/* 🌊 EFECTO */}
      <div
        className={`
          absolute inset-0 pointer-events-none
          transition-all duration-700
          ${pressed ? "opacity-100 scale-100" : "opacity-0 scale-150"}
        `}
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.35) 0%, transparent 70%)",
        }}
      />

      {/* LEFT */}
      <div className="flex items-center gap-3 sm:gap-4 relative z-10 min-w-0">

        {/* ICON */}
        <div
          className={`
            w-12 h-12 sm:w-16 sm:h-16
            rounded-2xl flex items-center justify-center
            transition-all duration-300
            ${
              isOpen
                ? "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                : "bg-gray-500"
            }
          `}
        >
          {isOpen ? (
            <Check className="text-white w-6 h-6 sm:w-8 sm:h-8" />
          ) : (
            <X className="text-white w-6 h-6 sm:w-8 sm:h-8" />
          )}
        </div>

        {/* TEXT */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">

            <span
              className={`
                w-2 h-2 rounded-full
                ${isOpen ? "bg-green-600 animate-pulse" : "bg-gray-600"}
              `}
            />

            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
              {isOpen ? "Abierto" : "Cerrado"}
            </h2>
          </div>

          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
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
          relative z-10
          w-14 h-8 sm:w-16 sm:h-9
          rounded-full flex items-center px-1 cursor-pointer
          transition-all duration-300 ease-in-out
          active:scale-95
          ${
            isOpen
              ? "bg-green-600 shadow-md"
              : "bg-gray-400"
          }
          ${updating ? "opacity-60 pointer-events-none" : ""}
        `}
      >
        <div
          className={`
            w-6 h-6 sm:w-7 sm:h-7
            bg-white rounded-full
            shadow-md transition-all duration-300 ease-in-out
            ${isOpen ? "translate-x-6 sm:translate-x-7" : "translate-x-0"}
          `}
        />
      </div>
    </div>
  );
}