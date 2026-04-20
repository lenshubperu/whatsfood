"use client";

import StoreLink from "@/components/dashboard/StoreLink";
import LogoUploader from "@/components/dashboard/LogoUploader";
import PaymentMethods from "@/components/dashboard/payments/PaymentMethods";
import DeliveryConfig from "@/components/dashboard/delivery/DeliveryConfig";

import { useBusinessContext } from "@/app/context/BusinessProvider";

export default function StorePage() {
  const { loading, business } = useBusinessContext();

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <p className="text-sm text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="p-4 sm:p-6">
        <p className="text-sm text-red-500">
          No se encontró el negocio
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">

      {/* 🔗 LINK */}
      <StoreLink />

      {/* 🖼 LOGO */}
      <LogoUploader />

      {/* 💳 + 🚚 GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PAYMENT */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border">
          <PaymentMethods />
        </div>

        {/* DELIVERY */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border">
          <DeliveryConfig />
        </div>

      </div>
    </div>
  );
}