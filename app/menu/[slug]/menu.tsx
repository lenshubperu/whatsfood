"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import ProductModal from "@/components/menu/ProductModal";
import CheckoutModal from "@/components/checkout/CheckoutModal";

type Extra = { id: string; name: string; price: number };

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  is_available: boolean;
  extras?: Extra[];
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  extras: Extra[];
};

export default function MenuPage({ params }: { params: { slug: string } }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("Todo");

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [openCheckout, setOpenCheckout] = useState(false);

  const [business, setBusiness] = useState<any>(null);

  /* ================= LOAD ================= */
  useEffect(() => {
    const load = async () => {
      // 🔥 negocio
      const { data: biz } = await supabase
        .from("businesses")
        .select("*")
        .eq("slug", params.slug)
        .single();

      setBusiness(biz);

      // 🔥 productos
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("business_id", biz.id)
        .eq("is_available", true);

      setProducts(data || []);

      const cats = [
        "Todo",
        ...new Set((data || []).map((p: any) => p.category)),
      ];
      setCategories(cats);
    };

    load();
  }, [params.slug]);

  /* ================= CART ================= */
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (p) =>
          p.id === item.id &&
          JSON.stringify(p.extras) === JSON.stringify(item.extras)
      );

      if (existing) {
        return prev.map((p) =>
          p === existing
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }

      return [...prev, item];
    });
  };

  const total = useMemo(
    () =>
      cart.reduce(
        (acc, item) =>
          acc +
          (item.price +
            item.extras.reduce((a, e) => a + e.price, 0)) *
            item.quantity,
        0
      ),
    [cart]
  );

  const filtered =
    activeCategory === "Todo"
      ? products
      : products.filter((p) => p.category === activeCategory);

  if (!business) return null;

  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <div className="relative h-48">
        <img
          src="/cover.jpg"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-xl font-bold">{business.name}</h1>
          <p className="text-sm opacity-80">Abierto ahora</p>
        </div>
      </div>

      {/* CATEGORÍAS */}
      <div className="flex gap-2 overflow-x-auto p-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm ${
              activeCategory === cat
                ? "bg-green-500 text-white"
                : "bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LISTA */}
      <div className="p-4 space-y-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedProduct(p)}
            className="flex gap-3 border rounded-xl p-3 cursor-pointer"
          >
            <img
              src={p.image_url || "/food.png"}
              className="w-20 h-20 rounded-xl object-cover"
            />

            <div className="flex-1">
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-gray-500 line-clamp-1">
                {p.description}
              </p>
              <p className="font-bold mt-1">S/ {p.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FLOAT CART */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4">
          <button
            onClick={() => setOpenCheckout(true)}
            className="w-full bg-green-500 text-white py-4 rounded-xl font-bold flex justify-between px-6"
          >
            <span>Ver pedido ({cart.length})</span>
            <span>S/ {total.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* PRODUCT MODAL */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAdd={addToCart}
        />
      )}

      {/* CHECKOUT */}
      {openCheckout && (
        <CheckoutModal
          cart={cart}
          total={total}
          business={business}
          onClose={() => setOpenCheckout(false)}
        />
      )}
    </div>
  );
}