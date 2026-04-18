"use client";

import { useState, useEffect } from "react";
import { useBusiness } from "@/lib/useBusiness";
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

  if (loading) return null;
  if (!business) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">

      {/* HEADER */}
      <p className="font-semibold mb-4">
        Configuración WhatsApp
      </p>

      {/* PHONE */}
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+51 999 999 999"
        className="w-full border p-3 rounded-xl mb-3"
      />

      {/* MESSAGE */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border p-3 rounded-xl mb-3"
      />

      {/* PREVIEW */}
      <div className="bg-gray-100 p-3 rounded-xl text-sm mb-4">
        {message}
      </div>

      {/* SAVE */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>

    </div>
  );
}