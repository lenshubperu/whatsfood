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
    } catch (err) {
      console.error(err);
      alert("No se pudo copiar el enlace");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        w-full relative overflow-hidden rounded-3xl
        p-6 md:p-10
        bg-gradient-to-br from-green-500 via-green-600 to-green-700
        text-white
        shadow-xl
        transition-all duration-500
        hover:shadow-2xl
      "
    >
      {/* 🔥 Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,white,transparent_60%)] opacity-20 pointer-events-none" />

      <div className="relative z-10">

        {/* HEADER */}
        <p className="text-xs md:text-sm uppercase tracking-wide opacity-80 mb-3">
          ⚡ IMPULSA TU NEGOCIO
        </p>

        <h2 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
          Tu tienda online está lista
        </h2>

        <p className="text-white/80 mb-6 max-w-xl text-sm md:text-base">
          Comparte este enlace con tus clientes para que ordenen directamente
        </p>

        {/* LINK BOX */}
        <div
          className="
            flex items-center justify-between
            bg-white/10 backdrop-blur-md
            border border-white/20
            rounded-2xl px-4 py-4 mb-6
            transition hover:bg-white/15
          "
        >
          <div className="overflow-hidden">
            <p className="text-xs opacity-70 mb-1">
              Enlace de tu tienda
            </p>

            <p className="text-lg md:text-xl font-semibold truncate">
              {url.replace("https://", "")}
            </p>
          </div>

          <button
            onClick={copyLink}
            className="
              ml-4 p-3 rounded-xl
              bg-white/20 hover:bg-white/30
              transition active:scale-95
            "
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col md:flex-row gap-3">

          {/* COPY */}
          <button
            onClick={copyLink}
            className="
              flex-1 flex items-center justify-center gap-2
              px-6 py-3 rounded-2xl
              border border-white/30
              hover:bg-white/10
              transition-all duration-200
              active:scale-95
            "
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copiado" : "Copiar enlace"}
          </button>

          {/* WHATSAPP */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex-1 flex items-center justify-center gap-2
              px-6 py-3 rounded-2xl
              bg-[#25D366] text-white font-semibold
              hover:opacity-90
              transition-all duration-200
              active:scale-95
            "
          >
            <MessageCircle className="w-4 h-4" />
            Compartir
          </a>

          {/* OPEN */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex-1 flex items-center justify-center gap-2
              px-6 py-3 rounded-2xl
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