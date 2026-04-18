"use client";

import { useBusiness } from "@/hooks/useBusiness";

export default function Activity() {
  const { business, loading } = useBusiness();

  if (loading || !business) return null;

  // 🔥 MOCK (luego DB real)
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
    <div className="bg-card p-6 rounded-lg border border-border shadow-sm">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-foreground">
          Actividad reciente
        </p>

        <button className="text-xs text-muted-foreground hover:text-foreground transition">
          Ver todo
        </button>
      </div>

      {/* EMPTY */}
      {activities.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay actividad aún
        </p>
      ) : (
        <ul className="space-y-3">
          {activities.map((item, i) => (
            <li
              key={i}
              className="flex justify-between items-center text-sm"
            >
              <span className="truncate text-foreground">
                {item.text}
              </span>

              <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                {item.time}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}