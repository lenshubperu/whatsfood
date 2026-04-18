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

  products_count?: number;

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
    let channel: any = null;

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

        // 🔍 1. Buscar negocio
        const { data, error } = await supabase
          .from("businesses")
          .select("*")
          .eq("user_id", user.id)
          .single();

        // 🧠 2. Manejo correcto de errores
        if (error) {
          console.error("SELECT ERROR:", error);

          if (error.code === "PGRST116") {
            // 👉 no existe → crear
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
              finalBusiness = null;
            } else {
              finalBusiness = newBusiness;
            }
          } else {
            // ❌ error real (RLS u otro)
            finalBusiness = null;
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

        if (isMounted) {
          setBusiness(finalBusiness);
        }

        // =========================
        // 🔥 REALTIME CORRECTO
        // =========================
        if (finalBusiness?.id) {
          // 🧹 elimina canal previo si existe
          if (channel) {
            supabase.removeChannel(channel);
          }

          const newChannel = supabase.channel("business-realtime");

          newChannel.on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "businesses",
              filter: `id=eq.${finalBusiness.id}`,
            },
            (payload) => {
              console.log("Realtime update:", payload);

              if (isMounted) {
                setBusiness(payload.new as Business);
              }
            }
          );

          newChannel.subscribe();

          channel = newChannel;
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
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return { business, loading };
}