"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useBusinessContext } from "@/app/context/BusinessProvider";
import { X } from "lucide-react";
import { Product } from "@/app/dashboard/products/page";

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

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
  });

  useEffect(() => {
    if (product) {
      setForm(product);
    } else {
      setForm({
        name: "",
        description: "",
        price: 0,
        category: "",
      });
    }
  }, [product]);

  if (!open) return null;

  const handleSave = async () => {
    if (!business?.id) return;

    if (product) {
      await supabase
        .from("products")
        .update(form)
        .eq("id", product.id);
    } else {
      await supabase.from("products").insert({
        ...form,
        business_id: business.id,
        is_available: true,
        has_extras: false,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {product ? "Editar producto" : "Nuevo producto"}
          </h2>

          <X onClick={onClose} className="cursor-pointer" />
        </div>

        <input
          placeholder="Nombre"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="w-full border p-3 rounded-lg mb-3"
        />

        <textarea
          placeholder="Descripción"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="w-full border p-3 rounded-lg mb-3"
        />

        <input
          type="number"
          placeholder="Precio"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: Number(e.target.value) })
          }
          className="w-full border p-3 rounded-lg mb-4"
        />

        <button
          onClick={handleSave}
          className="w-full bg-green-600 text-white py-3 rounded-lg"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}