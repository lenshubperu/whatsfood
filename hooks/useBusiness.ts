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

// ✅ SLUG LIMPIO
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
    let channel: any = null;

    const load = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        let finalBusiness: Business | null = null;

        // 🔍 GET BUSINESS
        const { data, error } = await supabase
          .from("businesses")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          // 👉 crear si no existe
          if (error.code === "PGRST116") {
            const defaultName = "Mi restaurante";

            let slug = generateSlug(defaultName);

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
            console.error(error);
            finalBusiness = null;
          }
        } else {
          finalBusiness = data;
        }

        // 📊 PRODUCT COUNT
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
        // 🔥 REALTIME (CLAVE)
        // =========================
        if (finalBusiness?.id) {
          const channelName = `business-${finalBusiness.id}`;

          // limpiar canal previo
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
                console.log("🔥 BUSINESS REALTIME:", payload);

                setBusiness(payload.new as Business);
              }
            )
            .subscribe();
        }
      } catch (err) {
        console.error("Unexpected error:", err);
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

  return { business, loading, setBusiness };
}