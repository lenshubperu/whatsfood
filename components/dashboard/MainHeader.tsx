"use client";

import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import { useBusinessContext } from "@/app/context/BusinessProvider";

export default function MainHeader() {
  const { business, loading } = useBusinessContext();

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
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-3 md:gap-8 min-w-0">

          {/* LOGO */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
              <span className="font-bold text-sm md:text-lg">W</span>
            </div>

            {/* SOLO DESKTOP */}
            <h1 className="hidden md:block text-xl font-semibold text-foreground">
              WhatsFood
            </h1>
          </div>

          {/* DIVIDER */}
          <div className="hidden md:block h-8 w-px bg-border" />

          {/* RESTAURANTE */}
          <span className="text-sm md:text-base text-foreground font-medium truncate max-w-[120px] md:max-w-none">
            {loading ? "..." : business?.name}
          </span>
        </div>

        {/* NAV (solo desktop) */}
        <div className="hidden md:flex bg-muted rounded-full p-1 gap-1 text-sm">
          {[
            { href: "/dashboard", label: "Inicio" },
            { href: "/dashboard/products", label: "Catálogo" },
            { href: "/dashboard/store", label: "Tienda" },
            { href: "/dashboard/account", label: "Configurar" },
          ].map((item) => {
            const active = pathname === item.href;

            return (
              <a
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 rounded-full transition ${
                  active
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 md:gap-4">

          {/* STATUS */}
          <button
            onClick={toggleStatus}
            disabled={updating || !business}
            className={`
              flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all
              ${
                business?.is_open
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-gray-200 text-gray-700 border border-gray-300"
              }
              ${updating ? "opacity-60" : "hover:opacity-90 active:scale-95"}
            `}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                business?.is_open ? "bg-green-500" : "bg-gray-500"
              }`}
            />

            {/* TEXTO RESPONSIVE */}
            <span className="hidden sm:inline">
              {updating
                ? "Actualizando..."
                : business?.is_open
                ? "Abierto"
                : "Cerrado"}
            </span>

            {/* MOBILE MINI */}
            <span className="sm:hidden">
              {business?.is_open ? "ON" : "OFF"}
            </span>
          </button>

          {/* AVATAR */}
          <div className="w-9 h-9 md:w-10 md:h-10 bg-muted rounded-full flex items-center justify-center cursor-pointer hover:bg-accent transition active:scale-95">
            <User className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
          </div>

        </div>
      </div>
    </header>
  );
}