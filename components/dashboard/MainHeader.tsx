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

  const navItems = [
    { href: "/dashboard", label: "Inicio" },
    { href: "/dashboard/products", label: "Catálogo" },
    { href: "/dashboard/store", label: "Tienda" },
    { href: "/dashboard/account", label: "Configurar" },
  ];

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

  const initial = business?.name?.charAt(0)?.toUpperCase() || "W";

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      
      {/* 🔥 TOP BAR */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">

        {/* LEFT */}
        <div className="flex items-center gap-3 min-w-0">

          {/* BRAND */}
          <h1 className="text-lg font-semibold">
            WhatsFood
          </h1>

          {/* BUSINESS NAME */}
          <span className="text-sm sm:text-base font-medium truncate max-w-[120px] sm:max-w-[200px]">
            {loading ? "..." : business?.name}
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* STATUS */}
          <button
            onClick={toggleStatus}
            disabled={updating || !business}
            className={`
              flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all
              ${
                business?.is_open
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-gray-200 text-gray-700 border border-gray-300"
              }
              ${updating ? "opacity-60" : "active:scale-95"}
            `}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                business?.is_open ? "bg-green-500" : "bg-gray-500"
              }`}
            />

            <span className="hidden sm:inline">
              {updating
                ? "Actualizando..."
                : business?.is_open
                ? "Abierto"
                : "Cerrado"}
            </span>

            <span className="sm:hidden">
              {business?.is_open ? "ON" : "OFF"}
            </span>
          </button>

          {/* 🔥 LOGO COMO AVATAR */}
          <div className="w-9 h-9 rounded-full overflow-hidden bg-muted flex items-center justify-center cursor-pointer hover:bg-accent transition active:scale-95">
            {business?.logo_url ? (
              <img
                src={business.logo_url}
                alt="logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-muted-foreground">
                {initial}
              </span>
            )}
          </div>

        </div>
      </div>

      {/* 🔥 MOBILE NAV */}
      <div className="md:hidden border-t border-border">
        <div className="flex gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <a
                key={item.href}
                href={item.href}
                className={`
                  whitespace-nowrap px-4 py-1.5 rounded-full text-sm transition
                  ${
                    active
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground"
                  }
                `}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>

      {/* 🔥 DESKTOP NAV */}
      <div className="hidden md:flex justify-center pb-3">
        <div className="bg-muted rounded-full p-1 flex gap-1 text-sm">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <a
                key={item.href}
                href={item.href}
                className={`
                  px-4 py-1.5 rounded-full transition
                  ${
                    active
                      ? "bg-card text-foreground shadow-sm border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>

    </header>
  );
}