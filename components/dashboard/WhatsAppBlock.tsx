"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useBusiness } from "@/hooks/useBusiness";
import { Phone, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function WhatsAppBlock() {
  const { business, loading } = useBusiness();

  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // 🧠 MENSAJE GLOBAL PROFESIONAL (NO editable)
  const DEFAULT_MESSAGE =
    "Hola 👋, quiero hacer un pedido. ¿Me puedes compartir el menú disponible?";

  useEffect(() => {
    if (business) {
      setPhone(business.phone || "");
    }
  }, [business]);

  if (loading || !business) return null;

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    const { error } = await supabase
      .from("businesses")
      .update({
        phone,
        whatsapp_message: DEFAULT_MESSAGE, // 🔥 SIEMPRE el mismo
      })
      .eq("id", business.id);

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Error al guardar");
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl overflow-hidden shadow-xl border border-border"
    >
      {/* 🔥 HEADER VERDE FIGMA */}
      <div className="relative bg-gradient-to-br from-green-500 via-green-600 to-green-700 p-6 md:p-8 text-white">

        {/* glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,white,transparent_60%)] opacity-20" />

        <div className="relative z-10">
          <p className="text-sm uppercase tracking-wide opacity-80 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Feature destacado
          </p>

          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Pedidos por WhatsApp
          </h2>

          <p className="text-white/80 text-sm md:text-base">
            Configura tu número para recibir pedidos automáticamente
          </p>
        </div>
      </div>

      {/* 🔧 CONTENIDO */}
      <div className="bg-card p-6 md:p-8">

        {/* INPUT */}
        <div className="mb-5">
          <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Phone className="w-4 h-4 text-green-600" />
            Número de WhatsApp
          </label>

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+51 999 999 999"
            className="
              w-full rounded-xl px-4 py-3
              bg-muted border border-border
              focus:outline-none focus:ring-2 focus:ring-green-500/20
              transition
            "
          />
        </div>

        {/* 🧠 MENSAJE FIJO */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">
            Mensaje automático
          </p>

          <div className="bg-muted/70 border border-border rounded-xl p-4 text-sm text-foreground">
            {DEFAULT_MESSAGE}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="
            w-full md:w-auto
            px-6 py-3 rounded-xl
            bg-green-600 text-white font-medium
            hover:bg-green-700
            transition-all duration-200
            active:scale-95
            disabled:opacity-50
          "
        >
          {saving
            ? "Guardando..."
            : saved
            ? "✅ Guardado"
            : "Guardar cambios"}
        </button>
      </div>
    </motion.div>
  );
}