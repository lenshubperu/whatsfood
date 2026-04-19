"use client";

import { useState, useEffect } from "react";
import { useBusinessContext } from "@/app/context/BusinessProvider";
import { supabase } from "@/lib/supabase/client";

import ProductsHeader from "@/components/products/ProductsHeader";
import ProductsGrid from "@/components/products/ProductsGrid";
import ProductModal from "@/components/products/ProductModal";
import ProductsFilters from "@/components/products/ProductsFilters";

/* =========================
   🔥 TYPE GLOBAL
========================= */
export type ProductExtra = {
  id: string;
  name: string;
  price: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  is_available: boolean;
  has_extras: boolean;
  extras?: ProductExtra[];
};

export default function ProductsPage() {
  const { business, loading } = useBusinessContext();

  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  // 🔍 filtros
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showHidden, setShowHidden] = useState(false);

  /* =========================
     🔥 LOAD + REALTIME
  ========================= */
  useEffect(() => {
    if (!business?.id) return;

    const load = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("business_id", business.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error cargando productos:", error);
        return;
      }

      const normalized = (data || []).map((p: any) => ({
        ...p,
        extras: p.extras ?? [],
      }));

      setProducts(normalized);
    };

    load();

    const channel = supabase
      .channel(`products-${business.id}`)
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

  /* =========================
     🚀 ESTADO OPTIMISTA
  ========================= */
  const handleCreated = (newProduct: Product) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === newProduct.id);
      if (exists) return prev; // evita duplicado
      return [newProduct, ...prev];
    });
  };

  /* =========================
     🔄 LOADING / ERROR
  ========================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground">Cargando catálogo...</p>
      </div>
    );
  }

  if (!business) {
    return <p className="p-6">Error cargando negocio</p>;
  }

  /* =========================
     🧠 CATEGORÍAS
  ========================= */
  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  /* =========================
     🔍 FILTRO FINAL
  ========================= */
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory = category
      ? p.category === category
      : true;

    const matchHidden = showHidden ? true : p.is_available;

    return matchSearch && matchCategory && matchHidden;
  });

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <ProductsHeader
        count={products.length}
        onAdd={() => {
          setEditing(null);
          setOpen(true);
        }}
      />

      {/* FILTROS */}
      <ProductsFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        showHidden={showHidden}
        setShowHidden={setShowHidden}
        categories={categories}
      />

      {/* GRID */}
      <ProductsGrid
        products={filteredProducts}
        onEdit={(p) => {
          setEditing(p);
          setOpen(true);
        }}
      />

      {/* MODAL */}
      <ProductModal
        open={open}
        onClose={() => setOpen(false)}
        product={editing}
        onCreated={handleCreated} // 🔥 CLAVE
      />

    </div>
  );
}