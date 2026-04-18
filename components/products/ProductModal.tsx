"use client";

import {
  X,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useBusinessContext } from "@/app/context/BusinessProvider";

/* =========================
   🔹 TYPES
========================= */
type Extra = {
  id: string;
  name: string;
  price: number;
};

/* =========================
   🔹 UI HELPERS
========================= */

// 🔥 Switch estilo iOS (FIGMA)
function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-12 h-7 rounded-full transition ${
        checked ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

// 🔥 Input Figma style
function Input(props: any) {
  return (
    <input
      {...props}
      className="
        w-full px-4 py-3 rounded-xl
        bg-gray-50 border-2 border-gray-200
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
        transition-all
      "
    />
  );
}

// 🔥 Textarea Figma
function Textarea(props: any) {
  return (
    <textarea
      {...props}
      className="
        w-full px-4 py-3 rounded-xl
        bg-gray-50 border-2 border-gray-200
        focus:outline-none focus:ring-2 focus:ring-green-500
        resize-none
        transition-all
      "
    />
  );
}

/* =========================
   🔹 MAIN COMPONENT
========================= */
export default function ProductModal({
  open,
  onClose,
  product,
}: {
  open: boolean;
  onClose: () => void;
  product?: any;
}) {
  const { business } = useBusinessContext();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    category: "Hamburguesas",
    image_url: "",
    is_available: true,
    has_extras: false,
    extras: [] as Extra[],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /* =========================
     🔁 LOAD
  ========================= */
  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        extras: product.extras || [],
        has_extras: product.extras?.length > 0,
      });
    }
  }, [product]);

  if (!open) return null;

  /* =========================
     📸 IMAGE
  ========================= */
  const handleImage = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setForm({
      ...form,
      image_url: URL.createObjectURL(file),
    });
  };

  const uploadImage = async () => {
    if (!imageFile || !business) return form.image_url;

    const path = `${business.id}/${Date.now()}-${imageFile.name}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(path, imageFile);

    if (error) return form.image_url;

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(path);

    return data.publicUrl;
  };

  /* =========================
     💾 SAVE
  ========================= */
  const handleSave = async () => {
    if (!business) return;

    const imageUrl = await uploadImage();

    const payload = {
      ...form,
      image_url: imageUrl,
      business_id: business.id,
      extras: form.has_extras ? form.extras : [],
    };

    if (product) {
      await supabase.from("products").update(payload).eq("id", product.id);
    } else {
      await supabase.from("products").insert(payload);
    }

    onClose();
  };

  /* =========================
     ➕ EXTRAS
  ========================= */
  const addExtra = () => {
    setForm({
      ...form,
      extras: [
        ...form.extras,
        { id: Date.now().toString(), name: "", price: 0 },
      ],
    });
  };

  const updateExtra = (id: string, field: any, value: any) => {
    setForm({
      ...form,
      extras: form.extras.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    });
  };

  const removeExtra = (id: string) => {
    setForm({
      ...form,
      extras: form.extras.filter((e) => e.id !== id),
    });
  };

  /* =========================
     🧩 UI
  ========================= */
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl h-[90vh] flex flex-col shadow-2xl">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {product ? "Editar producto" : "Nuevo producto"}
            </h2>
            <p className="text-green-100 text-sm">
              Completa la información del producto
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition"
          >
            <X className="text-white" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">

          {/* BASIC */}
          <div>
            <h3 className="font-bold text-lg mb-4">Información básica</h3>

            <div className="space-y-4">
              <Input
                placeholder="Ej: Hamburguesa Clásica"
                value={form.name}
                onChange={(e: any) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <Textarea
                rows={3}
                placeholder="Describe tu producto..."
                value={form.description}
                onChange={(e: any) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e: any) =>
                    setForm({
                      ...form,
                      price: Number(e.target.value),
                    })
                  }
                />

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="px-4 py-3 bg-gray-50 border-2 rounded-xl"
                >
                  <option>Hamburguesas</option>
                  <option>Pizzas</option>
                  <option>Pastas</option>
                  <option>Bebidas</option>
                </select>
              </div>
            </div>
          </div>

          {/* IMAGE */}
          <div>
            <h3 className="font-bold text-lg mb-4">Imagen</h3>

            <div
              onClick={() => fileRef.current?.click()}
              className="
                border-2 border-dashed border-gray-300
                rounded-2xl p-10 text-center
                hover:border-green-500 hover:bg-green-50
                transition cursor-pointer
              "
            >
              {form.image_url ? (
                <img
                  src={form.image_url}
                  className="h-40 mx-auto rounded-xl object-cover"
                />
              ) : (
                <>
                  <ImageIcon className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium">
                    Click para subir imagen
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG hasta 10MB
                  </p>
                </>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              onChange={handleImage}
              className="hidden"
            />
          </div>

          {/* SWITCHES */}
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border">
              <div>
                <p className="font-semibold">Disponible</p>
                <p className="text-xs text-gray-500">
                  Visible para clientes
                </p>
              </div>
              <Switch
                checked={form.is_available}
                onChange={() =>
                  setForm({
                    ...form,
                    is_available: !form.is_available,
                  })
                }
              />
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border">
              <div>
                <p className="font-semibold">Extras</p>
                <p className="text-xs text-gray-500">
                  Permite agregar extras
                </p>
              </div>
              <Switch
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

          {/* EXTRAS */}
          {form.has_extras && (
            <div className="space-y-3">
              {form.extras.map((e) => (
                <div
                  key={e.id}
                  className="flex gap-3 p-3 bg-gray-50 rounded-xl border"
                >
                  <Input
                    placeholder="Nombre"
                    value={e.name}
                    onChange={(ev: any) =>
                      updateExtra(e.id, "name", ev.target.value)
                    }
                  />

                  <Input
                    type="number"
                    value={e.price}
                    onChange={(ev: any) =>
                      updateExtra(
                        e.id,
                        "price",
                        Number(ev.target.value)
                      )
                    }
                    className="w-28"
                  />

                  <button onClick={() => removeExtra(e.id)}>
                    <Trash2 className="text-red-500" />
                  </button>
                </div>
              ))}

              <button
                onClick={addExtra}
                className="w-full border-2 border-dashed border-green-300 text-green-600 rounded-xl py-3 font-semibold hover:bg-green-50 transition"
              >
                + Agregar extra
              </button>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 flex gap-3 border-t bg-white">
          <button
            onClick={onClose}
            className="flex-1 border rounded-xl py-3 font-semibold"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl py-3 font-bold shadow-lg shadow-green-500/30 hover:scale-[1.02] transition"
          >
            {product ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>
      </div>
    </div>
  );
}