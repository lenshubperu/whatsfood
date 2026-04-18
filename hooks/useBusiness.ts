"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

// 🔷 Tipo alineado con DB + UI + stats
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

  // 🔥 stats
  products_count?: number;

  // 🔥 NUEVO (ya existe en tu DB)
  plan?: string;
  renewal_date?: string;

  created_at?: string;
};

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

export function useBusiness() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("Error getting user:", userError);
          if (isMounted) setLoading(false);
          return;
        }

        if (!user) {
          if (isMounted) setLoading(false);
          return;
        }

        // 🔍 1. Buscar negocio
        const { data, error } = await supabase
          .from("businesses")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error loading business:", error);
        }

        let finalBusiness: Business | null = null;

        // 🧠 2. Si NO existe → CREARLO
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

              // 🔥 campos iniciales
              phone: "",
              address: "",
              google_maps: "",
              hours: "",

              // 🔥 NUEVO
              plan: "Free",
              renewal_date: null,
            })
            .select()
            .single();

          if (createError) {
            console.error("Error creating business:", createError);
            finalBusiness = null;
          } else {
            finalBusiness = newBusiness;
          }
        } else {
          finalBusiness = data;
        }

        // 🔥 3. Contar productos
        if (finalBusiness?.id) {
          const { count } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("business_id", finalBusiness.id);

          finalBusiness.products_count = count || 0;
        }

        if (isMounted) setBusiness(finalBusiness);
      } catch (err) {
        console.error("Unexpected error in useBusiness:", err);
        if (isMounted) setBusiness(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { business, loading };
}