"use client";

import { useBusiness } from "@/lib/useBusiness";

export default function StoreLink() {
  const business = useBusiness();

  if (!business) return null;

  const url = `https://whatsfoodperu.com/${business.slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    alert("Link copiado");
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-6">

      <p className="text-sm text-gray-600 mb-2">
        Tu tienda online
      </p>

      <p className="text-green-700 font-semibold mb-4">
        {url}
      </p>

      <div className="flex gap-4">
        <button
          onClick={copyLink}
          className="px-5 py-2 border rounded-xl"
        >
          Copiar enlace
        </button>

        <a
          href={url}
          target="_blank"
          className="px-5 py-2 bg-green-600 text-white rounded-xl"
        >
          Abrir tienda
        </a>
      </div>
    </div>
  );
}