"use client";

import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/* =========================
   TYPES
========================= */
type Plan = "free" | "pro" | "business";

/* =========================
   MOCK (luego reemplazas)
========================= */
const getUserPlan = async (): Promise<Plan> => {
  return "free"; // prueba: "pro" | "business"
};

export default function PlanSection() {
  const [currentPlan, setCurrentPlan] = useState<Plan>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      const plan = await getUserPlan();
      setCurrentPlan(plan);
      setLoading(false);
    };

    fetchPlan();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-2xl border shadow-sm animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded mb-3" />
        <div className="h-4 w-64 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-2xl font-semibold">
          Plan actual:{" "}
          <span className="text-green-600">{currentPlan.toUpperCase()}</span>
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Empieza gratis y mejora cuando quieras
        </p>
      </div>

      {/* ================= PRICING ================= */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* ================= FREE ================= */}
        <motion.div
          whileHover={{ y: -4 }}
          className={`bg-white rounded-2xl p-6 border ${
            currentPlan === "free"
              ? "border-green-600 scale-[1.02]"
              : ""
          }`}
        >
          <h3 className="text-lg font-semibold">FREE</h3>

          <p className="text-4xl font-bold mt-2">Gratis</p>

          <p className="text-sm text-gray-500 mt-1">
            Ideal para empezar a vender online en minutos
          </p>

          <ul className="mt-5 space-y-2 text-sm">
            {[
              "Hasta 10 productos",
              "Link con branding WhatsFood",
              "Recibe pedidos directo en tu WhatsApp",
              "Hasta 3 métodos de pago",
              "Soporte básico",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                {item}
              </li>
            ))}
          </ul>

          <button
            disabled={currentPlan === "free"}
            className={`mt-6 w-full py-3 rounded-xl ${
              currentPlan === "free"
                ? "bg-gray-200 text-gray-500"
                : "border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {currentPlan === "free"
  ? "Tu plan actual"
  : "Plan gratuito"}
          </button>
        </motion.div>

        {/* ================= PRO ================= */}
        <motion.div
          whileHover={{ y: -6 }}
          className="relative group"
        >
          {/* Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-xl opacity-30"></div>

          <div
            className={`relative bg-white rounded-2xl p-6 border-2 ${
              currentPlan === "pro"
                ? "border-green-600 scale-[1.05] shadow-xl"
                : "border-green-500"
            }`}
          >
            <span className="absolute top-4 right-4 text-xs bg-green-500 text-white px-3 py-1 rounded-full">
              Más popular
            </span>

            <h3 className="text-lg font-semibold">PRO</h3>

            <p className="text-5xl font-bold mt-2">
              S/ 15
              <span className="text-base text-gray-500"> / mes</span>
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Más pedidos, más control y una tienda 100% profesional
            </p>

            <ul className="mt-5 space-y-2 text-sm">
              {[
                "Productos ilimitados",
                "Tienda sin branding",
                "Recibe pedidos directo en tu WhatsApp",
                "Métodos de pago ilimitados",
                "Prioridad en pedidos",
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
              className={`mt-6 w-full py-3 rounded-xl font-semibold ${
                currentPlan === "pro"
                  ? "bg-gray-200 text-gray-500"
                  : "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:scale-[1.02]"
              }`}
            >
              {currentPlan === "pro"
                ? "Tu plan actual"
                : "Mejorar plan"}
            </button>
          </div>
        </motion.div>

        {/* ================= BUSINESS ================= */}
        <motion.div
          whileHover={{ y: -4 }}
          className={`bg-white rounded-2xl p-6 border ${
            currentPlan === "business"
              ? "border-green-600 scale-[1.02]"
              : ""
          }`}
        >
          <h3 className="text-lg font-semibold">BUSINESS</h3>

          <p className="text-5xl font-bold mt-2">
            S/ 29
            <span className="text-base text-gray-500"> / mes</span>
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Para negocios que quieren escalar y vender sin límites
          </p>

          <ul className="mt-5 space-y-2 text-sm">
            {[
              "Todo lo de PRO",
              "Link personalizado",
              "Pedidos en tiempo real",
              "Estadísticas de ventas",
              "Soporte 24/7 prioritario",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                {item}
              </li>
            ))}
          </ul>

          <button
            disabled={currentPlan === "business"}
            className={`mt-6 w-full py-3 rounded-xl ${
              currentPlan === "business"
                ? "bg-gray-200 text-gray-500"
                : "border border-gray-300 hover:bg-gray-50"
            }`}
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