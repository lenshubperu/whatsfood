"use client";

import { useState, useEffect } from "react";
import { useBusinessContext } from "@/app/context/BusinessProvider";
import { supabase } from "@/lib/supabase/client";
import { getPlanConfig } from "@/lib/getPlan";

import ProductsHeader from "@/components/products/ProductsHeader";
import ProductsGrid from "@/components/products/ProductsGrid";
import ProductModal from "@/components/products/ProductModal";
import ProductsFilters from "@/components/products/ProductsFilters";

/* =========================
   🔥 TYPES
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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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
     🚀 CREATE (con bloqueo PRO)
  ========================= */
  const handleOpenCreate = () => {
    if (!business) return; // 🔥 FIX TYPESCRIPT

    const config = getPlanConfig(business.plan || "free");

    if (products.length >= config.maxProducts) {
      setShowUpgradeModal(true);
      return;
    }

    setEditing(null);
    setOpen(true);
  };

  const handleCreated = (newProduct: Product) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === newProduct.id);
      if (exists) return prev;
      return [newProduct, ...prev];
    });
  };

  /* =========================
     🗑 DELETE
  ========================= */
  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error eliminando:", error);
      return;
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  /* =========================
     👁 TOGGLE VISIBILITY
  ========================= */
  const handleToggleVisibility = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const newValue = !product.is_available;

    const { error } = await supabase
      .from("products")
      .update({ is_available: newValue })
      .eq("id", id);

    if (error) {
      console.error("Error actualizando:", error);
      return;
    }

    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, is_available: newValue } : p
      )
    );
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
        onAdd={handleOpenCreate}
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
        onDelete={handleDelete}
        onToggleVisibility={handleToggleVisibility}
      />

      {/* MODAL CREAR */}
      <ProductModal
        key={editing?.id || "new"}
        open={open}
        onClose={() => setOpen(false)}
        product={editing}
        onCreated={handleCreated}
      />

      {/* 🔥 MODAL UPGRADE */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl text-center max-w-sm w-full">

            <h2 className="text-lg font-bold mb-2">
              Límite alcanzado 🚫
            </h2>

            <p className="text-sm text-gray-500 mb-4">
              Tu plan actual permite solo {getPlanConfig(business.plan).maxProducts} productos.
            </p>

            <img src="/yape.png" className="w-40 mx-auto mb-4" />

            <p className="text-sm">
              Mejora a <strong>PRO</strong> por <strong>S/15</strong>
            </p>

            <button
              onClick={() => setShowUpgradeModal(false)}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            >
              Entendido
            </button>

          </div>
        </div>
      )}

    </div>
  );
}