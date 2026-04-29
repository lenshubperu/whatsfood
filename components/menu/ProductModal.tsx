"use client";

import { useState } from "react";

export default function ProductModal({ product, onClose, onAdd }: any) {
  const [qty, setQty] = useState(1);
  const [extras, setExtras] = useState<any[]>([]);

  const toggleExtra = (e: any) => {
    setExtras((prev) =>
      prev.find((x) => x.id === e.id)
        ? prev.filter((x) => x.id !== e.id)
        : [...prev, e]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end z-50">
      <div className="bg-white w-full p-4 rounded-t-2xl">

        <h2 className="font-bold text-lg">{product.name}</h2>

        {/* EXTRAS */}
        {product.extras?.map((e: any) => (
          <label key={e.id} className="flex justify-between py-2">
            <span>{e.name}</span>
            <input
              type="checkbox"
              onChange={() => toggleExtra(e)}
            />
          </label>
        ))}

        {/* QTY */}
        <div className="flex justify-between items-center mt-4">
          <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
          <span>{qty}</span>
          <button onClick={() => setQty(qty + 1)}>+</button>
        </div>

        <button
          onClick={() => {
            onAdd({
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: qty,
              extras,
            });
            onClose();
          }}
          className="w-full bg-green-500 text-white py-3 rounded-xl mt-4"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}