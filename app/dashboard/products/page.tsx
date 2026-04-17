"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useBusiness } from "@/lib/useBusiness";

export default function ProductsPage() {
  const business = useBusiness();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!business) return;

    const load = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("business_id", business.id);

      setProducts(data || []);
    };

    load();
  }, [business]);

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          Productos
        </h2>

        <button className="bg-black text-white px-4 py-2 rounded-xl text-sm">
          + Agregar producto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">

            <img
              src={p.image_url || "/food.jpg"}
              className="w-full h-40 object-cover"
            />

            <div className="p-4">

              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {p.description}
              </p>

              <div className="flex justify-between items-center mt-3">

                <span className="font-semibold">
                  S/ {p.price}
                </span>

                <button className="text-sm text-red-500">
                  Eliminar
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}