"use client";

import { Package, ShoppingBag, Clock } from "lucide-react";
import type { Business } from "@/hooks/useBusiness";

type ActivityItem = {
  id: string;
  type: "product" | "order";
  message: string;
  time: string;
};

export default function Activity({ business }: { business: Business }) {
  // 🔥 MOCK (luego DB real)
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "product",
      message: "Producto agregado: Hamburguesa",
      time: "Hace 5 min",
    },
    {
      id: "2",
      type: "order",
      message: "Pedido recibido #1234",
      time: "Hace 1h",
    },
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
          <Clock className="w-5 h-5" />
        </div>

        <div>
          <h3 className="font-semibold text-foreground">
            Actividad reciente
          </h3>
          <p className="text-xs text-muted-foreground">
            Últimas acciones en tu cuenta
          </p>
        </div>
      </div>

      {/* EMPTY */}
      {activities.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay actividad aún
        </p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-4 bg-muted rounded-lg border border-border hover:bg-accent transition"
            >
              {/* ICON */}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  activity.type === "product"
                    ? "bg-primary/10 text-primary"
                    : "bg-green-500/10 text-green-600"
                }`}
              >
                {activity.type === "product" ? (
                  <Package className="w-5 h-5" />
                ) : (
                  <ShoppingBag className="w-5 h-5" />
                )}
              </div>

              {/* TEXT */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.message}
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}