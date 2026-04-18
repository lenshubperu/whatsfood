"use client";

import { useBusiness } from "@/hooks/useBusiness";
import { useState } from "react";

export default function StoreLink() {
  const { business, loading } = useBusiness();
  const [copied, setCopied] = useState(false);

  if (loading) return null;
  if (!business?.slug) return null;

  const url = `https://whatsfoodperu.com/${business.slug}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
      alert("No se pudo copiar el enlace");
    }
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-6">

      {/* HEADER */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Tu tienda online
        </p>

        <p className="text-green-700 font-semibold text-lg truncate">
          {url}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 flex-wrap">

        <button
          onClick={copyLink}
          className="px-5 py-2 border rounded-xl hover:bg-gray-50 transition"
        >
          {copied ? "✅ Copiado" : "Copiar enlace"}
        </button>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition"
        >
          Abrir tienda
        </a>

      </div>

    </div>
  );
}