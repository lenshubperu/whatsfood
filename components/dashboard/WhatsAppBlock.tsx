"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useBusinessContext } from "@/app/context/BusinessProvider";
import { Phone, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function WhatsAppBlock() {
  const { business, loading } = useBusinessContext();

  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // 🧠 MENSAJE GLOBAL (no editable)
  const DEFAULT_MESSAGE =
    "Hola 👋, quiero hacer un pedido. ¿Me puedes compartir el menú disponible?";

  // 🔄 sync desde DB
  useEffect(() => {
    if (business) {
      setPhone(business.phone || "");
    }
  }, [business?.id, business?.phone]);

  if (loading || !business) return null;

  // 🔢 formateo simple Perú
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 12);
    if (!digits) return "";
    if (digits.startsWith("51")) {
      return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(
        5,
        8
      )} ${digits.slice(8)}`.trim();
    }
    if (digits.startsWith("9")) {
      return `+51 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(
        6
      )}`.trim();
    }
    return `+${digits}`;
  };

  const handleSave = async () => {
    if (!business?.id) return;

    const prevPhone = business.phone || "";
    const newPhone = phone.trim();

    // ⚡ optimistic UI
    setSaving(true);
    setSaved(false);

    const { error } = await supabase
      .from("businesses")
      .update({
        phone: newPhone,
        whatsapp_message: DEFAULT_MESSAGE,
      })
      .eq("id", business.id);

    setSaving(false);

    if (error) {
      console.error(error);
      setPhone(prevPhone); // rollback
      alert("Error al guardar");
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-3xl border border-border bg-card shadow-xl"
    >
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-green-500 via-green-600 to-green-700 p-6 md:p-8 text-white min-h-[140px] md:min-h-[160px]">
        {/* glow */}
        <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,white,transparent_60%)]" />

        <div className="relative z-10">
          <p className="text-xs md:text-sm uppercase tracking-wide opacity-80 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Feature destacado
          </p>

          <h2 className="text-xl md:text-3xl font-bold mb-2">
            Pedidos por WhatsApp
          </h2>

          <p className="text-white/80 text-sm md:text-base max-w-md">
            Configura tu número para recibir pedidos automáticamente
          </p>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="p-6 md:p-8">
        {/* INPUT */}
        <div className="mb-5">
          <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <Phone className="w-4 h-4 text-green-600" />
            Número de WhatsApp
          </label>

          <input
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="+51 999 999 999"
            inputMode="numeric"
            className="
              w-full rounded-xl px-4 py-3
              bg-muted border border-border
              focus:outline-none focus:ring-2 focus:ring-green-500/20
              transition
            "
          />
        </div>

        {/* MENSAJE FIJO */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">
            Mensaje automático
          </p>

          <div className="bg-muted/70 border border-border rounded-xl p-4 text-sm text-foreground">
            {DEFAULT_MESSAGE}
          </div>
        </div>

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleSave}
          disabled={saving}
          className="
            w-full md:w-auto
            px-6 py-3 rounded-xl
            bg-green-600 text-white font-medium
            hover:bg-green-700
            transition-all duration-200
            disabled:opacity-50
          "
        >
          {saving
            ? "Guardando..."
            : saved
            ? "✅ Guardado"
            : "Guardar cambios"}
        </motion.button>
      </div>
    </motion.div>
  );
}