"use client";

import { useBusiness } from "@/lib/useBusiness";

export default function StatusCard() {
  const business = useBusiness();

  if (!business) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <p className="text-sm text-gray-500 mb-2">
        Estado del negocio
      </p>

      <p className="mb-4 text-gray-600">
        {business.is_open
          ? "Recibiendo pedidos"
          : "Tu tienda está cerrada"}
      </p>

      <div
        className={`inline-block px-4 py-2 rounded-full text-white font-medium ${
          business.is_open ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {business.is_open ? "🟢 Abierto" : "🔴 Cerrado"}
      </div>
    </div>
  );
}