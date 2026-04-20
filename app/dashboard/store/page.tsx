"use client";

import StoreLink from "@/components/dashboard/StoreLink";
import LogoUploader from "@/components/dashboard/LogoUploader";
import WhatsAppBlock from "@/components/dashboard/WhatsAppBlock";

import PaymentMethods from "@/components/dashboard/payments/PaymentMethods";
import DeliveryConfig from "@/components/dashboard/delivery/DeliveryConfig";

import { useBusinessContext } from "@/app/context/BusinessProvider";
import { motion } from "framer-motion";

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

      {/* 💬 WHATSAPP */}
      <WhatsAppBlock />

      {/* 💳 + 🚚 BLOQUE REUTILIZADO */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full rounded-3xl border border-border bg-card shadow-xl"
      >
        {/* HEADER reutilizado */}
        <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 p-6 md:p-8 text-white">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,white,transparent_60%)]" />

          <div className="relative z-10">
            <p className="text-xs uppercase tracking-wide opacity-80 mb-2">
              Configuración avanzada
            </p>

            <h2 className="text-xl md:text-3xl font-bold">
              Pagos y delivery
            </h2>

            <p className="text-white/80 text-sm md:text-base max-w-md">
              Define cómo cobrar y cómo entregar pedidos
            </p>
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* PAYMENT */}
          <div className="space-y-4">
            <PaymentMethods />
          </div>

          {/* DELIVERY */}
          <div className="space-y-4">
            <DeliveryConfig />
          </div>

        </div>
      </motion.div>
    </div>
  );
}