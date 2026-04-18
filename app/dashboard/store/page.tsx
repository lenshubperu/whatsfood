"use client";

import { useBusiness } from "@/hooks/useBusiness";

export default function StorePage() {
  const { business, loading } = useBusiness();

  const url = `https://whatsfoodperu.com/${business?.slug}`;

  const copy = () => {
    navigator.clipboard.writeText(url);
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Tu tienda</h2>

      <p className="text-gray-500">{url}</p>

      <button
        onClick={copy}
        className="bg-black text-white px-4 py-2 rounded-xl text-sm"
      >
        Copiar link
      </button>
    </div>
  );
}