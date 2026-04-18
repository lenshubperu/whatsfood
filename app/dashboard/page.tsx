"use client";

import { useBusinessContext } from "@/app/context/BusinessProvider";

import StatusCard from "@/components/dashboard/StatusCard";
import Stats from "@/components/dashboard/Stats";
import StoreLink from "@/components/dashboard/StoreLink";
import QuickActions from "@/components/dashboard/QuickActions";
import WhatsAppBlock from "@/components/dashboard/WhatsAppBlock";
import Activity from "@/components/dashboard/Activity";

export default function DashboardPage() {
  const { business, loading } = useBusinessContext();

  // 🔄 Loading PRO (no pantalla vacía fea)
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">

        <div className="h-32 rounded-2xl bg-muted" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-muted" />
          ))}
        </div>

        <div className="h-40 rounded-2xl bg-muted" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 rounded-2xl bg-muted" />
          <div className="h-64 rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  // ⚠️ Error real
  if (!business) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center">
        <p className="text-lg font-semibold text-foreground">
          No se pudo cargar tu negocio
        </p>

        <p className="text-sm text-muted-foreground">
          Revisa configuración (RLS / conexión)
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">

      {/* 🔥 HERO */}
      <StatusCard />

      {/* 🔥 STATS */}
      <Stats />

      {/* 🔥 LINK PRINCIPAL */}
      <StoreLink />

      {/* 🔥 ACCIONES */}
      <QuickActions />

      {/* 🔥 BLOQUE PRINCIPAL (PRO GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        <div className="w-full">
          <WhatsAppBlock />
        </div>

        <div className="w-full">
          <Activity />
        </div>

      </div>

    </div>
  );
}