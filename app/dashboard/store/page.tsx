"use client";

import StoreLink from "@/components/StoreLink";
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
    <div className="p-4 sm:p-6 max-w-5xl">
      <StoreLink />
    </div>
  );
}