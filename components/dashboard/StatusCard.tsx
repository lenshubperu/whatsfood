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
        w-full rounded-2xl p-6 flex items-center justify-between
        transition-all duration-500 ease-out
        ${
          isOpen
            ? "bg-gradient-to-r from-green-200 via-green-300 to-green-400 shadow-[0_10px_40px_rgba(34,197,94,0.3)]"
            : "bg-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.1)]"
        }
        hover:scale-[1.01]
      `}
    >
      {/* 🌊 ONDA */}
      <div
        className={`
          absolute inset-0 pointer-events-none
          transition-all duration-700
          ${
            pressed
              ? "opacity-100 scale-100"
              : "opacity-0 scale-150"
          }
        `}
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 70%)",
        }}
      />

      {/* LEFT */}
      <div className="flex items-center gap-4 relative z-10">
        <div
          className={`
            w-16 h-16 rounded-2xl flex items-center justify-center
            transition-all duration-300
            ${
              isOpen
                ? "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)]"
                : "bg-gray-500"
            }
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
              className={`
                w-2.5 h-2.5 rounded-full transition-all
                ${
                  isOpen
                    ? "bg-green-600 animate-pulse"
                    : "bg-gray-600"
                }
              `}
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
          relative z-10
          w-16 h-9 rounded-full flex items-center px-1 cursor-pointer
          transition-all duration-300 ease-in-out
          active:scale-95
          hover:scale-105
          ${
            isOpen
              ? "bg-green-600 shadow-lg"
              : "bg-gray-400"
          }
          ${updating ? "opacity-60 pointer-events-none" : ""}
        `}
      >
        <div
          className={`
            w-7 h-7 bg-white rounded-full
            shadow-md transition-all duration-300 ease-in-out
            ${
              isOpen
                ? "translate-x-7 shadow-lg"
                : "translate-x-0"
            }
          `}
        />
      </div>
    </div>
  );
}