"use client";

import { useEffect, useState } from "react";
import PaymentCard from "./PaymentCard";
import { Smartphone, Banknote, CreditCard, Landmark } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useBusinessContext } from "@/app/context/BusinessProvider";

type Method = {
  id: string;
  type: string;
  number?: string;
  holder?: string;
  enabled: boolean;
};

export default function PaymentMethods() {
  const { business } = useBusinessContext();
  const [methods, setMethods] = useState<Method[]>([]);

  // 🎨 CONFIG VISUAL (NO DB)
  const UI = {
    yape: {
      name: "Yape",
      color: "bg-purple-100 border-purple-300",
      icon: <Smartphone className="text-purple-600" />,
    },
    plin: {
      name: "Plin",
      color: "bg-blue-100 border-blue-300",
      icon: <Smartphone className="text-blue-600" />,
    },
    cash: {
      name: "Efectivo",
      color: "bg-green-100 border-green-300",
      icon: <Banknote className="text-green-600" />,
    },
    transfer: {
      name: "Transferencia",
      color: "bg-gray-100 border-gray-300",
      icon: <Landmark className="text-gray-600" />,
    },
    card: {
      name: "Tarjeta",
      color: "bg-pink-100 border-pink-300",
      icon: <CreditCard className="text-pink-600" />,
    },
  };

  // 🔥 CARGAR + CREAR DEFAULTS
  useEffect(() => {
    if (!business) return;

    const init = async () => {
      // traer existentes
      const { data } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("business_id", business.id);

      // si no hay → crear defaults
      if (!data || data.length === 0) {
        const defaults = ["yape", "plin", "cash", "transfer", "card"];

        await supabase.from("payment_methods").insert(
          defaults.map((type) => ({
            business_id: business.id,
            type,
            enabled: false,
          }))
        );
      }

      load();
    };

    init();
  }, [business]);

  // 🔄 LOAD
  const load = async () => {
    const { data } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("business_id", business?.id);

    setMethods(data || []);
  };

  // 🔁 TOGGLE
  const toggle = async (m: Method) => {
    await supabase
      .from("payment_methods")
      .update({ enabled: !m.enabled })
      .eq("id", m.id);

    setMethods((prev) =>
      prev.map((i) =>
        i.id === m.id ? { ...i, enabled: !i.enabled } : i
      )
    );
  };

  // ❌ DELETE
  const remove = async (id: string) => {
    await supabase
      .from("payment_methods")
      .delete()
      .eq("id", id);

    setMethods((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Métodos de pago
          </h2>
          <p className="text-sm text-gray-500">
            Configura cómo recibirás los pagos
          </p>
        </div>

        <button className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm">
          + Agregar
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {methods.map((m) => {
          const ui = UI[m.type as keyof typeof UI];

          return (
            <PaymentCard
              key={m.id}
              name={ui.name}
              number={m.number}
              holder={m.holder}
              active={m.enabled}
              onToggle={() => toggle(m)}
              onDelete={() => remove(m.id)}
              color={ui.color}
              icon={ui.icon}
            />
          );
        })}
      </div>
    </div>
  );
}