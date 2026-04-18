"use client";

import ProductCard from "./ProductCard";
import { Product } from "@/app/dashboard/products/page";

export default function ProductsGrid({
  products,
  onEdit,
}: {
  products: Product[];
  onEdit: (p: Product) => void;
}) {
  if (products.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-20">
        No tienes productos aún
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onEdit={onEdit} />
      ))}
    </div>
  );
}