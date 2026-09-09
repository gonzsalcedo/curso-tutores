const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "gonsalcedod@gmail.com";

interface StudentWelcomeParams {
  studentEmail: string;
  studentName: string;
  courseTitle?: string;
}

interface AdminNotificationParams {
  studentEmail: string;
  studentName: string;
  amount: string;
  courseTitle?: string;
}

/**
 * Envía correo de bienvenida al alumno recién inscrito usando la API de Resend
 */
export async function sendStudentWelcomeEmail({
  studentEmail,
  studentName,
  courseTitle = "Programa Digital Escalable",
}: StudentWelcomeParams) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Gonzalo Salcedo <bienvenida@alepianostudio.com>",
        to: studentEmail,
        subject: `🎓 ¡Bienvenido al ${courseTitle}!`,
        html: `
          <div style="background-color:#0B0F19;color:#f9f9f9;font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',Roboto,Helvetica,Arial,sans-serif;padding:50px 20px;text-align:center;">
            <div style="max-width:540px;margin:0 auto;background-color:#111827;border:1px solid #1F2937;border-radius:16px;padding:40px 32px;text-align:left;box-shadow:0 10px 40px rgba(0,0,0,0.5);">
              
              <div style="text-align:center;margin-bottom:28px;">
                <div style="font-size:44px;margin-bottom:12px;">🎓</div>
                <h1 style="font-size:22px;color:#ffffff;margin:0;font-weight:700;letter-spacing:-0.5px;">¡Bienvenido al ${courseTitle}!</h1>
                <p style="font-size:13px;color:#10B981;font-weight:600;margin-top:6px;">Acceso Completo de por Vida Confirmado</p>
              </div>

              <p style="font-size:15px;color:#CBD5E1;line-height:1.6;margin:0 0 20px 0;">
                Hola <strong>${studentName || "Educador/a"}</strong>,
              </p>
              <p style="font-size:15px;color:#94A3B8;line-height:1.6;margin:0 0 28px 0;">
                Tu inscripción al programa se ha completado con éxito. A partir de este momento tienes acceso ilimitado a los <strong>4 módulos prácticos</strong>, las plantillas listas para usar y todos los bonos exclusivos.
              </p>

              <div style="background-color:#0B0F19;border:1px solid #374151;border-radius:12px;padding:20px;margin-bottom:28px;text-align:center;">
                <p style="font-size:12px;color:#6B7280;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px 0;">Tu Cuenta de Acceso</p>
                <p style="font-size:16px;color:#38BDF8;margin:0;font-weight:600;">${studentEmail}</p>
              </div>

              <div style="text-align:center;margin-bottom:24px;">
                <a href="https://tutor.gonzsalcedo.com/cursos/login?checkout=success" style="display:inline-block;background-color:#059669;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:16px 36px;border-radius:12px;box-shadow:0 4px 14px rgba(5,150,105,0.4);">
                  Entrar a mi Aula Virtual →
                </a>
              </div>

              <div style="background-color:#1E293B/50;border-left:3px solid #3B82F6;padding:12px 16px;border-radius:6px;margin-bottom:20px;">
                <p style="font-size:12px;color:#94A3B8;line-height:1.5;margin:0;">
                  💡 <strong>¿Cómo iniciar sesión?</strong> Si tu correo es de Google/Gmail, puedes entrar con 1 clic usando el botón de Google. Si prefieres contraseña propia, solo pulsa en <em>"Crear o recuperar tu contraseña"</em> en la página de acceso.
                </p>
              </div>

            </div>

            <div style="max-width:540px;margin:28px auto 0;text-align:center;">
              <p style="font-size:12px;color:#64748B;line-height:1.5;margin:0;">
                ¿Tienes alguna duda con tu acceso? Puedes responder directamente a este correo o escribir a través del chat de la plataforma.
              </p>
              <p style="font-size:11px;color:#475569;margin-top:14px;">
                &copy; ${new Date().getFullYear()} Gonzalo Salcedo • Programa Digital Escalable
              </p>
            </div>
          </div>
        `,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      console.log(`✅ Correo de bienvenida enviado a ${studentEmail}:`, data.id);
    } else {
      console.error(`❌ Error enviando correo de bienvenida a ${studentEmail}:`, data);
    }
    return data;
  } catch (error) {
    console.error("Error en sendStudentWelcomeEmail:", error);
  }
}

/**
 * Envía notificación inmediata a Gonzalo cuando entra una nueva inscripción
 */
export async function sendAdminNewStudentEmail({
  studentEmail,
  studentName,
  amount,
  courseTitle = "Programa Digital Escalable",
}: AdminNotificationParams) {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Notificaciones Tutor <notificaciones@alepianostudio.com>",
        to: ADMIN_EMAIL,
        subject: `🎉 ¡Nuevo alumno inscrito: ${studentName || studentEmail}!`,
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;background:#111827;border-radius:16px;padding:32px;color:#e2e8f0;border:1px solid #1f2937;">
            <div style="text-align:center;margin-bottom:20px;">
              <span style="font-size:40px;">💰</span>
              <h2 style="color:#10b981;margin:10px 0 0 0;font-size:20px;">¡Nueva venta completada!</h2>
              <p style="color:#94a3b8;font-size:13px;margin:4px 0 0 0;">${courseTitle}</p>
            </div>

            <div style="background:#0b0f19;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #1f2937;">
              <table style="width:100%;font-size:14px;border-collapse:collapse;">
                <tr>
                  <td style="color:#94a3b8;padding:8px 0;border-bottom:1px solid #1f2937;">Alumno:</td>
                  <td style="color:#ffffff;font-weight:600;padding:8px 0;border-bottom:1px solid #1f2937;text-align:right;">${studentName || "No especificado"}</td>
                </tr>
                <tr>
                  <td style="color:#94a3b8;padding:8px 0;border-bottom:1px solid #1f2937;">Correo:</td>
                  <td style="color:#38bdf8;padding:8px 0;border-bottom:1px solid #1f2937;text-align:right;">${studentEmail}</td>
                </tr>
                <tr>
                  <td style="color:#94a3b8;padding:8px 0;border-bottom:1px solid #1f2937;">Monto cobrado:</td>
                  <td style="color:#10b981;font-weight:700;padding:8px 0;border-bottom:1px solid #1f2937;text-align:right;">${amount}</td>
                </tr>
                <tr>
                  <td style="color:#94a3b8;padding:8px 0;">Fecha:</td>
                  <td style="color:#cbd5e1;padding:8px 0;text-align:right;">${new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" })}</td>
                </tr>
              </table>
            </div>

            <div style="text-align:center;">
              <a href="https://tutor.gonzsalcedo.com/admin/students" style="display:inline-block;background:#2563eb;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:10px;">
                Ver en Panel de Alumnos →
              </a>
            </div>
          </div>
        `,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      console.log(`✅ Notificación de nuevo alumno enviada al admin (${ADMIN_EMAIL}):`, data.id);
    } else {
      console.error(`❌ Error enviando notificación de admin:`, data);
    }
    return data;
  } catch (error) {
    console.error("Error en sendAdminNewStudentEmail:", error);
  }
}
