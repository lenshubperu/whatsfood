"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useBusinessContext } from "@/app/context/BusinessProvider";
import { useAutoSave } from "@/hooks/useAutoSave";
import Skeleton from "@/components/ui/Skeleton";

export default function DeliveryConfig() {
  const { business } = useBusinessContext();

  const [enabled, setEnabled] = useState(false);
  const [free, setFree] = useState(false);
  const [minEnabled, setMinEnabled] = useState(false);
  const [price, setPrice] = useState("0");
  const [min, setMin] = useState("0");

  const [loading, setLoading] = useState(true);

  // 🔥 AUTOSAVE HOOK
  const { trigger } = useAutoSave({
    saveFn: async (state: any) => {
      if (!business) return;

      await supabase.from("delivery_settings").upsert({
        business_id: business.id,
        enabled: state.enabled,
        price: Number(state.price),
        free_enabled: state.free,
        free_without_min: !state.minEnabled,
        free_with_min: state.minEnabled,
        min_amount: Number(state.min),
      });
    },
    successMessage: "Delivery actualizado",
  });

  // 🔥 LOAD + CREATE
  useEffect(() => {
    if (!business) return;

    const load = async () => {
      let { data } = await supabase
        .from("delivery_settings")
        .select("*")
        .eq("business_id", business.id)
        .single();

      if (!data) {
        const { data: created } = await supabase
          .from("delivery_settings")
          .insert({
            business_id: business.id,
            enabled: false,
            price: 0,
            free_enabled: false,
            free_without_min: false,
            free_with_min: false,
            min_amount: 0,
          })
          .select()
          .single();

        data = created;
      }

      if (data) {
        setEnabled(data.enabled);
        setPrice(String(data.price));
        setFree(data.free_enabled);
        setMinEnabled(data.free_with_min);
        setMin(String(data.min_amount));
      }

      setLoading(false);
    };

    load();
  }, [business]);

  // 🔁 UPDATE
  const update = (changes: any) => {
    const newState = {
      enabled,
      free,
      minEnabled,
      price,
      min,
      ...changes,
    };

    setEnabled(newState.enabled);
    setFree(newState.free);
    setMinEnabled(newState.minEnabled);
    setPrice(newState.price);
    setMin(newState.min);

    trigger(newState);
  };

  // 💎 SKELETON (PRO)
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-1/3" />

        <Skeleton className="h-20 w-full rounded-2xl" />

        <Skeleton className="h-24 w-full rounded-2xl" />

        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        Configuración de delivery
      </h2>

      {/* ENABLE */}
      <div className="flex items-center justify-between border rounded-2xl p-4">
        <div>
          <p className="font-medium">Habilitar delivery</p>
          <p className="text-sm text-gray-500">
            Permite pedidos a domicilio
          </p>
        </div>

        <Toggle
          value={enabled}
          onChange={(v) => update({ enabled: v })}
        />
      </div>

      {/* PRICE */}
      {enabled && (
        <>
          <div>
            <p className="mb-2 font-medium">Costo de delivery</p>

            <div className="flex items-center border rounded-xl px-3 py-2">
              <span className="mr-2 text-gray-500">S/</span>
              <input
                value={price}
                onChange={(e) =>
                  update({ price: e.target.value })
                }
                className="outline-none w-full"
              />
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Precio que pagarán tus clientes
            </p>
          </div>

          {/* FREE DELIVERY */}
          <div className="border rounded-2xl p-4 bg-green-50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium">Delivery gratis</p>
                <p className="text-sm text-gray-500">
                  Configura promociones
                </p>
              </div>

              <Toggle
                value={free}
                onChange={(v) => update({ free: v })}
              />
            </div>

            {free && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    Sin monto mínimo
                  </p>
                  <Toggle
                    value={!minEnabled}
                    onChange={(v) =>
                      update({ minEnabled: !v })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm">
                    Con monto mínimo
                  </p>
                  <Toggle
                    value={minEnabled}
                    onChange={(v) =>
                      update({ minEnabled: v })
                    }
                  />
                </div>

                {minEnabled && (
                  <div className="flex items-center border rounded-xl px-3 py-2">
                    <span className="mr-2 text-gray-500">S/</span>
                    <input
                      value={min}
                      onChange={(e) =>
                        update({ min: e.target.value })
                      }
                      className="outline-none w-full"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* 🔥 TOGGLE */
function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`
        w-12 h-6 rounded-full transition relative
        ${value ? "bg-green-500" : "bg-gray-300"}
      `}
    >
      <div
        className={`
          absolute top-1 w-4 h-4 bg-white rounded-full transition
          ${value ? "right-1" : "left-1"}
        `}
      />
    </button>
  );
}