import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;

export async function GET(req: Request) {
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe no configurado" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Falta session_id" }, { status: 400 });
  }

  try {
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2026-02-25.clover" as any,
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    let isOxxo = false;
    let voucherUrl: string | null = null;
    let voucherNumber: string | null = null;
    let expiresAt: number | null = null;

    const pi = typeof session.payment_intent === "object" ? (session.payment_intent as Stripe.PaymentIntent) : null;

    if (pi?.next_action?.oxxo_display_details) {
      isOxxo = true;
      voucherUrl = pi.next_action.oxxo_display_details.hosted_voucher_url || null;
      voucherNumber = pi.next_action.oxxo_display_details.number || null;
      expiresAt = pi.next_action.oxxo_display_details.expires_after || null;
    } else if (session.payment_method_types?.includes("oxxo")) {
      isOxxo = true;
    }

    return NextResponse.json({
      id: session.id,
      status: session.status,
      payment_status: session.payment_status,
      isOxxo,
      voucherUrl,
      voucherNumber,
      expiresAt,
      currency: session.currency?.toUpperCase() || "MXN",
      amountTotal: session.amount_total ? session.amount_total / 100 : null,
      customerEmail: session.customer_details?.email || session.customer_email || null,
    });
  } catch (error: any) {
    console.error("Error al consultar sesión de Stripe:", error);
    return NextResponse.json(
      { error: error?.message || "Error al consultar la sesión" },
      { status: 500 }
    );
  }
}
