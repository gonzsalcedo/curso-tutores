import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendMetaConversionEvent } from "@/lib/metaConversions";
import { CURRENCIES, CurrencyConfig } from "@/lib/currencies";

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
    const requestedCurrency = typeof body.currency === "string" ? body.currency.toLowerCase() : "mxn";
    const currencyConfig: CurrencyConfig = CURRENCIES[requestedCurrency] || CURRENCIES.mxn;
    const currency = currencyConfig.code;

    // Plan diferido: solo disponible para USD (3 pagos de $130 USD)
    const isSplitUSD = currency === "usd" && body.plan === "split_3";

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "https://tutor.gonzsalcedo.com";
    const productImages = origin && origin.startsWith("https://") ? [`${origin}/gonzalo-salcedo-office.webp`] : [];

    const courseId = typeof body.courseId === "string" ? body.courseId : "curso-tutores";
    const courseTitle = isSplitUSD
      ? "Curso Digital Escalable - Plan 3 Pagos Mensuales"
      : "Curso Digital Escalable: Convierte lo que Sabes en Ingresos y Libertad";
    const productDesc = isSplitUSD
      ? "Acceso completo e ilimitado de por vida. Pago dividido en 3 cuotas mensuales de $130 USD."
      : "Acceso completo e ilimitado de por vida al programa de creación y venta de cursos digitales.";

    const unitAmount = isSplitUSD
      ? (currencyConfig.splitUnitAmount || 13000)
      : currencyConfig.unitAmount;

    const chargeAmountNumber = isSplitUSD
      ? (currencyConfig.splitPrice || 130)
      : currencyConfig.price;

    const session = await stripe.checkout.sessions.create({
      mode: isSplitUSD ? "subscription" : "payment",
      payment_method_types: ["card"],
      ...(isSplitUSD
        ? {
            subscription_data: {
              metadata: {
                courseId,
                courseTitle,
                plan: "split_3",
              },
            },
          }
        : {
            adaptive_pricing: { enabled: true },
            customer_creation: "always",
            ...(currencyConfig.allowsMSI
              ? {
                  payment_method_options: {
                    card: {
                      installments: {
                        enabled: true,
                      },
                    },
                  },
                }
              : {}),
          }),
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: courseTitle,
              description: productDesc,
              ...(productImages.length > 0 ? { images: productImages } : {}),
            },
            unit_amount: unitAmount,
            ...(isSplitUSD
              ? {
                  recurring: {
                    interval: "month",
                    interval_count: 1,
                  },
                }
              : {}),
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/cursos/login?checkout=success&session_id={CHECKOUT_SESSION_ID}&val=${chargeAmountNumber}&cur=${currency.toUpperCase()}`,
      cancel_url: `${origin}/#oferta`,
      metadata: {
        courseId,
        courseTitle,
        currency,
        plan: isSplitUSD ? "split_3" : "single",
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
      value: chargeAmountNumber,
      currency: currency.toUpperCase(),
      courseTitle,
    }).catch((err) => console.error("Error CAPI InitiateCheckout:", err));

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: error?.message || "Error al crear sesión de pago" }, { status: 500 });
  }
}
