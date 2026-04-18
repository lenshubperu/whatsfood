"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useBusiness } from "@/hooks/useBusiness";

export default function AccountPage() {
  const { business, loading } = useBusiness();

  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  // 🔥 llenar form cuando carga business
  useEffect(() => {
    if (business) {
      setForm({
        name: business.name || "",
        phone: business.phone || "",
        address: business.address || "",
        google_maps: business.google_maps || "",
        hours: business.hours || "",
        whatsapp_message: business.whatsapp_message || "",
      });
    }
  }, [business]);

  const handleSave = async () => {
    if (!business?.id) return;

    setSaving(true);

    const { error } = await supabase
      .from("businesses")
      .update(form)
      .eq("id", business.id);

    setSaving(false);

    if (error) {
      alert("Error al guardar");
      console.error(error);
      return;
    }

    alert("Guardado correctamente");
  };

  // 🔥 loading state PRO
  if (loading || !business) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-gray-500">Cargando cuenta...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-4">

      <h2 className="text-xl font-semibold">Mi cuenta</h2>

      <input
        placeholder="Nombre"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full border p-3 rounded-xl"
      />

      <input
        placeholder="WhatsApp"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="w-full border p-3 rounded-xl"
      />

      <input
        placeholder="Dirección"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        className="w-full border p-3 rounded-xl"
      />

      <input
        placeholder="Google Maps link"
        value={form.google_maps}
        onChange={(e) =>
          setForm({ ...form, google_maps: e.target.value })
        }
        className="w-full border p-3 rounded-xl"
      />

      <textarea
        placeholder="Horario"
        value={form.hours}
        onChange={(e) => setForm({ ...form, hours: e.target.value })}
        className="w-full border p-3 rounded-xl"
      />

      <textarea
        placeholder="Mensaje WhatsApp"
        value={form.whatsapp_message}
        onChange={(e) =>
          setForm({ ...form, whatsapp_message: e.target.value })
        }
        className="w-full border p-3 rounded-xl"
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-black text-white px-4 py-2 rounded-xl disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>

    </div>
  );
}