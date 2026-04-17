import { Resend } from "resend";
import { emailTemplate } from "@/lib/emailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, name } = await req.json();

  // EMAIL 1
  await resend.emails.send({
    from: "WhatsFood <noreply@whatsfoodperu.com>",
    to: email,
    subject: "🚀 Empieza en minutos",
    html: emailTemplate({
      title: "Crea tu primer producto",
      content: "Agrega tu menú y empieza a vender hoy mismo.",
      buttonText: "Crear producto",
      buttonLink: "https://whatsfoodperu.com/dashboard",
    }),
  });

  // EMAIL 2 (10 min después)
  setTimeout(async () => {
    await resend.emails.send({
      from: "WhatsFood <noreply@whatsfoodperu.com>",
      to: email,
      subject: "📲 Comparte tu menú",
      html: emailTemplate({
        title: "Comparte tu link",
        content: "Envía tu menú a tus clientes y recibe pedidos por WhatsApp.",
        buttonText: "Ver mi tienda",
        buttonLink: "https://whatsfoodperu.com/dashboard",
      }),
    });
  }, 1000 * 60 * 10);

  return Response.json({ ok: true });
}