import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json(
        { error: "Stripe no está configurado aún. Agrega STRIPE_SECRET_KEY en tu archivo .env.local o panel de Vercel." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2026-02-25.clover" as any,
    });

    const body = await req.json().catch(() => ({}));
    const { courseId = "curso-tutores", courseTitle = "Curso Digital Escalable", price = 3500, currency = "mxn" } = body;

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: courseTitle,
              description: "Acceso completo e ilimitado al programa de creación y venta de cursos digitales.",
              images: [`${origin}/gonzalo-salcedo-office.webp`],
            },
            unit_amount: price * 100, // centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/cursos/login?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#oferta`,
      metadata: {
        courseId,
        courseTitle,
      },
      customer_creation: "always",
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: error?.message || "Error al crear sesión de pago" }, { status: 500 });
  }
}
