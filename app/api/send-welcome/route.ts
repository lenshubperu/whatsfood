import { NextResponse } from "next/server";
import { Resend } from "resend";
import { emailTemplate } from "@/lib/emailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, name } = await req.json();

  try {
    const html = emailTemplate({
      title: `Bienvenido ${name} 🎉`,
      content: "Tu cuenta está lista. Empieza a vender en minutos.",
      buttonText: "Ir a mi panel",
      buttonLink: "https://whatsfoodperu.com/dashboard",
    });

    await resend.emails.send({
      from: "WhatsFood <noreply@whatsfoodperu.com>",
      to: email,
      subject: "🎉 Bienvenido a WhatsFood",
      html: html + `
        <img src="https://whatsfoodperu.com/api/track-open?email=${email}" width="1" height="1" />
      `,
    });

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error email" });
  }
}