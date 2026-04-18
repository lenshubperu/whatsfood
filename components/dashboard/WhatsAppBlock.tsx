"use client";

import { useState, useEffect } from "react";
import { useBusiness } from "@/hooks/useBusiness";
import { supabase } from "@/lib/supabase/client";

export default function WhatsAppBlock() {
  const { business, loading } = useBusiness();

  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("Hola, quiero pedir:");
  const [saving, setSaving] = useState(false);

  // 🔥 cargar datos reales
  useEffect(() => {
    if (business) {
      setPhone(business.phone || "");
      setMessage(
        business.whatsapp_message || "Hola, quiero pedir:"
      );
    }
  }, [business]);

  const handleSave = async () => {
    if (!business?.id) return;

    setSaving(true);

    const { error } = await supabase
      .from("businesses")
      .update({
        phone,
        whatsapp_message: message,
      })
      .eq("id", business.id);

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Error al guardar");
      return;
    }

    alert("WhatsApp actualizado");
  };

  if (loading || !business) return null;

  return (
    <div className="bg-card p-6 rounded-lg border border-border shadow-sm">

      {/* HEADER */}
      <p className="font-semibold text-foreground mb-4">
        Configuración WhatsApp
      </p>

      {/* PHONE */}
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+51 999 999 999"
        className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm mb-3 outline-none focus:ring-2 focus:ring-primary/20"
      />

      {/* MESSAGE */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm mb-3 outline-none focus:ring-2 focus:ring-primary/20"
      />

      {/* PREVIEW */}
      <div className="bg-muted p-3 rounded-lg text-sm text-muted-foreground mb-4">
        {message}
      </div>

      {/* SAVE */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>

    </div>
  );
}