import crypto from "crypto";

const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || "2140367103553718";
const ACCESS_TOKEN = process.env.META_CAPI_TOKEN || "";

export function hashSha256(value: string): string {
  if (!value) return "";
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

interface SendEventParams {
  eventName: "Purchase" | "InitiateCheckout" | "Lead" | "PageView";
  eventId?: string;
  sourceUrl?: string;
  email?: string;
  phone?: string;
  name?: string;
  clientIp?: string;
  userAgent?: string;
  value?: number;
  currency?: string;
  courseTitle?: string;
}

export async function sendMetaConversionEvent({
  eventName,
  eventId,
  sourceUrl = "https://tutor.gonzsalcedo.com",
  email,
  phone,
  name,
  clientIp,
  userAgent,
  value,
  currency = "MXN",
  courseTitle = "Curso Digital Escalable",
}: SendEventParams) {
  try {
    const userData: Record<string, any> = {};

    if (email) {
      userData.em = [hashSha256(email)];
    }
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, "");
      if (cleanPhone) userData.ph = [hashSha256(cleanPhone)];
    }
    if (name) {
      const parts = name.trim().split(" ");
      if (parts[0]) userData.fn = [hashSha256(parts[0])];
      if (parts.length > 1) userData.ln = [hashSha256(parts.slice(1).join(" "))];
    }
    if (clientIp) {
      userData.client_ip_address = clientIp;
    }
    if (userAgent) {
      userData.client_user_agent = userAgent;
    }

    const customData: Record<string, any> = {
      content_name: courseTitle,
      content_category: "Educacion Digital",
    };

    if (value !== undefined) {
      customData.value = value;
      customData.currency = currency.toUpperCase();
    }

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: sourceUrl,
          ...(eventId ? { event_id: eventId } : {}),
          user_data: userData,
          custom_data: customData,
        },
      ],
    };

    const res = await fetch(`https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok) {
      console.error("Meta CAPI Error:", result);
    } else {
      console.log(`✅ Meta CAPI ${eventName} enviado exitosamente:`, result);
    }
    return result;
  } catch (err) {
    console.error("Error al enviar evento a Meta CAPI:", err);
  }
}
