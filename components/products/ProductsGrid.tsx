"use client";

import ProductCard from "./ProductCard";
import { Product as DBProduct } from "@/app/dashboard/products/page";

type UIProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  is_available: boolean;
  extras?: {
    id: string;
    name: string;
    price: number;
  }[];
};

export default function ProductsGrid({
  products,
  onEdit,
  onDelete,
  onToggleVisibility,
}: {
  products: DBProduct[];
  onEdit: (p: DBProduct) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}) {
  const mappedProducts: UIProduct[] = products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    image_url: p.image_url,
    is_available: p.is_available,
    extras: p.has_extras ? p.extras || [] : [],
  }));

  if (mappedProducts.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-20">
        No tienes productos aún
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {mappedProducts.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onEdit={() => onEdit(p as DBProduct)}
          onDelete={() => onDelete(p.id)} // 🔥 FIX
          onToggleVisibility={() => onToggleVisibility(p.id)} // 🔥 FIX
        />
      ))}
    </div>
  );
}