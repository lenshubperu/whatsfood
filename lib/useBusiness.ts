"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useBusiness() {
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        .maybeSingle(); // 👈 IMPORTANTE

      if (error) {
        console.error("Error loading business:", error);
      }

      setBusiness(data);
      setLoading(false);
    };

    load();
  }, []);

  return { business, loading };
}