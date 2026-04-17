"use client";

import { useBusiness } from "@/lib/useBusiness";

export default function Stats() {
  const business = useBusiness();

  return (
    <div className="grid md:grid-cols-4 gap-4">

      <div className="bg-white p-5 rounded-2xl shadow-sm">
        <p className="text-sm text-gray-500">Pedidos hoy</p>
        <p className="text-2xl font-bold">24</p>
        <p className="text-xs text-green-500">+12% vs ayer</p>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm">
        <p className="text-sm text-gray-500">Productos</p>
        <p className="text-2xl font-bold">48</p>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm">
        <p className="text-sm text-gray-500">Plan</p>
        <p className="text-xl font-semibold">PRO</p>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm">
        <p className="text-sm text-gray-500">Renovación</p>
        <p className="text-xl font-semibold">15 Mayo</p>
      </div>

    </div>
  );
}