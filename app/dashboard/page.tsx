"use client";

import { useBusiness } from "@/lib/useBusiness";

import StatusCard from "@/components/dashboard/StatusCard";
import Stats from "@/components/dashboard/Stats";
import StoreLink from "@/components/dashboard/StoreLink";
import QuickActions from "@/components/dashboard/QuickActions";
import WhatsAppBlock from "@/components/dashboard/WhatsAppBlock";
import Activity from "@/components/dashboard/Activity";

export default function DashboardPage() {
  const { business, loading } = useBusiness();

  // 🔄 Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-gray-500">Cargando dashboard...</p>
      </div>
    );
  }

  // ⚠️ Sin negocio
  if (!business) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <p className="text-lg font-semibold">No tienes negocio aún</p>
        <p className="text-gray-500 text-sm">
          Configura tu restaurante para empezar
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* 🔥 ESTADO DEL NEGOCIO */}
      <StatusCard />

      {/* 📊 STATS */}
      <Stats />

      {/* 🔗 LINK DE TIENDA */}
      <StoreLink />

      {/* ⚡ ACCIONES */}
      <QuickActions />

      {/* 📲 WHATSAPP */}
      <WhatsAppBlock />

      {/* 🧾 ACTIVIDAD */}
      <Activity />

    </div>
  );
}