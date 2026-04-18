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
};

type BusinessContextType = {
  business: Business | null;
  loading: boolean;
  setBusiness: (b: Business | null) => void;
};

const BusinessContext = createContext<BusinessContextType | null>(null);

function generateSlug(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-") +
    "-" +
    Date.now()
  );
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

      // 🔍 buscar negocio (IMPORTANTE: maybeSingle)
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("SELECT ERROR:", error);
      }

      // 🧠 si NO existe → crear
      if (!data) {
        const defaultName = "Mi restaurante";

        const { data: newBusiness, error: createError } = await supabase
          .from("businesses")
          .insert({
            user_id: user.id,
            name: defaultName,
            slug: generateSlug(defaultName),
            is_open: true,
            whatsapp_message: "Hola, quiero pedir:",
            phone: "",
            address: "",
            google_maps: "",
            hours: "",
            plan: "Free",
            renewal_date: null,
          })
          .select()
          .single();

        if (createError) {
          console.error("CREATE ERROR:", createError);
        } else {
          finalBusiness = newBusiness;
        }
      } else {
        finalBusiness = data;
      }

      // 🔥 guardar estado
      setBusiness(finalBusiness);

      // 🔥 REALTIME GLOBAL
      if (finalBusiness?.id) {
        channel = supabase
          .channel(`business-${finalBusiness.id}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "businesses",
              filter: `id=eq.${finalBusiness.id}`,
            },
            (payload) => {
              setBusiness(payload.new as Business);
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