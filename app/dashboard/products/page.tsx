"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useBusiness } from "@/hooks/useBusiness"; // 👈 asegúrate que la ruta sea correcta

type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  business_id: string;
};

export default function ProductsPage() {
  // ✅ CORRECTO
  const { business, loading } = useBusiness();

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    // 🚨 evita crash
    if (!business?.id) return;

    const load = async () => {
      setLoadingProducts(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("business_id", business.id);

      if (error) {
        console.error("Error loading products:", error);
      } else {
        setProducts(data || []);
      }

      setLoadingProducts(false);
    };

    load();
  }, [business]);

  // 🧠 loading inicial
  if (loading) {
    return <div className="p-6">Cargando negocio...</div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Productos</h2>

        <button className="bg-black text-white px-4 py-2 rounded-xl text-sm">
          + Agregar producto
        </button>
      </div>

      {/* LOADING PRODUCTS */}
      {loadingProducts ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
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
                  <span className="font-semibold">S/ {p.price}</span>

                  <button className="text-sm text-red-500">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* 👇 estado vacío */}
          {products.length === 0 && (
            <p className="text-gray-500">No tienes productos aún</p>
          )}
        </div>
      )}
    </div>
  );
}