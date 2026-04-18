"use client";

import { useState, useEffect } from "react";
import { useBusinessContext } from "@/app/context/BusinessProvider";
import { supabase } from "@/lib/supabase/client";

import ProductsHeader from "@/components/products/ProductsHeader";
import ProductsGrid from "@/components/products/ProductsGrid";
import ProductModal from "@/components/products/ProductModal";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  is_available: boolean;
  has_extras: boolean;
};

export default function ProductsPage() {
  const { business, loading } = useBusinessContext();

  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  // 🔥 LOAD + REALTIME
  useEffect(() => {
    if (!business?.id) return;

    const load = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("business_id", business.id)
        .order("created_at", { ascending: false });

      setProducts(data || []);
    };

    load();

    const channel = supabase
      .channel("products-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
          filter: `business_id=eq.${business.id}`,
        },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [business?.id]);

  if (loading) return <p className="p-6">Cargando...</p>;
  if (!business) return <p>Error</p>;

  return (
    <div className="space-y-6">

      <ProductsHeader
        count={products.length}
        onAdd={() => {
          setEditing(null);
          setOpen(true);
        }}
      />

      <ProductsGrid
        products={products}
        onEdit={(p) => {
          setEditing(p);
          setOpen(true);
        }}
      />

      <ProductModal
        open={open}
        onClose={() => setOpen(false)}
        product={editing}
      />

    </div>
  );
}