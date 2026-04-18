"use client";

import { useBusiness } from "@/hooks/useBusiness";
import { useState } from "react";

export default function StoreLink() {
  const { business, loading } = useBusiness();
  const [copied, setCopied] = useState(false);

  if (loading || !business?.slug) return null;

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
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">

      {/* HEADER */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Tu tienda online
        </p>

        <p className="text-primary font-semibold text-lg truncate">
          {url}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 flex-wrap">

        {/* COPY */}
        <button
          onClick={copyLink}
          className="px-5 py-2 rounded-lg border border-border text-sm transition hover:bg-muted"
        >
          {copied ? "✅ Copiado" : "Copiar enlace"}
        </button>

        {/* OPEN */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm transition hover:opacity-90"
        >
          Abrir tienda
        </a>

      </div>
    </div>
  );
}