"use client";

import {
  X,
  Trash2,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useBusinessContext } from "@/app/context/BusinessProvider";

/* =========================
   TYPES
========================= */
type Extra = {
  id: string;
  name: string;
  price: number;
};

/* =========================
   UI
========================= */

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
        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

function Input({ className = "", ...props }: any) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:ring-2 focus:ring-green-500 transition ${className}`}
    />
  );
}

function Textarea(props: any) {
  return (
    <textarea
      {...props}
      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:ring-2 focus:ring-green-500 resize-none"
    />
  );
}

/* =========================
   COMPONENT
========================= */
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
    category: "",
    image_url: "",
    is_available: true,
    has_extras: false,
    extras: [] as Extra[],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");

  /* =========================
     LOAD PRODUCT
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

  /* =========================
     LOAD CATEGORIES
  ========================= */
  useEffect(() => {
    if (!business?.id) return;

    const load = async () => {
      const { data } = await supabase
        .from("categories")
        .select("name")
        .eq("business_id", business.id);

      setCategories(data?.map((c) => c.name) || []);
    };

    load();
  }, [business?.id]);

  if (!open) return null;

  /* =========================
     IMAGE
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
     SAVE
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

    if (newCategory) {
      await supabase.from("categories").insert({
        name: newCategory,
        business_id: business.id,
      });
    }

    onClose();
  };

  /* =========================
     EXTRAS
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
     UI
  ========================= */
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

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
            className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"
          >
            <X className="text-white" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">

          {/* BASIC */}
          <div>
            <h3 className="font-bold text-lg mb-4">Información básica</h3>

            <div className="space-y-5">

              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Nombre del producto
                </label>
                <Input
                  placeholder="Ej: Hamburguesa Clásica"
                  value={form.name}
                  onChange={(e: any) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Descripción
                </label>
                <Textarea
                  rows={3}
                  placeholder="Describe tu producto..."
                  value={form.description}
                  onChange={(e: any) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Precio (S/)
                  </label>
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
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Categoría
                  </label>

                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:ring-2 focus:ring-green-500"
                  >
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>

                  <div className="flex gap-2 mt-2">
                    <input
                      placeholder="Nueva categoría"
                      value={newCategory}
                      onChange={(e) =>
                        setNewCategory(e.target.value)
                      }
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    />

                    <button
                      onClick={() => {
                        if (!newCategory) return;

                        setCategories([...categories, newCategory]);
                        setForm({ ...form, category: newCategory });
                        setNewCategory("");
                      }}
                      className="bg-green-500 text-white px-3 rounded-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* IMAGE */}
          <div>
            <h3 className="font-bold text-lg mb-4">Imagen del producto</h3>

            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:border-green-500 hover:bg-green-50 transition cursor-pointer"
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
                <p className="font-semibold">Producto disponible</p>
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
                <p className="font-semibold">Extras del producto</p>
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
                  className="flex gap-3 p-3 bg-gray-50 rounded-xl border items-center"
                >
                  <Input
                    placeholder="Nombre del extra"
                    value={e.name}
                    onChange={(ev: any) =>
                      updateExtra(e.id, "name", ev.target.value)
                    }
                  />

                  {/* ✅ INPUT CON S/ */}
                  <div className="relative w-28">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      S/
                    </span>

                    <input
                      type="number"
                      value={e.price}
                      placeholder="0"
                      onChange={(ev: any) =>
                        updateExtra(
                          e.id,
                          "price",
                          Number(ev.target.value)
                        )
                      }
                      className="w-full pl-10 pr-3 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:ring-2 focus:ring-green-500 text-center"
                    />
                  </div>

                  <button onClick={() => removeExtra(e.id)}>
                    <Trash2 className="text-red-500" />
                  </button>
                </div>
              ))}

              <button
                onClick={addExtra}
                className="w-full border-2 border-dashed border-green-300 text-green-600 rounded-xl py-3 font-semibold hover:bg-green-50 transition flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar extra
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
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl py-3 font-bold shadow-lg"
          >
            {product ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>

      </div>
    </div>
  );
}