"use client";

import { Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export interface ProductExtra {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;

  // 🔥 BACKEND REAL
  image_url?: string;
  is_available: boolean;
  extras?: ProductExtra[];
}

interface Props {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  onToggleVisibility,
}: Props) {
  return (
    <div
      className="
        bg-white rounded-2xl border border-border overflow-hidden
        hover:shadow-2xl hover:-translate-y-1
        transition-all duration-300 group
      "
    >
      {/* 🖼 IMAGE */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <ImageWithFallback
          src={product.image_url || "/placeholder.png"}
          alt={product.name}
          className="
            w-full h-full object-cover
            group-hover:scale-105 transition-transform duration-300
          "
        />

        {/* 🟢 STATUS */}
        <div className="absolute top-3 right-3">
          <span
            className={`
              px-3 py-1.5 rounded-full text-xs font-semibold shadow-md
              ${
                product.is_available
                  ? "bg-green-500 text-white"
                  : "bg-gray-500 text-white"
              }
            `}
          >
            {product.is_available ? "Disponible" : "Oculto"}
          </span>
        </div>

        {/* 🏷 CATEGORY */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 shadow">
            {product.category}
          </span>
        </div>
      </div>

      {/* 📦 CONTENT */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-foreground mb-1 truncate">
          {product.name}
        </h3>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* 💰 PRICE + EXTRAS */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-2xl font-bold text-green-600">
            S/ {product.price.toFixed(2)}
          </p>

          {product.extras && product.extras.length > 0 && (
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-lg">
              +{product.extras.length} extras
            </span>
          )}
        </div>

        {/* ⚡ ACTIONS */}
        <div className="grid grid-cols-3 gap-2">
          {/* EDIT */}
          <button
            onClick={() => onEdit(product)}
            className="
              flex items-center justify-center gap-1.5 px-3 py-2.5
              bg-blue-50 text-blue-600 rounded-xl text-xs font-semibold
              hover:bg-blue-100 transition
            "
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>

          {/* TOGGLE */}
          <button
            onClick={() => onToggleVisibility(product.id)}
            className="
              flex items-center justify-center gap-1.5 px-3 py-2.5
              bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold
              hover:bg-gray-100 transition
            "
          >
            {product.is_available ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
            {product.is_available ? "Ocultar" : "Mostrar"}
          </button>

          {/* DELETE */}
          <button
            onClick={() => onDelete(product.id)}
            className="
              flex items-center justify-center gap-1.5 px-3 py-2.5
              bg-red-50 text-red-600 rounded-xl text-xs font-semibold
              hover:bg-red-100 transition
            "
          >
            <Trash2 className="w-4 h-4" />
            Borrar
          </button>
        </div>
      </div>
    </div>
  );
}