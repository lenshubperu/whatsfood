"use client";

import { Plus, Package } from "lucide-react";

export default function ProductsHeader({
  count,
  onAdd,
}: {
  count: number;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Catálogo</h1>
        <p className="text-muted-foreground">
          Gestiona los productos de tu menú
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card">
          <Package className="w-4 h-4" />
          <span className="text-sm font-medium">{count} productos</span>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition"
        >
          <Plus className="w-4 h-4" />
          Agregar producto
        </button>
      </div>
    </div>
  );
}