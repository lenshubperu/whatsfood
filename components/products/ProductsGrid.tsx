"use client";

import ProductCard from "./ProductCard";
import { Product } from "@/app/dashboard/products/page";
import { supabase } from "@/lib/supabase/client";
import { useBusinessContext } from "@/app/context/BusinessProvider";

export default function ProductsGrid({
  products,
  onEdit,
}: {
  products: Product[];
  onEdit: (p: Product) => void;
}) {
  const { business } = useBusinessContext();

  if (!products || products.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-20">
        No tienes productos aún
      </div>
    );
  }

  // 🗑 ELIMINAR
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("¿Eliminar producto?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Error al eliminar");
    }
  };

  // 👁 TOGGLE VISIBILIDAD
  const handleToggleVisibility = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const { error } = await supabase
      .from("products")
      .update({
        is_available: !product.is_available,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Error al actualizar");
    }
  };

  return (
    <div
      className="
        grid gap-5
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onEdit={onEdit}
          onDelete={handleDelete}
          onToggleVisibility={handleToggleVisibility}
        />
      ))}
    </div>
  );
}