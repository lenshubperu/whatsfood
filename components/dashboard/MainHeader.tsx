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
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center rounded-lg font-bold">
            W
          </div>

          <div>
            <p className="font-semibold text-lg text-foreground">
              WhatsFood
            </p>
            <p className="text-sm text-muted-foreground">
              {loading ? "Cargando..." : business?.name}
            </p>
          </div>
        </div>

        {/* NAV */}
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
        <div className="flex items-center gap-3">

          {/* STATUS */}
          <button
            onClick={toggleStatus}
            disabled={updating || loading}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              business?.is_open
                ? "bg-primary text-primary-foreground"
                : "bg-destructive text-destructive-foreground"
            } ${updating ? "opacity-60" : "hover:opacity-90"}`}
          >
            {updating
              ? "Actualizando..."
              : business?.is_open
              ? "🟢 Abierto"
              : "🔴 Cerrado"}
          </button>

          {/* AVATAR */}
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm">
            👤
          </div>

        </div>
      </div>
    </header>
  );
}