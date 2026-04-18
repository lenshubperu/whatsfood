"use client";

import { useState } from "react";
import { useBusiness } from "@/hooks/useBusiness";

export default function StoreLink() {
  const { business, loading } = useBusiness();
  const [copied, setCopied] = useState(false);

  if (loading || !business) return null;

  const url = business.slug
    ? `https://whatsfoodperu.com/${business.slug}`
    : null;

  const copyLink = async () => {
    if (!url) return;

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
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">

      {/* HEADER */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Tu tienda online
        </p>

        <p className="text-primary font-semibold text-lg truncate">
          {url || "Generando enlace..."}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 flex-wrap">

        {/* COPY */}
        <button
          onClick={copyLink}
          disabled={!url}
          className="px-5 py-2 rounded-lg border border-border text-sm transition hover:bg-muted disabled:opacity-50"
        >
          {copied ? "✅ Copiado" : "Copiar enlace"}
        </button>

        {/* OPEN */}
        <a
          href={url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={`px-5 py-2 rounded-lg text-sm transition ${
            url
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "bg-muted text-muted-foreground pointer-events-none"
          }`}
        >
          Abrir tienda
        </a>

      </div>
    </div>
  );
}