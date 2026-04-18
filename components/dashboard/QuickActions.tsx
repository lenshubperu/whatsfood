"use client";

import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  ExternalLink,
  BarChart3,
  Crown,
} from "lucide-react";
import { useBusiness } from "@/hooks/useBusiness";
import { motion } from "framer-motion";

export default function QuickActions() {
  const router = useRouter();
  const { business, loading } = useBusiness();

  if (loading || !business) return null;

  const storeUrl = `https://whatsfoodperu.com/${business.slug}`;

  const isPro = business.plan === "PRO";

  const actions = [
    {
      title: "Agregar producto",
      desc: "Crea un nuevo producto",
      icon: Plus,
      primary: true,
      onClick: () => router.push("/dashboard/products"),
    },
    {
      title: "Editar catálogo",
      desc: "Gestiona tus productos",
      icon: Pencil,
      onClick: () => router.push("/dashboard/products"),
    },
    {
      title: "Ver tienda",
      desc: "Vista de cliente",
      icon: ExternalLink,
      onClick: () => window.open(storeUrl, "_blank"),
      disabled: !business.slug,
    },
    {
      title: "Ver estadísticas",
      desc: isPro ? "Análisis de ventas" : "Solo plan PRO",
      icon: BarChart3,
      onClick: () =>
        isPro
          ? alert("Abrir analytics 🚀")
          : alert("Actualiza a PRO 🔥"),
      locked: !isPro,
    },
  ];

  return (
    <div>
      <p className="font-semibold mb-4 text-foreground">
        Acciones rápidas
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {actions.map((item, i) => {
          const Icon = item.icon;

          return (
            <motion.button
              key={i}
              onClick={item.onClick}
              disabled={item.disabled}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`
                relative text-left p-6 rounded-2xl border overflow-hidden
                transition-all duration-300 group
                ${
                  item.primary
                    ? "bg-green-600 text-white border-green-600 shadow-xl"
                    : "bg-card border-border hover:border-green-300 hover:shadow-lg"
                }
                ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {/* 🔥 Glow animado */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,white,transparent_60%)] opacity-20" />
              </div>

              {/* 🔒 LOCK PRO */}
              {item.locked && (
                <div className="absolute top-3 right-3 flex items-center gap-1 text-xs bg-black/20 px-2 py-1 rounded-full">
                  <Crown className="w-3 h-3" />
                  PRO
                </div>
              )}

              {/* ICON */}
              <div
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center mb-4
                  ${
                    item.primary
                      ? "bg-white/20"
                      : "bg-muted group-hover:bg-green-100"
                  }
                `}
              >
                <Icon
                  className={`
                    w-5 h-5
                    ${
                      item.primary
                        ? "text-white"
                        : "text-muted-foreground group-hover:text-green-600"
                    }
                  `}
                />
              </div>

              {/* TEXT */}
              <p
                className={`text-base font-semibold ${
                  item.primary ? "text-white" : "text-foreground"
                }`}
              >
                {item.title}
              </p>

              <p
                className={`text-sm mt-1 ${
                  item.primary ? "text-white/80" : "text-muted-foreground"
                }`}
              >
                {item.desc}
              </p>

              {/* ⚡ línea animada */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-green-500 group-hover:w-full transition-all duration-300" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}