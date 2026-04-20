"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useBusinessContext } from "@/app/context/BusinessProvider";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const TYPES = [
  { id: "yape", label: "Yape" },
  { id: "plin", label: "Plin" },
  { id: "transfer", label: "Transferencia" },
  { id: "card", label: "Tarjeta" },
];

export default function AddPaymentModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const { business } = useBusinessContext();

  const [type, setType] = useState("yape");
  const [number, setNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  // 📱 Validación Perú
  const isValidPhone = (num: string) => {
    const clean = num.replace(/\D/g, "");
    return clean.length === 9 && clean.startsWith("9");
  };

  const handleSave = async () => {
    if (!business) return;

    if (type === "yape" || type === "plin") {
      if (!isValidPhone(number)) {
        toast.error("Número inválido");
        return;
      }
    }

    setLoading(true);

    const { error } = await supabase
      .from("payment_methods")
      .insert({
        business_id: business.id,
        type,
        number,
        holder,
        enabled: true,
      });

    setLoading(false);

    if (error) {
      toast.error("Error al guardar");
      return;
    }

    toast.success("Método agregado");

    onCreated(); // 🔄 recargar lista
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X />
        </button>

        <h2 className="text-lg font-semibold mb-4">
          Agregar método de pago
        </h2>

        {/* TYPE */}
        <div className="mb-4">
          <label className="text-sm font-medium">Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full mt-1 border rounded-xl px-3 py-2"
          >
            {TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* NUMBER */}
        {(type === "yape" || type === "plin") && (
          <div className="mb-4">
            <label className="text-sm font-medium">
              Número
            </label>
            <input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="999999999"
              className="w-full mt-1 border rounded-xl px-3 py-2"
            />
          </div>
        )}

        {/* HOLDER */}
        <div className="mb-6">
          <label className="text-sm font-medium">
            Titular
          </label>
          <input
            value={holder}
            onChange={(e) => setHolder(e.target.value)}
            placeholder="Nombre del titular"
            className="w-full mt-1 border rounded-xl px-3 py-2"
          />
        </div>

        {/* CTA */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
}