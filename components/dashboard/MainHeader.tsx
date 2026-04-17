"use client";

import { useBusiness } from "@/lib/useBusiness";
import { supabase } from "@/lib/supabaseClient";

export default function MainHeader() {
  const business = useBusiness();

  const toggleStatus = async () => {
    if (!business) return;

    await supabase
      .from("businesses")
      .update({ is_open: !business.is_open })
      .eq("id", business.id);

    window.location.reload();
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
              {business?.name || "Cargando..."}
            </p>
          </div>
        </div>

        {/* NAV */}
        <div className="hidden md:flex bg-gray-100 rounded-full px-2 py-1 gap-2 text-sm">
          <a href="/dashboard" className="px-4 py-1 rounded-full bg-white shadow">
            Mi cuenta
          </a>
          <a href="/dashboard/products" className="px-4 py-1">
            Catálogo
          </a>
          <a href="/dashboard/store" className="px-4 py-1">
            Link tienda
          </a>
          <a href="/dashboard/account" className="px-4 py-1">
            Configurar
          </a>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* STATUS */}
          <button
            onClick={toggleStatus}
            className={`px-4 py-2 rounded-full text-white font-medium ${
              business?.is_open ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {business?.is_open ? "🟢 Abierto" : "🔴 Cerrado"}
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