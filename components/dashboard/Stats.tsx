"use client";

import type { Business } from "@/hooks/useBusiness";

export default function Stats({ business }: { business: Business }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

      {/* PEDIDOS */}
      <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
        <p className="text-sm text-muted-foreground">Pedidos hoy</p>

        <p className="text-3xl font-semibold text-foreground mt-2">
          0
        </p>

        <p className="text-xs text-muted-foreground mt-1">
          Aún sin pedidos
        </p>
      </div>

      {/* PRODUCTOS */}
      <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
        <p className="text-sm text-muted-foreground">Productos</p>

        <p className="text-3xl font-semibold text-foreground mt-2">
          {business.products_count ?? 0}
        </p>

        <p className="text-xs text-muted-foreground mt-1">
          En tu catálogo
        </p>
      </div>

      {/* PLAN */}
      <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
        <p className="text-sm text-muted-foreground">Plan</p>

        <p className="text-xl font-semibold text-foreground mt-2">
          {business.plan || "Free"}
        </p>

        <p className="text-xs text-muted-foreground mt-1">
          Activo
        </p>
      </div>

      {/* RENOVACIÓN */}
      <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
        <p className="text-sm text-muted-foreground">Renovación</p>

        <p className="text-xl font-semibold text-foreground mt-2">
          {business.renewal_date || "—"}
        </p>

        <p className="text-xs text-muted-foreground mt-1">
          Próximo ciclo
        </p>
      </div>

    </div>
  );
}