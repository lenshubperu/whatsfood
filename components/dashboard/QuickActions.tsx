"use client";

import { useRouter } from "next/navigation";
import { useBusiness } from "@/lib/useBusiness";

export default function QuickActions() {
  const router = useRouter();
  const { business } = useBusiness();

  const storeUrl = business?.slug
    ? `https://whatsfoodperu.com/${business.slug}`
    : null;

  return (
    <div>
      <p className="font-semibold mb-4">Acciones rápidas</p>

      <div className="grid md:grid-cols-3 gap-4">

        {/* ➕ AGREGAR PRODUCTO */}
        <button
          onClick={() => router.push("/dashboard/products")}
          className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-2xl text-left transition shadow-sm"
        >
          <p className="text-lg font-semibold mb-1">
            ➕ Agregar producto
          </p>
          <p className="text-sm opacity-80">
            Crea nuevos productos para tu menú
          </p>
        </button>

        {/* ✏️ EDITAR CATÁLOGO */}
        <button
          onClick={() => router.push("/dashboard/products")}
          className="bg-white hover:bg-gray-50 p-6 rounded-2xl border text-left transition shadow-sm"
        >
          <p className="text-lg font-semibold mb-1">
            ✏️ Editar catálogo
          </p>
          <p className="text-sm text-gray-500">
            Gestiona productos y categorías
          </p>
        </button>

        {/* 🔗 VER TIENDA */}
        <button
          onClick={() => {
            if (storeUrl) window.open(storeUrl, "_blank");
          }}
          className="bg-white hover:bg-gray-50 p-6 rounded-2xl border text-left transition shadow-sm"
        >
          <p className="text-lg font-semibold mb-1">
            🔗 Ver tienda
          </p>
          <p className="text-sm text-gray-500">
            Abre tu tienda como cliente
          </p>
        </button>

      </div>
    </div>
  );
}