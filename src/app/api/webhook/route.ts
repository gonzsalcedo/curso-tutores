import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendMetaConversionEvent } from "@/lib/metaConversions";
import {
  sendStudentWelcomeEmail,
  sendAdminNewStudentEmail,
  sendOxxoPendingEmail,
  sendAdminOxxoPendingEmail,
} from "@/lib/emailService";

const stripeKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "yaesbuena-golf"}/databases/(default)/documents`;

async function enrollStudentViaRest(email: string, name: string, courseId: string) {
  const cleanEmail = email.toLowerCase().trim();
  const docPath = `${FIRESTORE_BASE}/subscribers/${encodeURIComponent(cleanEmail)}`;

  // 1. Obtener documento actual si existe
  const getRes = await fetch(docPath);
  let existingEnrolled: string[] = [];

  if (getRes.ok) {
    const docData = await getRes.json();
    if (docData.fields?.enrolledCourses?.arrayValue?.values) {
      existingEnrolled = docData.fields.enrolledCourses.arrayValue.values.map(
        (v: any) => v.stringValue
      );
    }
  }

  if (!existingEnrolled.includes(courseId)) {
    existingEnrolled.push(courseId);
  }

  // 2. Preparar payload REST de Firestore
  const fields: Record<string, any> = {
    email: { stringValue: cleanEmail },
    displayName: { stringValue: name || "Alumno" },
    role: { stringValue: "student" },
    updatedAt: { stringValue: new Date().toISOString() },
    enrolledCourses: {
      arrayValue: {
        values: existingEnrolled.map((c) => ({ stringValue: c })),
      },
    },
  };

  const patchRes = await fetch(docPath, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });

  if (!patchRes.ok) {
    const errText = await patchRes.text();
    console.error("Error al registrar alumno en Firestore:", errText);
  } else {
    console.log(`Alumno ${cleanEmail} inscrito exitosamente en ${courseId}`);
  }
}

/**
 * Procesa la inscripción del alumno, disparo de eventos de conversión y correos de bienvenida
 * Únicamente se llama cuando el dinero está efectivamente cobrado (pagado con tarjeta o pagado en caja OXXO)
 */
async function handleSuccessfulEnrollment(
  session: Stripe.Checkout.Session,
  paymentSource: "card" | "oxxo_async"
) {
  const email = session.customer_details?.email || session.customer_email;
  const name = session.customer_details?.name || "";
  const courseId = session.metadata?.courseId || "curso-tutores";

  if (!email) {
    console.warn("handleSuccessfulEnrollment: No se encontró email en la sesión", session.id);
    return;
  }

  // 1. Enrolar en Firestore
  await enrollStudentViaRest(email, name, courseId);

  // 2. Reportar conversión de compra a Meta CAPI (Server-Side)
  const currency = session.currency ? session.currency.toUpperCase() : "MXN";
  const isZeroDecimal = currency.toLowerCase() === "clp";
  const rawAmount = session.amount_total || 0;
  const amountTotal = rawAmount > 0 ? (isZeroDecimal ? rawAmount : rawAmount / 100) : 1490;
  const phone = session.customer_details?.phone || undefined;
  const fbp = session.metadata?.fbp || undefined;
  const fbc = session.metadata?.fbc || undefined;

  await sendMetaConversionEvent({
    eventName: "Purchase",
    eventId: session.id,
    email,
    name,
    phone,
    fbp,
    fbc,
    value: amountTotal,
    currency,
    courseTitle: session.metadata?.courseTitle || "Curso Digital Escalable",
  });

  // 3. Enviar correos automáticos vía Resend
  const formattedAmount = `${amountTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })} ${currency}`;
  const courseTitle = session.metadata?.courseTitle || "Programa Digital Escalable";
  const notificationTitle =
    paymentSource === "oxxo_async"
      ? `${courseTitle} (Pago en Efectivo OXXO Acreditado)`
      : courseTitle;

  await Promise.allSettled([
    sendStudentWelcomeEmail({
      studentEmail: email,
      studentName: name,
      courseTitle,
    }),
    sendAdminNewStudentEmail({
      studentEmail: email,
      studentName: name,
      amount: formattedAmount,
      courseTitle: notificationTitle,
    }),
  ]);
}

export async function POST(req: Request) {
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Faltan credenciales de webhook de Stripe." }, { status: 500 });
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: "2026-02-25.clover" as any,
  });

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No se encontró firma de Stripe" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  // 1. Caso Pago Inmediato o Boleta Creada (Checkout Session Completada)
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Si ya está pagado (Tarjetas de crédito/débito) -> Dar acceso inmediato
    if (session.payment_status === "paid") {
      await handleSuccessfulEnrollment(session, "card");
    } else if (session.payment_status === "unpaid") {
      // Si está en unpaid (OXXO) -> NO dar acceso todavía. Enviar boleta e instrucciones.
      const email = session.customer_details?.email || session.customer_email;
      const name = session.customer_details?.name || "";
      const currency = session.currency ? session.currency.toUpperCase() : "MXN";
      const isZeroDecimal = currency.toLowerCase() === "clp";
      const rawAmount = session.amount_total || 0;
      const amountTotal = rawAmount > 0 ? (isZeroDecimal ? rawAmount : rawAmount / 100) : 1490;
      const formattedAmount = `${amountTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })} ${currency}`;
      const courseTitle = session.metadata?.courseTitle || "Curso Digital Escalable";

      let hostedVoucherUrl: string | null = null;
      let voucherNumber: string | null = null;
      let expiresAt: number | null = null;

      try {
        const piId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id;
        if (piId) {
          const pi = await stripe.paymentIntents.retrieve(piId);
          if (pi.next_action?.oxxo_display_details) {
            hostedVoucherUrl = pi.next_action.oxxo_display_details.hosted_voucher_url || null;
            voucherNumber = pi.next_action.oxxo_display_details.number || null;
            expiresAt = pi.next_action.oxxo_display_details.expires_after || null;
          }
        }
      } catch (piErr) {
        console.error("Error al obtener voucher OXXO de PaymentIntent:", piErr);
      }

      if (email) {
        await Promise.allSettled([
          sendOxxoPendingEmail({
            studentEmail: email,
            studentName: name,
            amount: formattedAmount,
            voucherUrl: hostedVoucherUrl,
            voucherNumber,
            expiresAt,
            courseTitle,
          }),
          sendAdminOxxoPendingEmail({
            studentEmail: email,
            studentName: name,
            amount: formattedAmount,
            voucherUrl: hostedVoucherUrl,
            voucherNumber,
            courseTitle,
          }),
        ]);
      }
    }
  }

  // 2. Caso Pago Asíncrono Acreditado (El alumno acudió al OXXO y pagó en caja)
  if (event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(`Pago en OXXO acreditado con éxito para sesión: ${session.id}`);
    await handleSuccessfulEnrollment(session, "oxxo_async");
  }

  // 3. Caso Pago Asíncrono Fallido / Expirado (Pasaron los 3 días y no acudió al OXXO)
  if (event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(`Ficha OXXO no liquidada / expirada para sesión: ${session.id}`);
  }

  return NextResponse.json({ received: true });
}

