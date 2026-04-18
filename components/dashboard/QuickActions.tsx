"use client";

import { useRouter } from "next/navigation";
import { useBusiness } from "@/hooks/useBusiness";

export default function QuickActions() {
  const router = useRouter();
  const { business, loading } = useBusiness();

  if (loading || !business) return null;

  const storeUrl = business.slug
    ? `https://whatsfoodperu.com/${business.slug}`
    : null;

  return (
    <div>
      <p className="font-semibold mb-4 text-foreground">
        Acciones rápidas
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* ➕ AGREGAR PRODUCTO */}
        <button
          onClick={() => router.push("/dashboard/products")}
          className="bg-primary text-primary-foreground p-6 rounded-lg text-left transition hover:opacity-90 shadow-sm"
        >
          <p className="text-lg font-semibold mb-1">
            ➕ Agregar producto
          </p>
          <p className="text-sm opacity-80">
            Crea nuevos productos para tu menú
          </p>
        </button>

        {/* ✏️ EDITAR CATÁLOGO */}
        <button
          onClick={() => router.push("/dashboard/products")}
          className="bg-card p-6 rounded-lg border border-border text-left transition hover:bg-muted shadow-sm"
        >
          <p className="text-lg font-semibold mb-1 text-foreground">
            ✏️ Editar catálogo
          </p>
          <p className="text-sm text-muted-foreground">
            Gestiona productos y categorías
          </p>
        </button>

        {/* 🔗 VER TIENDA */}
        <button
          onClick={() => {
            if (storeUrl) window.open(storeUrl, "_blank");
          }}
          disabled={!storeUrl}
          className="bg-card p-6 rounded-lg border border-border text-left transition hover:bg-muted shadow-sm disabled:opacity-50"
        >
          <p className="text-lg font-semibold mb-1 text-foreground">
            🔗 Ver tienda
          </p>
          <p className="text-sm text-muted-foreground">
            Abre tu tienda como cliente
          </p>
        </button>

      </div>
    </div>
  );
}