"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useBusiness } from "@/lib/useBusiness";

export default function AccountPage() {
  const business = useBusiness();

  const [form, setForm] = useState<any>({});

  const handleSave = async () => {
    await supabase
      .from("businesses")
      .update(form)
      .eq("id", business.id);

    alert("Guardado");
  };

  return (
    <div className="max-w-xl space-y-4">

      <h2 className="text-xl font-semibold">Mi cuenta</h2>

      <input
        placeholder="Nombre"
        defaultValue={business?.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full border p-3 rounded-xl"
      />

      <input
        placeholder="WhatsApp"
        defaultValue={business?.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="w-full border p-3 rounded-xl"
      />

      <input
        placeholder="Dirección"
        defaultValue={business?.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        className="w-full border p-3 rounded-xl"
      />

      <input
        placeholder="Google Maps link"
        defaultValue={business?.google_maps}
        onChange={(e) => setForm({ ...form, google_maps: e.target.value })}
        className="w-full border p-3 rounded-xl"
      />

      <textarea
        placeholder="Horario"
        defaultValue={business?.hours}
        onChange={(e) => setForm({ ...form, hours: e.target.value })}
        className="w-full border p-3 rounded-xl"
      />

      <textarea
        placeholder="Mensaje WhatsApp"
        defaultValue={business?.whatsapp_message}
        onChange={(e) =>
          setForm({ ...form, whatsapp_message: e.target.value })
        }
        className="w-full border p-3 rounded-xl"
      />

      <button
        onClick={handleSave}
        className="bg-black text-white px-4 py-2 rounded-xl"
      >
        Guardar cambios
      </button>

    </div>
  );
}