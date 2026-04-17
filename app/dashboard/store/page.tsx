"use client";

import { useBusiness } from "@/lib/useBusiness";

export default function StorePage() {
  const business = useBusiness();

  const url = `https://whatsfoodperu.com/${business?.slug}`;

  const copy = () => {
    navigator.clipboard.writeText(url);
    alert("Copiado");
  };

  return (
    <div className="space-y-4">

      <h2 className="text-xl font-semibold">Tu tienda</h2>

      <div className="bg-white p-4 rounded-xl shadow-sm">

        <p className="text-sm text-gray-500">
          Link público
        </p>

        <p className="font-medium mt-2">{url}</p>

        <div className="flex gap-2 mt-4">
          <button onClick={copy} className="bg-black text-white px-4 py-2 rounded-xl">
            Copiar
          </button>

          <a
            href={url}
            target="_blank"
            className="border px-4 py-2 rounded-xl"
          >
            Abrir
          </a>
        </div>

      </div>

    </div>
  );
}