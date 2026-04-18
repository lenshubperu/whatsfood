"use client";

import { useBusiness } from "@/hooks/useBusiness";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function MainHeader() {
  const { business, loading } = useBusiness();
  const [updating, setUpdating] = useState(false);
  const pathname = usePathname();

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
      alert("Error al actualizar estado");
    }
  };

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-green-600 text-white flex items-center justify-center rounded-xl font-bold">
            W
          </div>

          <div>
            <p className="font-semibold text-lg">WhatsFood</p>
            <p className="text-sm text-gray-500">
              {loading ? "Cargando..." : business?.name}
            </p>
          </div>
        </div>

        {/* NAV */}
        <div className="hidden md:flex bg-gray-100 rounded-full px-2 py-1 gap-2 text-sm">

          <a
            href="/dashboard"
            className={`px-4 py-1 rounded-full ${
              pathname === "/dashboard"
                ? "bg-white shadow"
                : "text-gray-500"
            }`}
          >
            Inicio
          </a>

          <a
            href="/dashboard/products"
            className={`px-4 py-1 rounded-full ${
              pathname === "/dashboard/products"
                ? "bg-white shadow"
                : "text-gray-500"
            }`}
          >
            Catálogo
          </a>

          <a
            href="/dashboard/store"
            className={`px-4 py-1 rounded-full ${
              pathname === "/dashboard/store"
                ? "bg-white shadow"
                : "text-gray-500"
            }`}
          >
            Tienda
          </a>

          <a
            href="/dashboard/account"
            className={`px-4 py-1 rounded-full ${
              pathname === "/dashboard/account"
                ? "bg-white shadow"
                : "text-gray-500"
            }`}
          >
            Configurar
          </a>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* STATUS */}
          <button
            onClick={toggleStatus}
            disabled={updating || loading}
            className={`px-4 py-2 rounded-full text-white font-medium transition ${
              business?.is_open ? "bg-green-500" : "bg-red-500"
            } ${updating ? "opacity-60" : ""}`}
          >
            {updating
              ? "Actualizando..."
              : business?.is_open
              ? "🟢 Abierto"
              : "🔴 Cerrado"}
          </button>

          {/* AVATAR */}
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            👤
          </div>

        </div>
      </div>
    </header>
  );
}