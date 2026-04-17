import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { user_id, session_id } = await req.json();

  // elimina sesiones anteriores
  await supabase
    .from("user_sessions")
    .delete()
    .eq("user_id", user_id);

  // guarda nueva sesión
  await supabase.from("user_sessions").insert({
    user_id,
    session_id,
  });

  return Response.json({ ok: true });
}