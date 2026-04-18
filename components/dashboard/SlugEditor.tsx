"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { formatSlug } from "@/lib/slug";
import { useBusinessContext } from "@/app/context/BusinessProvider";

export default function SlugEditor() {
  const { business, setBusiness } = useBusinessContext();

  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [saving, setSaving] = useState(false);

  // cargar slug actual
  useEffect(() => {
    if (business?.slug) {
      setValue(business.slug);
    }
  }, [business]);

  // 🔍 validar disponibilidad (debounce)
  useEffect(() => {
    if (!value) return;

    const delay = setTimeout(async () => {
      setStatus("checking");

      const formatted = formatSlug(value);

      const { data } = await supabase
        .from("businesses")
        .select("id")
        .eq("slug", formatted)
        .neq("id", business?.id) // 🔥 importante
        .maybeSingle();

      if (data) {
        setStatus("taken");
      } else {
        setStatus("available");
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [value]);

  const handleSave = async () => {
    if (!business?.id) return;

    const formatted = formatSlug(value);

    if (status !== "available") {
      alert("Slug no disponible");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("businesses")
      .update({ slug: formatted })
      .eq("id", business.id);

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Error al guardar slug");
      return;
    }

    // 🔥 update global instantáneo
    setBusiness({
      ...business,
      slug: formatted,
    });

    alert("Slug actualizado 🚀");
  };

  if (!business) return null;

  return (
    <div className="bg-card p-6 rounded-xl border border-border space-y-4">

      <div>
        <p className="text-sm text-muted-foreground">
          URL de tu tienda
        </p>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-muted-foreground text-sm">
            whatsfoodperu.com/
          </span>

          <input
            value={value}
            onChange={(e) => setValue(formatSlug(e.target.value))}
            className="bg-input border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* STATUS */}
        <p className="text-xs mt-2">
          {status === "checking" && "⏳ verificando..."}
          {status === "available" && "✅ disponible"}
          {status === "taken" && "❌ ya está en uso"}
        </p>
      </div>

      <button
        onClick={handleSave}
        disabled={saving || status !== "available"}
        className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Guardar URL"}
      </button>

    </div>
  );
}