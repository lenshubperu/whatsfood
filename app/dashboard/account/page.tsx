"use client";

import { useState } from "react";
import { CreditCard, Shield } from "lucide-react";
import PlanSection from "./components/PlanSection";
import SecuritySection from "./components/SecuritySection";

export default function AccountPage() {
  const [tab, setTab] = useState<"plan" | "security">("plan");

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab("plan")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            tab === "plan"
              ? "bg-green-500 text-white shadow"
              : "text-gray-600"
          }`}
        >
          <CreditCard size={16} className="inline mr-2" />
          Plan & Facturación
        </button>

        <button
          onClick={() => setTab("security")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            tab === "security"
              ? "bg-green-500 text-white shadow"
              : "text-gray-600"
          }`}
        >
          <Shield size={16} className="inline mr-2" />
          Seguridad
        </button>
      </div>

      {tab === "plan" ? <PlanSection /> : <SecuritySection />}
    </div>
  );
}