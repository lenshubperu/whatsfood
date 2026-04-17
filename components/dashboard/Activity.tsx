"use client";

import { useBusiness } from "@/lib/useBusiness";

export default function Activity() {
  const { business, loading } = useBusiness();

  // 🔄 loading pequeño (opcional)
  if (loading) return null;

  // ⚠️ sin negocio
  if (!business) return null;

  // 🔥 MOCK (luego lo conectamos a DB real)
  const activities = [
    {
      text: "Producto agregado: Hamburguesa",
      time: "Hace 5 min",
    },
    {
      text: "Pedido recibido #1234",
      time: "Hace 1h",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">

      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold">Actividad reciente</p>

        {/* futuro botón */}
        <button className="text-xs text-gray-400 hover:text-black transition">
          Ver todo
        </button>
      </div>

      {activities.length === 0 ? (
        <p className="text-sm text-gray-400">
          No hay actividad aún
        </p>
      ) : (
        <ul className="space-y-3 text-sm text-gray-600">
          {activities.map((item, i) => (
            <li key={i} className="flex justify-between items-center">

              <span className="truncate">
                {item.text}
              </span>

              <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                {item.time}
              </span>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}