"use client";

import { useState } from "react";
import { Copy, ArrowRight, MessageCircle } from "lucide-react";
import { useBusinessContext } from "@/app/context/BusinessProvider";
import { motion } from "framer-motion";

export default function StoreLink() {
  const { business, loading } = useBusinessContext();
  const [copied, setCopied] = useState(false);

  if (loading || !business) return null;

  const url = `https://whatsfoodperu.com/${business.slug}`;

  const message = `Hola 👋

🍔 *${business.name}*

Haz tu pedido aquí:
${url}

🔥 Atención rápida por WhatsApp`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("No se pudo copiar");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        w-full relative overflow-hidden rounded-3xl
        p-5 sm:p-6 md:p-8
        bg-gradient-to-br from-green-500 via-green-600 to-green-700
        text-white
        shadow-xl
        transition-all duration-500
        hover:shadow-2xl
      "
    >
      {/* GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,white,transparent_60%)] opacity-20 pointer-events-none" />

      <div className="relative z-10">

        {/* HEADER */}
        <p className="text-xs uppercase tracking-wide opacity-80 mb-2">
          ⚡ IMPULSA TU NEGOCIO
        </p>

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 leading-tight">
          Tu tienda online está lista
        </h2>

        <p className="text-white/80 mb-5 text-sm sm:text-base max-w-lg">
          Comparte este enlace y empieza a recibir pedidos automáticamente
        </p>

        {/* LINK BOX */}
        <div
          className="
            flex items-center justify-between gap-3
            bg-white/10 backdrop-blur-md
            border border-white/20
            rounded-2xl px-3 sm:px-4 py-3 mb-5
            transition hover:bg-white/15
          "
        >
          <div className="overflow-hidden min-w-0">
            <p className="text-[11px] opacity-70 mb-1">
              Enlace de tu tienda
            </p>

            <p className="text-sm sm:text-base md:text-lg font-semibold truncate">
              {url.replace("https://", "")}
            </p>
          </div>

          <button
            onClick={copyLink}
            className="
              flex-shrink-0 p-2.5 sm:p-3 rounded-xl
              bg-white/20 hover:bg-white/30
              transition active:scale-95
            "
          >
            <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          {/* COPY */}
          <button
            onClick={copyLink}
            className="
              flex items-center justify-center gap-2
              min-h-[48px]
              px-4 py-3 rounded-xl
              border border-white/30
              hover:bg-white/10
              transition-all duration-200
              active:scale-95
            "
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copiado" : "Copiar"}
          </button>

          {/* WHATSAPP */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center justify-center gap-2
              min-h-[48px]
              px-4 py-3 rounded-xl
              bg-[#25D366] text-white font-semibold
              hover:opacity-90
              transition-all duration-200
              active:scale-95
            "
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>

          {/* OPEN */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center justify-center gap-2
              min-h-[48px]
              px-4 py-3 rounded-xl
              bg-white text-green-700 font-semibold
              hover:opacity-90
              transition-all duration-200
              active:scale-95
            "
          >
            Ver tienda
            <ArrowRight className="w-4 h-4" />
          </a>

        </div>
      </div>
    </motion.div>
  );
}