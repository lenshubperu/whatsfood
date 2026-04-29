"use client";

import PlanSection from "@/components/PlanSection";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 md:px-8 py-10">

      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">
          Planes diseñados para crecer contigo
        </h1>

        <p className="text-gray-500 mt-4 max-w-xl mx-auto">
          Empieza gratis y mejora a PRO o BUSINESS cuando tu negocio lo necesite.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <PlanSection selectable />
      </div>

      <div className="text-center mt-14">
        <p className="text-sm text-gray-500 mb-4">
          ¿Solo quieres probar primero?
        </p>

        <button
          onClick={() => {
            localStorage.setItem("selectedPlan", "free");
            window.location.href = "/register";
          }}
          className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-medium transition shadow-lg hover:shadow-xl"
        >
          Empezar con plan gratuito
        </button>
      </div>

    </main>
  );
}