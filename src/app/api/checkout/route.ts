import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendMetaConversionEvent } from "@/lib/metaConversions";

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

    const productImages = origin && origin.startsWith("https://") ? [`${origin}/gonzalo-salcedo-office.webp`] : [];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      adaptive_pricing: { enabled: true },
      customer_creation: "always",
      payment_method_options: {
        card: {
          installments: {
            enabled: true,
          },
        },
      },
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: courseTitle,
              description: "Acceso completo e ilimitado al programa de creación y venta de cursos digitales.",
              ...(productImages.length > 0 ? { images: productImages } : {}),
            },
            unit_amount: price * 100, // centavos
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/cursos/login?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#oferta`,
      metadata: {
        courseId,
        courseTitle,
      },
    });

    // Reportar InitiateCheckout en backend para máxima cobertura de atribución
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || undefined;
    const userAgent = req.headers.get("user-agent") || undefined;

    sendMetaConversionEvent({
      eventName: "InitiateCheckout",
      eventId: session.id,
      clientIp,
      userAgent,
      value: price,
      currency,
      courseTitle,
    }).catch((err) => console.error("Error CAPI InitiateCheckout:", err));

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: error?.message || "Error al crear sesión de pago" }, { status: 500 });
  }
}
