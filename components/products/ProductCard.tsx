"use client";

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
      onClick={() => onEdit(product)}
      className="cursor-pointer rounded-2xl overflow-hidden border border-border bg-card hover:shadow-lg transition"
    >
      {/* IMAGE */}
      <div className="h-40 bg-muted relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            className="w-full h-full object-cover"
          />
        ) : null}

        <div className="absolute top-2 left-2 bg-white px-3 py-1 rounded-full text-xs">
          {product.category || "General"}
        </div>

        <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs">
          {product.is_available ? "Disponible" : "Oculto"}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <p className="font-semibold">{product.name}</p>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        <p className="mt-2 font-bold text-green-600">
          S/ {product.price}
        </p>
      </div>
    </div>
  );
}