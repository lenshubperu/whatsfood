"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export type Business = {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  is_open: boolean;
  whatsapp_message: string;

  phone?: string;
  address?: string;
  google_maps?: string;
  hours?: string;

  products_count?: number;

  plan?: string;
  renewal_date?: string;

  logo_url?: string; // 🔥 NUEVO
};

type BusinessContextType = {
  business: Business | null;
  loading: boolean;
  setBusiness: React.Dispatch<React.SetStateAction<Business | null>>;
};

const BusinessContext = createContext<BusinessContextType | null>(null);

// ✅ SLUG LIMPIO
function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function BusinessProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: any;

    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      let finalBusiness: Business | null = null;

      // 🔍 buscar negocio
      const { data } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      // 👉 crear si no existe
      if (!data) {
        const defaultName = "Mi restaurante";

        let slug = generateSlug(defaultName);

        // evitar duplicado
        const { data: existing } = await supabase
          .from("businesses")
          .select("id")
          .eq("slug", slug)
          .maybeSingle();

        if (existing) {
          slug = `${slug}-${Math.floor(Math.random() * 9999)}`;
        }

        const { data: newBusiness } = await supabase
          .from("businesses")
          .insert({
            user_id: user.id,
            name: defaultName,
            slug,
            is_open: true,
            whatsapp_message:
              "Hola 👋, quiero hacer un pedido.",
            phone: "",
            plan: "Free",
          })
          .select()
          .single();

        finalBusiness = newBusiness;
      } else {
        finalBusiness = data;
      }

      // 📊 contar productos
      if (finalBusiness?.id) {
        const { count } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("business_id", finalBusiness.id);

        finalBusiness.products_count = count || 0;
      }

      setBusiness(finalBusiness);

      // =========================
      // 🔥 REALTIME LIMPIO (FIX PRO)
      // =========================
      if (finalBusiness?.id) {
        const channelName = `business-${finalBusiness.id}`;

        const existingChannel = supabase
          .getChannels()
          .find((c) => c.topic === channelName);

        if (existingChannel) {
          supabase.removeChannel(existingChannel);
        }

        channel = supabase
          .channel(channelName)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "businesses",
              filter: `id=eq.${finalBusiness.id}`,
            },
            (payload) => {
              if (!payload.new) return;

              console.log("🔥 REALTIME BUSINESS:", payload);

              // 🔥 merge seguro (CLAVE)
              setBusiness((prev) => ({
                ...prev,
                ...(payload.new as Business),
              }));
            }
          )
          .subscribe();
      }

      setLoading(false);
    };

    load();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return (
    <BusinessContext.Provider value={{ business, loading, setBusiness }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusinessContext() {
  const ctx = useContext(BusinessContext);

  if (!ctx) {
    throw new Error("useBusinessContext must be used inside BusinessProvider");
  }

  return ctx;
}