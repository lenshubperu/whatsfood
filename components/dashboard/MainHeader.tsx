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
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
              <span className="font-bold text-lg">W</span>
            </div>

            <h1 className="text-xl font-semibold text-foreground">
              WhatsFood
            </h1>
          </div>

          <div className="h-8 w-px bg-border" />

          <span className="text-foreground font-medium">
            {loading ? "..." : business?.name}
          </span>
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
        <div className="flex items-center gap-4">

          {/* STATUS */}
          <button
            onClick={toggleStatus}
            disabled={updating || !business}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
              ${
                business?.is_open
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-gray-200 text-gray-700 border border-gray-300"
              }
              ${updating ? "opacity-60" : "hover:opacity-90"}
            `}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                business?.is_open ? "bg-green-500" : "bg-gray-500"
              }`}
            />

            {updating
              ? "Actualizando..."
              : business?.is_open
              ? "Abierto"
              : "Cerrado"}
          </button>

          {/* AVATAR */}
          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center cursor-pointer hover:bg-accent transition">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>

        </div>
      </div>
    </header>
  );
}