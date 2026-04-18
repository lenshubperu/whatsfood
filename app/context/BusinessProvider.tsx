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

      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!error) {
        setBusiness(data);
      }

      // 🔥 REALTIME GLOBAL
      if (data?.id) {
        channel = supabase
          .channel(`business-${data.id}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "businesses",
              filter: `id=eq.${data.id}`,
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