"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

// 🔷 Tipo alineado con tu DB + tu UI
export type Business = {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  is_open: boolean;
  whatsapp_message: string;

  // 🔥 campos que estás usando en account/page.tsx
  phone?: string;
  address?: string;
  google_maps?: string;
  hours?: string;

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

              // 🔥 inicializar campos opcionales
              phone: "",
              address: "",
              google_maps: "",
              hours: "",
            })
            .select()
            .single();

          if (createError) {
            console.error("Error creating business:", createError);
            if (isMounted) setBusiness(null);
          } else {
            if (isMounted) setBusiness(newBusiness);
          }
        } else {
          if (isMounted) setBusiness(data);
        }
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