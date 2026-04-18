"use client";

import {
  Pencil,
  EyeOff,
  Trash2,
} from "lucide-react";
import { Product } from "@/app/dashboard/products/page";

export default function ProductCard({
  product,
  onEdit,
}: {
  product: Product;
  onEdit: (p: Product) => void;
}) {
  return (
    <div
      className="
        group relative rounded-3xl overflow-hidden
        border border-border bg-card
        shadow-sm hover:shadow-xl
        transition-all duration-300
        hover:-translate-y-1
      "
    >
      {/* 🖼 IMAGE */}
      <div className="relative h-44 overflow-hidden">

        <img
          src={
            product.image_url ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
          }
          className="
            w-full h-full object-cover
            transition-transform duration-500
            group-hover:scale-105
          "
        />

        {/* 🌫 overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition" />

        {/* 🏷 CATEGORY */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">
          {product.category || "General"}
        </div>

        {/* ✅ STATUS */}
        <div
          className={`
            absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white
            ${
              product.is_available
                ? "bg-green-500"
                : "bg-gray-500"
            }
          `}
        >
          {product.is_available ? "Disponible" : "Oculto"}
        </div>
      </div>

      {/* 📦 CONTENT */}
      <div className="p-5">

        {/* TITLE */}
        <p className="text-lg font-semibold text-foreground">
          {product.name}
        </p>

        {/* DESC */}
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {product.description}
        </p>

        {/* 💰 PRICE + EXTRAS */}
        <div className="flex items-center justify-between mt-4">

          <p className="text-2xl font-bold text-green-600">
            S/ {product.price.toFixed(2)}
          </p>

          {product.has_extras && (
            <span className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">
              + extras
            </span>
          )}
        </div>

        {/* ⚡ ACTIONS */}
        <div className="flex gap-2 mt-5">

          {/* EDIT */}
          <button
            onClick={() => onEdit(product)}
            className="
              flex-1 flex items-center justify-center gap-1
              bg-blue-50 text-blue-600
              py-2 rounded-xl text-sm font-medium
              hover:bg-blue-100 transition
            "
          >
            <Pencil className="w-4 h-4" />
            Editar
          </button>

          {/* HIDE */}
          <button
            className="
              flex-1 flex items-center justify-center gap-1
              bg-muted text-muted-foreground
              py-2 rounded-xl text-sm font-medium
              hover:bg-accent transition
            "
          >
            <EyeOff className="w-4 h-4" />
            Ocultar
          </button>

          {/* DELETE */}
          <button
            className="
              flex-1 flex items-center justify-center gap-1
              bg-red-50 text-red-600
              py-2 rounded-xl text-sm font-medium
              hover:bg-red-100 transition
            "
          >
            <Trash2 className="w-4 h-4" />
            Borrar
          </button>
        </div>
      </div>

      {/* ✨ GLOW HOVER */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.15),transparent_60%)]" />
      </div>
    </div>
  );
}