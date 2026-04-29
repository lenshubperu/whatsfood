"use client";

import { useState } from "react";
import ProductModal from "@/components/menu/ProductModal";
import CheckoutModal from "@/components/checkout/CheckoutModal";

const mockBusiness = {
  name: "Pan Negocios",
  phone: "987654321",
  payment_methods: ["Yape", "Plin", "Efectivo"],
};

const mockProducts = [
  {
    id: "1",
    name: "Burger Clásica",
    description: "Carne, lechuga, tomate",
    price: 18,
    category: "Burgers",
    image_url: "/food/burger.png",
    is_available: true,
    extras: [
      { id: "e1", name: "Queso extra", price: 2 },
      { id: "e2", name: "Tocino", price: 3 },
    ],
  },
  {
    id: "2",
    name: "Papas fritas",
    description: "Crocantes",
    price: 8,
    category: "Extras",
    image_url: "/food/fries.png",
    is_available: true,
    extras: [],
  },
];

export default function DemoMenu() {
  const [selected, setSelected] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [openCheckout, setOpenCheckout] = useState(false);

  const addToCart = (item: any) => {
    setCart((prev) => [...prev, item]);
  };

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="p-4 space-y-4">

      <h1 className="text-xl font-bold">{mockBusiness.name}</h1>

      {mockProducts.map((p) => (
        <div
          key={p.id}
          onClick={() => setSelected(p)}
          className="border p-3 rounded-xl"
        >
          <p className="font-bold">{p.name}</p>
          <p>S/ {p.price}</p>
        </div>
      ))}

      {cart.length > 0 && (
        <button
          onClick={() => setOpenCheckout(true)}
          className="fixed bottom-4 left-4 right-4 bg-green-500 text-white p-4 rounded-xl"
        >
          Ver pedido - S/ {total}
        </button>
      )}

      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
          onAdd={addToCart}
        />
      )}

      {openCheckout && (
        <CheckoutModal
          cart={cart}
          total={total}
          business={mockBusiness}
          onClose={() => setOpenCheckout(false)}
        />
      )}
    </div>
  );
}