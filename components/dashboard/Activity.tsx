"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useBusiness } from "@/hooks/useBusiness";
import {
  Package,
  ShoppingBag,
  Pencil,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ActivityItem = {
  id: string;
  type: "order" | "product" | "edit";
  title: string;
  description: string;
  created_at: string;
};

export default function Activity() {
  const { business, loading } = useBusiness();
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    if (!business?.id) return;

    let channel: any;

    const loadInitial = async () => {
      // 🔥 últimos eventos (puedes cambiar tabla si quieres)
      const { data } = await supabase
        .from("activity_logs") // 👉 si no tienes esta tabla, luego te la creo
        .select("*")
        .eq("business_id", business.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (data) {
        setActivities(data);
      }
    };

    loadInitial();

    // ⚡ REALTIME
    channel = supabase
      .channel(`activity-${business.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_logs",
          filter: `business_id=eq.${business.id}`,
        },
        (payload) => {
          const newItem = payload.new as ActivityItem;

          setActivities((prev) => [newItem, ...prev.slice(0, 9)]);
        }
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [business?.id]);

  if (loading || !business) return null;

  return (
    <div className="rounded-3xl border border-border bg-card shadow-xl p-6 md:p-8">

      {/* 🔥 HEADER FIGMA */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>

          <div>
            <h3 className="font-semibold text-lg text-foreground">
              Actividad en vivo
            </h3>
            <p className="text-sm text-muted-foreground">
              Actualizaciones en tiempo real
            </p>
          </div>
        </div>

        {/* 🟢 LIVE BADGE */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          EN VIVO
        </div>
      </div>

      {/* EMPTY */}
      {activities.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay actividad aún
        </p>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {activities.map((item) => {
              const Icon =
                item.type === "order"
                  ? ShoppingBag
                  : item.type === "product"
                  ? Package
                  : Pencil;

              const color =
                item.type === "order"
                  ? "green"
                  : item.type === "product"
                  ? "blue"
                  : "orange";

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`
                    flex items-start gap-3 p-4 rounded-xl border
                    bg-muted hover:bg-accent transition
                  `}
                >
                  {/* ICON */}
                  <div
                    className={`
                      w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
                      ${
                        color === "green"
                          ? "bg-green-500/10 text-green-600"
                          : color === "blue"
                          ? "bg-blue-500/10 text-blue-600"
                          : "bg-orange-500/10 text-orange-600"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* TEXT */}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(item.created_at)}
                    </p>
                  </div>

                  {/* DOT */}
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/* 🧠 helper tiempo */
function formatTime(date: string) {
  const diff = Math.floor(
    (Date.now() - new Date(date).getTime()) / 60000
  );

  if (diff < 1) return "Ahora";
  if (diff < 60) return `Hace ${diff} min`;
  if (diff < 1440) return `Hace ${Math.floor(diff / 60)} h`;
  return `Hace ${Math.floor(diff / 1440)} días`;
}