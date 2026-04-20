"use client";

import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

/* =========================
   TYPES
========================= */
type Plan = "free" | "pro" | "business";

/* =========================
   COMPONENT
========================= */
export default function PlanSection() {
  const [currentPlan, setCurrentPlan] = useState<Plan>("free");
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH PLAN (Supabase)
  ========================= */
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const { data, error } = await supabase
          .from("businesses")
          .select("plan")
          .single();

        if (data?.plan) {
          setCurrentPlan(data.plan as Plan);
        }
      } catch (err) {
        console.log("Error fetching plan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

  /* =========================
     LOADING STATE
  ========================= */
  if (loading) {
    return (
      <div className="p-6 bg-white rounded-2xl border shadow-sm">
        <p className="text-gray-400">Cargando plan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* PLAN ACTUAL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl p-6 border border-green-200 shadow-sm"
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              Plan {currentPlan.toUpperCase()}
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                ACTIVO
              </span>
            </h2>
            <p className="text-gray-500 mt-1">
              Ideal para empezar a vender online en minutos
            </p>
          </div>

          <span className="text-green-600 text-sm font-medium">
            ● Activo
          </span>
        </div>
      </motion.div>

      {/* PRICING */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* ================= PRO ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -6 }}
          className="relative group"
        >
          {/* Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition"></div>

          <div
            className={`
              relative bg-white rounded-2xl p-6 border-2
              ${
                currentPlan === "pro"
                  ? "border-green-600 scale-[1.03] shadow-[0_20px_60px_rgba(34,197,94,0.4)]"
                  : "border-green-500"
              }
              transition-all duration-300
            `}
          >
            <span className="absolute top-4 right-4 text-xs bg-green-500 text-white px-3 py-1 rounded-full">
              Más popular
            </span>

            <h3 className="text-xl font-semibold">PRO</h3>

            <p className="text-5xl font-bold mt-2">
              S/ 15
              <span className="text-base text-gray-500"> / mes</span>
            </p>

            <p className="text-sm text-gray-500 mt-1">
              La mayoría de negocios empiezan aquí
            </p>

            <ul className="mt-5 space-y-2 text-sm">
              {[
                "Productos ilimitados",
                "Sin branding",
                "Métodos de pago ilimitados",
                "Soporte prioritario",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  {item}
                </li>
              ))}
            </ul>

            <button
              disabled={currentPlan === "pro"}
              className={`
                mt-6 w-full py-3 rounded-xl font-semibold transition-all
                ${
                  currentPlan === "pro"
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-[1.02] shadow-lg"
                }
              `}
            >
              {currentPlan === "pro" ? "Tu plan actual" : "Mejorar plan"}
            </button>
          </div>
        </motion.div>

        {/* ================= BUSINESS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -6 }}
          className={`
            bg-white rounded-2xl p-6 border shadow-md
            ${
              currentPlan === "business"
                ? "border-green-600 scale-[1.03]"
                : ""
            }
          `}
        >
          <h3 className="text-xl font-semibold">BUSINESS</h3>

          <p className="text-5xl font-bold mt-2">
            S/ 29
            <span className="text-base text-gray-500"> / mes</span>
          </p>

          <ul className="mt-5 space-y-2 text-sm">
            {[
              "Todo PRO",
              "Link personalizado",
              "Pedidos en tiempo real",
              "Estadísticas",
              "Soporte 24/7",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                {item}
              </li>
            ))}
          </ul>

          <button
            disabled={currentPlan === "business"}
            className={`
              mt-6 w-full py-3 rounded-xl transition
              ${
                currentPlan === "business"
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "border border-gray-300 hover:bg-gray-50"
              }
            `}
          >
            {currentPlan === "business"
              ? "Tu plan actual"
              : "Mejorar plan"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}