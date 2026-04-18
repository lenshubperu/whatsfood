"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useBusinessContext } from "@/app/context/BusinessProvider";
import { X, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductModal({
  open,
  onClose,
  product,
}: any) {
  const { business } = useBusinessContext();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    category: "General",
    image_url: "",
    is_available: true,
    has_extras: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) setForm(product);
  }, [product]);

  if (!open) return null;

  // 📸 upload image
  const uploadImage = async () => {
    if (!imageFile) return form.image_url;

    const filePath = `${business.id}/${Date.now()}-${imageFile.name}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(filePath, imageFile);

    if (error) {
      console.error(error);
      return null;
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // 💾 SAVE
  const handleSave = async () => {
    if (!form.name) return alert("Nombre requerido");

    setSaving(true);

    const imageUrl = await uploadImage();

    const payload = {
      ...form,
      image_url: imageUrl,
      business_id: business.id,
    };

    let error;

    if (product) {
      ({ error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", product.id));
    } else {
      ({ error } = await supabase.from("products").insert(payload));
    }

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Error al guardar");
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* HEADER */}
        <div className="bg-green-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">
              {product ? "Editar producto" : "Nuevo producto"}
            </h2>
            <p className="text-sm opacity-80">
              Completa la información del producto
            </p>
          </div>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">

          {/* BASIC */}
          <div>
            <p className="font-semibold mb-3">Información básica</p>

            <input
              placeholder="Nombre del producto"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full mb-3 p-3 border rounded-xl"
            />

            <textarea
              placeholder="Descripción"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full mb-3 p-3 border rounded-xl"
            />

            <div className="flex gap-3">
              <input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                className="w-1/2 p-3 border rounded-xl"
              />

              <input
                placeholder="Categoría"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="w-1/2 p-3 border rounded-xl"
              />
            </div>
          </div>

          {/* IMAGE */}
          <div>
            <p className="font-semibold mb-3">Imagen del producto</p>

            <label className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer">
              <UploadCloud className="mb-2" />
              <span>Click para subir imagen</span>

              <input
                type="file"
                className="hidden"
                onChange={(e) =>
                  setImageFile(e.target.files?.[0] || null)
                }
              />
            </label>
          </div>

          {/* SWITCHES */}
          <div className="space-y-4">

            <div className="flex justify-between items-center">
              <span>Producto disponible</span>
              <input
                type="checkbox"
                checked={form.is_available}
                onChange={() =>
                  setForm({
                    ...form,
                    is_available: !form.is_available,
                  })
                }
              />
            </div>

            <div className="flex justify-between items-center">
              <span>Extras del producto</span>
              <input
                type="checkbox"
                checked={form.has_extras}
                onChange={() =>
                  setForm({
                    ...form,
                    has_extras: !form.has_extras,
                  })
                }
              />
            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="p-6 flex gap-3 border-t">

          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-green-600 text-white"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>

        </div>
      </motion.div>
    </div>
  );
}