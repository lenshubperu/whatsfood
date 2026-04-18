"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useBusinessContext } from "@/app/context/BusinessProvider";
import { X, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";

type Product = {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  is_available: boolean;
  has_extras: boolean;
};

export default function ProductModal({
  open,
  onClose,
  product,
}: {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}) {
  const { business } = useBusinessContext();

  const [form, setForm] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    category: "General",
    image_url: "",
    is_available: true,
    has_extras: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // 🔄 cargar datos si edita
  useEffect(() => {
    if (product) {
      setForm(product);
      setPreview(product.image_url || null);
    } else {
      setForm({
        name: "",
        description: "",
        price: 0,
        category: "General",
        image_url: "",
        is_available: true,
        has_extras: false,
      });
      setPreview(null);
    }
  }, [product]);

  if (!open) return null;

  // 📸 upload imagen
  const uploadImage = async () => {
    if (!imageFile) return form.image_url;

    if (!business?.id) {
      alert("Error: negocio no disponible");
      return null;
    }

    const filePath = `${business.id}/${Date.now()}-${imageFile.name}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(filePath, imageFile);

    if (error) {
      console.error(error);
      alert("Error subiendo imagen");
      return null;
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // 💾 guardar
  const handleSave = async () => {
    if (!form.name) {
      alert("Nombre requerido");
      return;
    }

    if (!business?.id) {
      alert("Error: negocio no cargado");
      return;
    }

    setSaving(true);

    const imageUrl = await uploadImage();

    const payload = {
      ...form,
      image_url: imageUrl,
      business_id: business.id,
    };

    let error;

    if (product?.id) {
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
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">
              {product ? "Editar producto" : "Nuevo producto"}
            </h2>
            <p className="text-sm opacity-80">
              Completa la información del producto
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/20 transition"
          >
            <X />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">

          {/* INFO */}
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

            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="number"
                placeholder="Precio"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                className="w-full md:w-1/2 p-3 border rounded-xl"
              />

              <input
                placeholder="Categoría"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="w-full md:w-1/2 p-3 border rounded-xl"
              />
            </div>
          </div>

          {/* IMAGE */}
          <div>
            <p className="font-semibold mb-3">Imagen del producto</p>

            <label className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition">
              <UploadCloud className="mb-2" />

              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full max-h-40 object-cover rounded-lg mb-2"
                />
              ) : (
                <span>Click para subir imagen</span>
              )}

              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  setImageFile(file);
                  setPreview(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>

          {/* SWITCHES */}
          <div className="space-y-4">

            <div className="flex justify-between items-center bg-muted p-4 rounded-xl">
              <div>
                <p className="font-medium">Producto disponible</p>
                <p className="text-xs text-muted-foreground">
                  Visible para clientes
                </p>
              </div>

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

            <div className="flex justify-between items-center bg-muted p-4 rounded-xl">
              <div>
                <p className="font-medium">Extras del producto</p>
                <p className="text-xs text-muted-foreground">
                  Permite agregar extras
                </p>
              </div>

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
        <div className="p-6 flex flex-col md:flex-row gap-3 border-t">

          <button
            onClick={onClose}
            className="w-full md:flex-1 py-3 rounded-xl border"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full md:flex-1 py-3 rounded-xl bg-green-600 text-white font-medium"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>

        </div>
      </motion.div>
    </div>
  );
}