"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

// 🔷 Tipo
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

  created_at?: string;
};

// ✅ SLUG LIMPIO (SIN TIMESTAMP)
function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
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
          return;
        }

        if (!user) return;

        let finalBusiness: Business | null = null;

        // 🔍 Buscar negocio
        const { data, error } = await supabase
          .from("businesses")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("SELECT ERROR:", error);

          // 👉 si no existe → crear
          if (error.code === "PGRST116") {
            const defaultName = "Mi restaurante";

            let slug = generateSlug(defaultName);

            // 🔥 verificar duplicado
            const { data: existing } = await supabase
              .from("businesses")
              .select("id")
              .eq("slug", slug)
              .maybeSingle();

            if (existing) {
              slug = `${slug}-${Math.floor(Math.random() * 9999)}`;
            }

            const { data: newBusiness, error: createError } = await supabase
              .from("businesses")
              .insert({
                user_id: user.id,
                name: defaultName,
                slug,
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
              finalBusiness = null;
            } else {
              finalBusiness = newBusiness;
            }
          } else {
            finalBusiness = null;
          }
        } else {
          finalBusiness = data;
        }

        // 🔥 Contar productos
        if (finalBusiness?.id) {
          const { count } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("business_id", finalBusiness.id);

          finalBusiness.products_count = count || 0;
        }

        if (isMounted) {
          setBusiness(finalBusiness);
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