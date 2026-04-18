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

type Extra = {
  id: string;
  name: string;
  price: number;
};

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
     🔁 LOAD EDIT DATA
  ========================= */
  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        extras: product.extras || [],
        has_extras: product.extras?.length > 0,
      });
    } else {
      setForm({
        name: "",
        description: "",
        price: 0,
        category: "Hamburguesas",
        image_url: "",
        is_available: true,
        has_extras: false,
        extras: [],
      });
    }
  }, [product]);

  if (!open) return null;

  /* =========================
     📸 IMAGE UPLOAD
  ========================= */
  const handleImage = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setForm({ ...form, image_url: URL.createObjectURL(file) });
  };

  const uploadImage = async () => {
    if (!imageFile || !business) return form.image_url;

    const path = `${business.id}/${Date.now()}-${imageFile.name}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(path, imageFile);

    if (error) {
      console.error(error);
      return form.image_url;
    }

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

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">

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
        <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">

          {/* INPUTS */}
          <input
            placeholder="Nombre"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full px-4 py-3 bg-gray-50 border-2 rounded-xl"
          />

          <textarea
            placeholder="Descripción"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full px-4 py-3 bg-gray-50 border-2 rounded-xl"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: Number(e.target.value),
                })
              }
              className="px-4 py-3 bg-gray-50 border-2 rounded-xl"
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

          {/* IMAGE */}
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer"
          >
            {form.image_url ? (
              <img
                src={form.image_url}
                className="h-40 mx-auto rounded-xl object-cover"
              />
            ) : (
              <>
                <ImageIcon className="mx-auto mb-2 text-gray-400" />
                <p>Subir imagen</p>
              </>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            onChange={handleImage}
            className="hidden"
          />

          {/* SWITCHES */}
          <div className="flex justify-between items-center">
            <span>Disponible</span>
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
            <span>Extras</span>
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

          {/* EXTRAS UI */}
          {form.has_extras && (
            <div className="space-y-3">
              {form.extras.map((e) => (
                <div key={e.id} className="flex gap-2">
                  <input
                    placeholder="Nombre"
                    value={e.name}
                    onChange={(ev) =>
                      updateExtra(e.id, "name", ev.target.value)
                    }
                    className="flex-1 border px-3 py-2 rounded-xl"
                  />
                  <input
                    type="number"
                    value={e.price}
                    onChange={(ev) =>
                      updateExtra(
                        e.id,
                        "price",
                        Number(ev.target.value)
                      )
                    }
                    className="w-24 border px-3 py-2 rounded-xl"
                  />
                  <button onClick={() => removeExtra(e.id)}>
                    <Trash2 />
                  </button>
                </div>
              ))}

              <button onClick={addExtra} className="text-green-600">
                + Agregar extra
              </button>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 flex gap-3 border-t">
          <button
            onClick={onClose}
            className="flex-1 border rounded-xl py-3"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-green-600 text-white rounded-xl py-3"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}