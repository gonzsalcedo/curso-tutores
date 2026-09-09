import { NextResponse } from "next/server";
import { COUNTRY_CURRENCY_MAP } from "@/lib/currencies";

export async function GET(req: Request) {
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    "";

  const currencyCode = country ? (COUNTRY_CURRENCY_MAP[country.toUpperCase()] || "usd") : "usd";

  return NextResponse.json({
    country: country.toUpperCase() || "UNKNOWN",
    currency: currencyCode,
  });
}
