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

type Product = {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  is_available: boolean;
  extras?: Extra[];
};

interface Props {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}

export default function ProductModal({
  open,
  onClose,
  product,
}: Props) {
  const { business } = useBusinessContext();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    category: "Hamburguesas",
    image_url: "",
    is_available: true,
    extras: [],
  });

  const [hasExtras, setHasExtras] = useState(false);

  // 🔄 LOAD PRODUCT
  useEffect(() => {
    if (product) {
      setForm(product);
      setImagePreview(product.image_url || "");
      setHasExtras((product.extras?.length || 0) > 0);
    } else {
      setForm({
        name: "",
        description: "",
        price: 0,
        category: "Hamburguesas",
        image_url: "",
        is_available: true,
        extras: [],
      });
      setImagePreview("");
      setHasExtras(false);
    }
  }, [product]);

  if (!open) return null;

  // 📸 IMAGE UPLOAD PREVIEW
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ☁️ SUBIR IMAGEN
  const uploadImage = async () => {
    if (!imageFile || !business?.id) return form.image_url;

    const filePath = `${business.id}/${Date.now()}-${imageFile.name}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(filePath, imageFile);

    if (error) {
      console.error(error);
      return form.image_url;
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // ➕ EXTRAS
  const addExtra = () => {
    setForm({
      ...form,
      extras: [
        ...(form.extras || []),
        { id: Date.now().toString(), name: "", price: 0 },
      ],
    });
  };

  const updateExtra = (id: string, field: "name" | "price", value: any) => {
    setForm({
      ...form,
      extras: form.extras?.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    });
  };

  const removeExtra = (id: string) => {
    setForm({
      ...form,
      extras: form.extras?.filter((e) => e.id !== id),
    });
  };

  // 💾 SAVE
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business?.id) return;

    setSaving(true);

    const imageUrl = await uploadImage();

    const payload = {
      ...form,
      image_url: imageUrl,
      business_id: business.id,
      extras: hasExtras ? form.extras : [],
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 flex justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {product ? "Editar producto" : "Nuevo producto"}
            </h2>
            <p className="text-green-100 text-sm">
              Completa la información del producto
            </p>
          </div>

          <button onClick={onClose} className="bg-white/20 p-2 rounded-xl">
            <X className="text-white" />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSave}
          className="overflow-y-auto max-h-[calc(90vh-120px)]"
        >
          <div className="p-8 space-y-8">

            {/* INFO */}
            <div className="space-y-4">
              <input
                placeholder="Nombre"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="input"
              />

              <textarea
                placeholder="Descripción"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="input"
              />

              <input
                type="number"
                placeholder="Precio"
                value={form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: Number(e.target.value),
                  })
                }
                className="input"
              />
            </div>

            {/* IMAGE */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  className="w-full h-40 object-cover rounded-xl"
                />
              ) : (
                <ImageIcon className="mx-auto" />
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* DISPONIBLE */}
            <div className="flex justify-between">
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

            {/* EXTRAS */}
            <div>
              <div className="flex justify-between">
                <h3>Extras</h3>

                <input
                  type="checkbox"
                  checked={hasExtras}
                  onChange={() => setHasExtras(!hasExtras)}
                />
              </div>

              {hasExtras && (
                <div className="space-y-2 mt-3">
                  {form.extras?.map((extra) => (
                    <div key={extra.id} className="flex gap-2">
                      <input
                        placeholder="Nombre"
                        value={extra.name}
                        onChange={(e) =>
                          updateExtra(
                            extra.id,
                            "name",
                            e.target.value
                          )
                        }
                        className="input flex-1"
                      />

                      <input
                        type="number"
                        value={extra.price}
                        onChange={(e) =>
                          updateExtra(
                            extra.id,
                            "price",
                            Number(e.target.value)
                          )
                        }
                        className="input w-24"
                      />

                      <button
                        type="button"
                        onClick={() => removeExtra(extra.id)}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  ))}

                  <button type="button" onClick={addExtra}>
                    + Agregar extra
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border rounded-xl py-3"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-green-600 text-white rounded-xl py-3"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}