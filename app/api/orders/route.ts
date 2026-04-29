import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { cart, total, form, business_id } = body;

    /* =========================
       🔒 VALIDACIONES
    ========================= */
    if (!business_id) {
      return NextResponse.json(
        { ok: false, error: "business_id requerido" },
        { status: 400 }
      );
    }

    if (!cart || cart.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Carrito vacío" },
        { status: 400 }
      );
    }

    if (!form?.name || !form?.phone) {
      return NextResponse.json(
        { ok: false, error: "Datos del cliente incompletos" },
        { status: 400 }
      );
    }

    /* =========================
       🧾 INSERT
    ========================= */
    const { data, error } = await supabase
      .from("orders")
      .insert({
        business_id,
        items: cart,
        total,
        customer: form,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    /* =========================
       📲 GENERAR MENSAJE WHATSAPP
    ========================= */
    const itemsText = cart
      .map((item: any) => {
        const extras = item.extras?.length
          ? `\n   + Extras: ${item.extras
              .map((e: any) => `${e.name} (+S/ ${e.price})`)
              .join(", ")}`
          : "";

        return `• ${item.quantity}x ${item.name} - S/ ${item.price}${extras}`;
      })
      .join("\n");

    const message = `
🛒 *Nuevo Pedido*

👤 *Cliente:* ${form.name}
📞 *Teléfono:* ${form.phone}
📍 *Distrito:* ${form.district || "-"}
🏠 *Dirección:* ${form.address || "-"}
📝 *Referencia:* ${form.reference || "-"}
💳 *Pago:* ${form.payment || "-"}

🍔 *Pedido:*
${itemsText}

💰 *Total:* S/ ${total}
`;

    /* =========================
       🚀 RESPUESTA
    ========================= */
    return NextResponse.json({
      ok: true,
      order: data,
      whatsappMessage: encodeURIComponent(message),
    });

  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { ok: false, error: "Error interno" },
      { status: 500 }
    );
  }
}