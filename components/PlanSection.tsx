"use client";

import { Check, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

/* =========================
   TYPES
========================= */
type Plan = "free" | "pro" | "business";

type Props = {
  selectable?: boolean;
};

/* =========================
   MOCK (luego Supabase)
========================= */
const getUserPlan = async (): Promise<Plan> => {
  return "free";
};

export default function PlanSection({ selectable = false }: Props) {
  const [currentPlan, setCurrentPlan] = useState<Plan>("free");

  useEffect(() => {
    const fetchPlan = async () => {
      const plan = await getUserPlan();
      setCurrentPlan(plan);
    };
    fetchPlan();
  }, []);

  const handleSelectPlan = (plan: Plan) => {
    localStorage.setItem("selectedPlan", plan);
    window.location.href = "/register";
  };

  return (
    <div className="space-y-8">

      {/* 🔙 BOTÓN VOLVER */}
      <div className="flex items-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition"
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </Link>
      </div>

      {/* ================= PLAN ACTUAL ================= */}
      {!selectable && (
        <div className="bg-white rounded-2xl p-6 border border-green-200 shadow-sm">
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

          <ul className="mt-6 space-y-3 text-gray-700">
            {[
              "Hasta 10 productos",
              "Link de tienda con branding WhatsFood",
              "Recibe pedidos directo en tu WhatsApp",
              "Hasta 3 métodos de pago",
              "Soporte básico",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check size={18} className="text-green-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ================= PLANES ================= */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* ================= FREE ================= */}
        <div
          className={`bg-white rounded-2xl p-6 border ${
            currentPlan === "free" && !selectable
              ? "border-green-500"
              : "border-gray-200"
          }`}
        >
          <h3 className="text-lg font-semibold">FREE</h3>

          <p className="text-3xl font-bold mt-2">Gratis</p>

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
                <Check size={16} className="text-green-500" />
                {item}
              </li>
            ))}
          </ul>

          <button
            onClick={() => selectable && handleSelectPlan("free")}
            disabled={!selectable && currentPlan === "free"}
            className={`
              mt-6 w-full py-2 rounded-xl font-medium transition
              ${
                !selectable && currentPlan === "free"
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "border border-gray-300 hover:bg-gray-50"
              }
            `}
          >
            {selectable
              ? "Elegir plan"
              : currentPlan === "free"
              ? "Tu plan actual"
              : "Cambiar a Free"}
          </button>
        </div>

        {/* ================= PRO ================= */}
        <div className="relative bg-white rounded-2xl p-6 border-2 border-green-500 shadow-md">
          <span className="absolute top-4 right-4 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
            Más popular
          </span>

          <h3 className="text-lg font-semibold">PRO</h3>

          <p className="text-4xl font-bold mt-2">
            S/ 15
            <span className="text-sm text-gray-500"> / mes</span>
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Más pedidos, más control y una tienda 100% profesional
          </p>

          <ul className="mt-5 space-y-2 text-sm">
            {[
              "Productos ilimitados",
              "Tienda sin branding (más profesional)",
              "Recibe pedidos directo en tu WhatsApp",
              "Métodos de pago ilimitados",
              "Prioridad en pedidos",
              "Soporte prioritario",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                {item}
              </li>
            ))}
          </ul>

          <button
            onClick={() => selectable && handleSelectPlan("pro")}
            disabled={!selectable && currentPlan === "pro"}
            className={`
              mt-6 w-full py-2 rounded-xl font-semibold transition
              ${
                !selectable && currentPlan === "pro"
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }
            `}
          >
            {selectable
              ? "Elegir plan"
              : currentPlan === "pro"
              ? "Tu plan actual"
              : "Mejorar plan"}
          </button>
        </div>

        {/* ================= BUSINESS ================= */}
        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <h3 className="text-lg font-semibold">BUSINESS</h3>

          <p className="text-4xl font-bold mt-2">
            S/ 29
            <span className="text-sm text-gray-500"> / mes</span>
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Para negocios que quieren escalar y vender sin límites
          </p>

          <ul className="mt-5 space-y-2 text-sm">
            {[
              "Todo lo de PRO",
              "Link personalizado (mitienda.whatsfoodperu.com)",
              "Pedidos en tiempo real (panel en vivo)",
              "Estadísticas de ventas y pedidos",
              "Soporte 24/7 prioritario",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                {item}
              </li>
            ))}
          </ul>

          <button
            onClick={() => selectable && handleSelectPlan("business")}
            disabled={!selectable && currentPlan === "business"}
            className={`
              mt-6 w-full py-2 rounded-xl font-medium transition
              ${
                !selectable && currentPlan === "business"
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "border border-gray-300 hover:bg-gray-50"
              }
            `}
          >
            {selectable
              ? "Elegir plan"
              : currentPlan === "business"
              ? "Tu plan actual"
              : "Mejorar plan"}
          </button>
        </div>

      </div>
    </div>
  );
}