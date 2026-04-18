"use client";

import { useBusiness } from "@/hooks/useBusiness";

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
        <p className="text-muted-foreground">
          Cargando dashboard...
        </p>
      </div>
    );
  }

  // ⚠️ Error real
  if (!business) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3 text-center">
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
    <div className="space-y-6">
      {/* 🔥 ESTADO DEL NEGOCIO */}
      <StatusCard business={business} />
<Stats business={business} />
<StoreLink business={business} />
<QuickActions business={business} />
<WhatsAppBlock business={business} />
<Activity business={business} />
    </div>
  );
}