"use client";

import { useBusiness } from "@/lib/useBusiness";

export default function Stats() {
  const { business, loading } = useBusiness();

  if (loading) return null;
  if (!business) return null;

  return (
    <div className="grid md:grid-cols-4 gap-4">

      {/* PEDIDOS */}
      <div className="bg-white p-5 rounded-2xl shadow-sm">
        <p className="text-sm text-gray-500">Pedidos hoy</p>
        <p className="text-2xl font-bold">0</p>
        <p className="text-xs text-gray-400">
          Aún sin pedidos
        </p>
      </div>

      {/* PRODUCTOS */}
      <div className="bg-white p-5 rounded-2xl shadow-sm">
        <p className="text-sm text-gray-500">Productos</p>
        <p className="text-2xl font-bold">
          {business?.products_count ?? 0}
        </p>
        <p className="text-xs text-gray-400">
          En tu catálogo
        </p>
      </div>

      {/* PLAN */}
      <div className="bg-white p-5 rounded-2xl shadow-sm">
        <p className="text-sm text-gray-500">Plan</p>
        <p className="text-xl font-semibold">
          {business?.plan || "Free"}
        </p>
        <p className="text-xs text-gray-400">
          Activo
        </p>
      </div>

      {/* RENOVACIÓN */}
      <div className="bg-white p-5 rounded-2xl shadow-sm">
        <p className="text-sm text-gray-500">Renovación</p>
        <p className="text-xl font-semibold">
          {business?.renewal_date || "—"}
        </p>
        <p className="text-xs text-gray-400">
          Próximo ciclo
        </p>
      </div>

    </div>
  );
}