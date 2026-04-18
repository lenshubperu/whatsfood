"use client";

import {
  Package,
  ShoppingBag,
  Crown,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useBusinessContext } from "@/app/context/BusinessProvider";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type StatsData = {
  products: number;
  orders: number;
};

export default function Stats() {
  const { business } = useBusinessContext();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData>({
    products: 0,
    orders: 0,
  });

  useEffect(() => {
    if (!business?.id) return;

    const loadStats = async () => {
      setLoading(true);

      const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("business_id", business.id);

      let ordersCount = 0;

      try {
        const { count } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("business_id", business.id);

        ordersCount = count || 0;
      } catch {}

      setStats({
        products: productsCount || 0,
        orders: ordersCount,
      });

      setLoading(false);
    };

    loadStats();
  }, [business?.id]);

  const cards = [
    {
      title: "Pedidos",
      value: stats.orders,
      sub: stats.orders === 0 ? "Sin pedidos" : "Hoy",
      icon: ShoppingBag,
      color: "green",
      badge: stats.orders > 0 ? "+12%" : null,
    },
    {
      title: "Productos",
      value: stats.products,
      sub: "En catálogo",
      icon: Package,
      color: "blue",
    },
    {
      title: "Plan",
      value: business?.plan || "Free",
      sub: "Activo",
      icon: Crown,
      color: "purple",
    },
    {
      title: "Actividad",
      value: stats.orders > 0 ? "Activo" : "—",
      sub: "Tiempo real",
      icon: Clock,
      color: "orange",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;

        return (
          <div
            key={i}
            className="
              bg-card border border-border rounded-2xl
              p-4 sm:p-5
              min-h-[120px]
              flex flex-col justify-between
              shadow-sm hover:shadow-lg
              transition-all duration-300
              hover:-translate-y-1
              group
            "
          >
            {/* TOP */}
            <div className="flex items-center justify-between mb-3">

              {/* ICON */}
              <div
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center
                  transition group-hover:scale-110
                  ${
                    card.color === "green"
                      ? "bg-green-100 text-green-600"
                      : card.color === "blue"
                      ? "bg-blue-100 text-blue-600"
                      : card.color === "purple"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-orange-100 text-orange-600"
                  }
                `}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              {/* BADGE */}
              {card.badge && (
                <div className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded-lg text-xs font-medium">
                  <TrendingUp className="w-3 h-3" />
                  {card.badge}
                </div>
              )}
            </div>

            {/* CONTENT */}
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                {card.title}
              </p>

              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                {loading ? (
                  <span className="animate-pulse opacity-50">—</span>
                ) : (
                  <CountUp value={card.value} />
                )}
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                {card.sub}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* =========================
   🔥 COUNT ANIMATION
========================= */
function CountUp({ value }: { value: number | string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (typeof value !== "number") return;

    let start = 0;
    const duration = 500;
    const stepTime = 16;
    const increment = value / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;

      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  if (typeof value !== "number") return <>{value}</>;

  return <>{display}</>;
}