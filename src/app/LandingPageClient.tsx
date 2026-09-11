"use client";

import React, { useEffect, useState } from "react";
import { CURRENCIES, COUNTRY_CURRENCY_MAP, CurrencyConfig } from "@/lib/currencies";

interface Props {
  htmlContent: string;
}

export default function LandingPageClient({ htmlContent }: Props) {
  const [modalNotice, setModalNotice] = useState<{
    open: boolean;
    title: string;
    message: string;
  }>({
    open: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    let currentCurrencyCode = "mxn";
    let currentUsdPlan = "single";

    // 1. Función para actualizar todos los campos dinámicos en el DOM
    const updateDOMForCurrency = (currCode: string, usdPlan = "single") => {
      const config: CurrencyConfig = CURRENCIES[currCode.toLowerCase()] || CURRENCIES.mxn;
      currentCurrencyCode = config.code;
      currentUsdPlan = usdPlan;

      // Dropdown button pill
      const flagEl = document.getElementById("active-currency-flag");
      const labelEl = document.getElementById("active-currency-label");
      if (flagEl) flagEl.textContent = config.flag;
      if (labelEl) labelEl.textContent = config.label;

      // Tabla Comparativa
      const hourlyEl = document.querySelector('[data-field="table-hourly-rate"]');
      if (hourlyEl) hourlyEl.textContent = config.table.hourlyRate;

      const tradMonthlyEl = document.querySelector('[data-field="table-traditional-monthly"]');
      if (tradMonthlyEl) tradMonthlyEl.textContent = config.table.traditionalMonthly;

      const coursePriceEl = document.querySelector('[data-field="table-course-price"]');
      if (coursePriceEl) coursePriceEl.textContent = config.table.courseSellingPrice;

      const scalableMonthlyEl = document.querySelector('[data-field="table-scalable-monthly"]');
      if (scalableMonthlyEl) scalableMonthlyEl.textContent = config.table.scalableMonthly;

      // Bono 1 individual
      const bonus1IndEl = document.querySelector('[data-field="bonus1-individual-value"]');
      if (bonus1IndEl) bonus1IndEl.textContent = `Valor: ${config.stack.bonus1Value}`;

      // Stack de Oferta
      const stackProgEl = document.querySelector('[data-field="stack-program"]');
      if (stackProgEl) stackProgEl.textContent = config.stack.programValue;

      const stackB1El = document.querySelector('[data-field="stack-bonus1"]');
      if (stackB1El) stackB1El.textContent = config.stack.bonus1Value;

      const stackB2El = document.querySelector('[data-field="stack-bonus2"]');
      if (stackB2El) stackB2El.textContent = config.stack.bonus2Value;

      const stackB3El = document.querySelector('[data-field="stack-bonus3"]');
      if (stackB3El) stackB3El.textContent = config.stack.bonus3Value;

      const stackTotalEl = document.querySelector('[data-field="stack-total"]');
      if (stackTotalEl) stackTotalEl.textContent = config.stack.totalRealValue;

      // Precio en caja de oferta
      const priceAmountEl = document.querySelector('[data-field="price-amount"]');
      const priceCurrEl = document.querySelector('[data-field="price-currency"]');
      if (priceAmountEl) {
        if (config.code === "usd" && usdPlan === "split_3") {
          priceAmountEl.textContent = "3x $130";
        } else {
          priceAmountEl.textContent = config.stack.officialPriceDisplay;
        }
      }
      if (priceCurrEl) priceCurrEl.textContent = config.stack.currencySuffix;

      // Badge MSI o Nota
      const instNoteEl = document.querySelector('[data-field="installments-note"]');
      const msiBadgeEl = document.getElementById("msi-badge");
      if (instNoteEl) {
        if (config.allowsMSI) {
          instNoteEl.innerHTML = "Se aceptan <strong>Meses Sin Intereses</strong> con tarjetas de crédito participantes";
          msiBadgeEl?.classList.remove("bg-slate-100", "text-slate-800", "border-slate-200");
          msiBadgeEl?.classList.add("bg-emerald-50", "text-emerald-900", "border-emerald-200");
        } else {
          instNoteEl.textContent = config.stack.installmentsNote;
          msiBadgeEl?.classList.remove("bg-emerald-50", "text-emerald-900", "border-emerald-200");
          msiBadgeEl?.classList.add("bg-slate-100", "text-slate-800", "border-slate-200");
        }
      }

      // Selector de planes USD (mostrar solo en USD)
      const usdOptionsEl = document.getElementById("usd-payment-options");
      if (usdOptionsEl) {
        if (config.code === "usd") {
          usdOptionsEl.classList.remove("hidden");
        } else {
          usdOptionsEl.classList.add("hidden");
        }
      }

      // Estilos activos en opciones de radio USD
      const labelSingle = document.getElementById("label-usd-single");
      const labelSplit = document.getElementById("label-usd-split");
      if (labelSingle && labelSplit) {
        if (usdPlan === "split_3") {
          labelSplit.classList.add("border-emerald-500", "ring-2", "ring-emerald-500/20");
          labelSplit.classList.remove("border-slate-200");
          labelSingle.classList.remove("border-emerald-500", "ring-2", "ring-emerald-500/20");
          labelSingle.classList.add("border-slate-200");
        } else {
          labelSingle.classList.add("border-emerald-500", "ring-2", "ring-emerald-500/20");
          labelSingle.classList.remove("border-slate-200");
          labelSplit.classList.remove("border-emerald-500", "ring-2", "ring-emerald-500/20");
          labelSplit.classList.add("border-slate-200");
        }
      }

      // Actualizar Sticky Bar móvil
      const stickyPriceEl = document.querySelector('[data-field="sticky-price"]');
      const stickyNoteEl = document.querySelector('[data-field="sticky-note"]');
      if (stickyPriceEl) {
        if (config.code === "usd" && usdPlan === "split_3") {
          stickyPriceEl.textContent = "3x $130 USD";
        } else {
          stickyPriceEl.textContent = `${config.stack.officialPriceDisplay} ${config.stack.currencySuffix}`;
        }
      }
      if (stickyNoteEl) {
        if (config.allowsMSI) {
          stickyNoteEl.textContent = "Hasta MSI con tarjetas participantes";
        } else if (config.code === "usd" && usdPlan === "split_3") {
          stickyNoteEl.textContent = "3 pagos diferidos de $130 USD";
        } else {
          stickyNoteEl.textContent = "Acceso completo e ilimitado";
        }
      }

      // Actualizar texto del botón principal CTA
      const ctaText = document.getElementById("checkout-cta-text");
      if (ctaText) {
        if (config.code === "usd" && usdPlan === "split_3") {
          ctaText.textContent = "¡INSCRIBIRME EN 3 PAGOS DE $130 USD!";
        } else {
          ctaText.textContent = "¡QUIERO INSCRIBIRME HOY!";
        }
      }
    };

    // 2. Registrar selector de modalidad diferida para USD
    (window as any).handleUsdPlanChange = (plan: string) => {
      updateDOMForCurrency("usd", plan);
    };

    // 3. Registrar startVideoDemo en window
    (window as any).startVideoDemo = () => {
      const iframe = document.getElementById("bunny-vsl-iframe");
      if (iframe) {
        iframe.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        const target = document.getElementById("oferta");
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    // 4. Registrar handleWhatsAppSupport en window (abre el asistente Gonz directamente)
    (window as any).handleWhatsAppSupport = (event?: any) => {
      if (event) event.preventDefault();
      const chatBtn = document.getElementById("chatac-bubble-btn");
      if (chatBtn) chatBtn.click();
    };

    // 5. Registrar handleCheckoutRedirect en window con multi-divisa y plan diferido
    (window as any).handleCheckoutRedirect = async (event?: any, source?: string) => {
      if (event) event.preventDefault();

      const btn = (event && event.currentTarget) || document.getElementById("checkout-cta");
      const originalHtml = btn ? btn.innerHTML : "";
      if (btn) {
        btn.innerHTML = `<span>Conectando con pasarela segura...</span>`;
        btn.style.pointerEvents = "none";
      }

      const config: CurrencyConfig = CURRENCIES[currentCurrencyCode] || CURRENCIES.mxn;
      const isSplitUSD = config.code === "usd" && currentUsdPlan === "split_3";
      const chargeValue = isSplitUSD ? (config.splitPrice || 130) : config.price;

      // Clave compartida de deduplicación para Meta Pixel (browser) y Conversions API (server)
      const eventId = `ic_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      // Extraer parámetros fbp (Browser ID) y fbc (Click ID) para máxima atribución
      const getCookie = (name: string) => {
        if (typeof document === "undefined") return "";
        const match = document.cookie.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"));
        return match ? decodeURIComponent(match[1]) : "";
      };

      const fbp = getCookie("_fbp");
      let fbc = getCookie("_fbc");
      if (!fbc && typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const fbclid = urlParams.get("fbclid");
        if (fbclid) {
          fbc = `fb.1.${Date.now()}.${fbclid}`;
        }
      }

      try {
        if (typeof (window as any).fbq === "function") {
          (window as any).fbq(
            "track",
            "InitiateCheckout",
            {
              content_name: "Programa Digital Escalable",
              content_category: "Educacion Digital",
              value: chargeValue,
              currency: config.code.toUpperCase(),
              button_location: source || "pricing_box_main",
            },
            { eventID: eventId }
          );
        }
      } catch (err) {
        console.error("Pixel tracking error:", err);
      }

      try {
        if (typeof (window as any).gtag === "function") {
          (window as any).gtag("event", "begin_checkout", {
            currency: config.code.toUpperCase(),
            value: chargeValue,
            items: [
              {
                item_id: "curso-tutores",
                item_name: isSplitUSD ? "Curso Digital Escalable (Plan 3 Pagos)" : "Curso Digital Escalable",
                item_category: "Educacion Digital",
                price: chargeValue,
                quantity: 1,
              },
            ],
          });
        }
      } catch (err) {
        console.error("GA4 begin_checkout error:", err);
      }

      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: "curso-tutores",
            courseTitle: isSplitUSD
              ? "Curso Digital Escalable - Plan 3 Pagos Mensuales"
              : "Curso Digital Escalable: Convierte lo que Sabes en Ingresos y Libertad",
            currency: config.code,
            plan: isSplitUSD ? "split_3" : "single",
            eventId,
            fbp,
            fbc,
          }),
        });

        const data = await res.json();

        if (data && data.url) {
          window.location.href = data.url;
          return;
        }

        setModalNotice({
          open: true,
          title: "Configuración de Pasarela Stripe",
          message:
            data.error ||
            "Stripe está casi listo. Si deseas inscribirte ahora o pagar por transferencia/efectivo, contáctanos directamente.",
        });
      } catch (err) {
        console.error("Error al procesar el pago:", err);
        setModalNotice({
          open: true,
          title: "Aviso de Conexión",
          message:
            "Hubo un inconveniente al conectar con el servidor de pago. Por favor intenta de nuevo o escríbenos por WhatsApp.",
        });
      } finally {
        if (btn) {
          btn.innerHTML = originalHtml;
          btn.style.pointerEvents = "auto";
        }
      }
    };

    // 6. Detección Inteligente de País / Divisa
    async function autoDetectCurrency() {
      // A. Revisar URL param (e.g. ?currency=usd o ?currency=cop)
      try {
        const params = new URLSearchParams(window.location.search);
        const pCurr = params.get("currency")?.toLowerCase();
        if (pCurr && CURRENCIES[pCurr]) {
          updateDOMForCurrency(pCurr, "single");
          return;
        }
      } catch {}

      // B. Endpoint interno nativo de Vercel por IP (/api/geo)
      try {
        const geoRes = await fetch("/api/geo", { signal: AbortSignal.timeout(1200) });
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData.currency && CURRENCIES[geoData.currency]) {
            updateDOMForCurrency(geoData.currency, "single");
            return;
          }
        }
      } catch {}

      // C. Fallback de geolocalización por IP
      const apis = [
        { url: "https://api.country.is/", extract: (d: any) => d.country },
        { url: "https://freeipapi.com/api/json", extract: (d: any) => d.countryCode },
        { url: "https://ipapi.co/json/", extract: (d: any) => d.country_code },
      ];

      try {
        const detectedCountry = await Promise.any(
          apis.map(async (api) => {
            const res = await fetch(api.url, { signal: AbortSignal.timeout(1200) });
            if (!res.ok) throw new Error("API error");
            const data = await res.json();
            const code = api.extract(data);
            if (!code) throw new Error("No code");
            return String(code).toUpperCase();
          })
        );

        if (detectedCountry && COUNTRY_CURRENCY_MAP[detectedCountry]) {
          const matchedCurr = COUNTRY_CURRENCY_MAP[detectedCountry];
          updateDOMForCurrency(matchedCurr, "single");
          return;
        }
      } catch {}

      // D. Default a MXN
      updateDOMForCurrency("mxn", "single");
    }

    autoDetectCurrency();

    // 8. Delegación de eventos para clicks en botones de la landing
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Click en botón play o contenedor del video
      const vslTrigger = target.closest("#vsl-cover, [onclick*='startVideoDemo']");
      if (vslTrigger) {
        (window as any).startVideoDemo?.();
        return;
      }

      // Click en botón de checkout
      const checkoutTrigger = target.closest("#checkout-cta, [onclick*='handleCheckoutRedirect']");
      if (checkoutTrigger) {
        e.preventDefault();
        (window as any).handleCheckoutRedirect?.(e, "pricing_box_main");
        return;
      }

      // Smooth scroll para todos los enlaces a #oferta
      const ofertaLink = target.closest('a[href="#oferta"]');
      if (ofertaLink) {
        e.preventDefault();
        const ofertaEl = document.getElementById("oferta");
        if (ofertaEl) {
          ofertaEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    document.addEventListener("click", handleDocumentClick);

    // 9. Observer para barra sticky inferior móvil
    const hero = document.getElementById("hero");
    const stickyBar = document.getElementById("sticky-cta-bar");

    let observer: IntersectionObserver | null = null;
    if (hero && stickyBar && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
              stickyBar.classList.remove("translate-y-full");
              stickyBar.classList.add("translate-y-0");
            } else {
              stickyBar.classList.add("translate-y-full");
              stickyBar.classList.remove("translate-y-0");
            }
          });
        },
        { threshold: 0.15 }
      );
      observer.observe(hero);
    }

    // 10. Inyectar Widget de ChatAC (Asistente Gonz) de forma dinámica
    if (!document.getElementById("chatac-widget-container") && !document.getElementById("chatac-active-script")) {
      const script = document.createElement("script");
      script.id = "chatac-active-script";
      script.src = "/widget.js?id=73c922f5-e306-486a-8510-24cf7722d1f2";
      script.setAttribute("data-message", "¿Tienes dudas sobre cómo empaquetar tu curso o conocimiento? ¡Escríbeme! 👋");
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      document.removeEventListener("click", handleDocumentClick);
      if (observer && hero) {
        observer.unobserve(hero);
      }
      const container = document.getElementById("chatac-widget-container");
      if (container) container.remove();
      const activeScript = document.getElementById("chatac-active-script");
      if (activeScript) activeScript.remove();
    };
  }, []);

  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: htmlContent,
        }}
      />

      {/* Modal de Aviso de Pago / Stripe */}
      {modalNotice.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold border border-amber-200">
              💳
            </div>
            <h3 className="text-xl font-bold text-slate-900">{modalNotice.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{modalNotice.message}</p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setModalNotice({ open: false, title: "", message: "" })}
                className="w-full px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
