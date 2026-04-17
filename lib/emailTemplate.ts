export function emailTemplate({
  title,
  content,
  buttonText,
  buttonLink,
}: {
  title: string;
  content: string;
  buttonText: string;
  buttonLink: string;
}) {
  return `
  <!DOCTYPE html>
  <html>
    <body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,Helvetica,sans-serif;">
      
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
        <tr>
          <td align="center">

            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;padding:24px;">
              
              <!-- LOGO -->
              <tr>
                <td align="center" style="padding-bottom:10px;">
                  <img src="https://whatsfoodperu.com/logo.png" width="70" />
                </td>
              </tr>

              <!-- TITLE -->
              <tr>
                <td align="center">
                  <h2 style="margin:0;color:#111;">
                    ${title}
                  </h2>
                </td>
              </tr>

              <!-- CONTENT -->
              <tr>
                <td align="center" style="padding:15px 10px;">
                  <p style="margin:0;color:#555;font-size:14px;line-height:1.6;">
                    ${content}
                  </p>
                </td>
              </tr>

              <!-- BUTTON -->
              <tr>
                <td align="center" style="padding:20px 0;">
                  <a href="${buttonLink}"
                    style="background:#22c55e;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">
                    ${buttonText}
                  </a>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td align="center" style="padding-top:20px;">
                  <p style="font-size:12px;color:#999;">
                    © 2026 WhatsFood • Vende por WhatsApp 🚀
                  </p>
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
  </html>
  `;
}