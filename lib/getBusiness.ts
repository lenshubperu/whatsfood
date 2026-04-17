import { supabase } from "./supabaseClient";

export async function getBusiness() {
  const { data: userData } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("businesses")
    .select("*")
    .eq("user_id", userData.user?.id)
    .single();

  return data;
}