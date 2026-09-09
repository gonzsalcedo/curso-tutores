import { NextResponse } from "next/server";
import Stripe from "stripe";

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email || session.customer_email;
    const name = session.customer_details?.name || "";
    const courseId = session.metadata?.courseId || "curso-tutores";

    if (email) {
      await enrollStudentViaRest(email, name, courseId);
    }
  }

  return NextResponse.json({ received: true });
}
