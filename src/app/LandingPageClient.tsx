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

      // Precios dinámicos en temario y caja de oferta
      const highTicketEl = document.querySelector('[data-field="high-ticket-pricing"]');
      if (highTicketEl) highTicketEl.textContent = config.highTicketPricing;

      const programRangeEl = document.querySelector('[data-field="program-pricing-range"]');
      if (programRangeEl) programRangeEl.textContent = config.programPricingRange;

      // Precio en caja de oferta
      const priceAmountEl = document.querySelector('[data-field="price-amount"]');
      const priceCurrEl = document.querySelector('[data-field="price-currency"]');
      if (priceAmountEl) {
        if (config.code === "usd" && usdPlan === "split_3" && config.hasSplitOption) {
          priceAmountEl.textContent = config.splitPriceFormatted || "3x $35";
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

      // Selector de planes USD (mostrar solo si la divisa tiene opción diferida activa)
      const usdOptionsEl = document.getElementById("usd-payment-options");
      if (usdOptionsEl) {
        if (config.code === "usd" && config.hasSplitOption) {
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
        if (config.code === "usd" && usdPlan === "split_3" && config.hasSplitOption) {
          stickyPriceEl.textContent = "3x $35 USD";
        } else {
          stickyPriceEl.textContent = `${config.stack.officialPriceDisplay} ${config.stack.currencySuffix}`;
        }
      }
      if (stickyNoteEl) {
        if (config.allowsMSI) {
          stickyNoteEl.textContent = "Hasta MSI con tarjetas participantes";
        } else if (config.code === "usd" && usdPlan === "split_3" && config.hasSplitOption) {
          stickyNoteEl.textContent = "3 pagos diferidos de $35 USD";
        } else {
          stickyNoteEl.textContent = "Acceso completo e ilimitado";
        }
      }

      // Actualizar texto del botón principal CTA
      const ctaText = document.getElementById("checkout-cta-text");
      if (ctaText) {
        if (config.code === "usd" && usdPlan === "split_3" && config.hasSplitOption) {
          ctaText.textContent = `¡INSCRIBIRME EN 3 PAGOS DE $35 USD!`;
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
      const isSplitUSD = config.code === "usd" && currentUsdPlan === "split_3" && !!config.hasSplitOption;
      const chargeValue = isSplitUSD ? (config.splitPrice || 35) : config.price;

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

    // 7. Datos y conmutador interactivo para la sección "¿Para quién es este curso?"
    const ROLE_TABS_DATA: Record<
      string,
      {
        badge: string;
        title: string;
        desc: string;
        teachIcon: string;
        teach: string;
        format: string;
        result: string;
        img: string;
        imgBadge: string;
        imgAlt: string;
      }
    > = {
      cocina: {
        badge: "Oficio Culinario",
        title: "Chefs, Reposteros y Maestros de Cocina",
        desc: "En lugar de desgastarte en una cocina caliente o dar talleres presenciales limitados a 6 alumnos por fecha, graba tus recetas y técnicas maestras una sola vez.",
        teachIcon: "🍳",
        teach: "Repostería comercial, panadería artesanal, masa madre, coctelería o cocina internacional.",
        format: "Videotutoriales paso a paso + recetario en PDF con medidas exactas + grupo para dudas.",
        result: "De cobrar por hora ➔ A vender tu curso a cientos de alumnos en línea",
        img: "/profesiones/chef.webp",
        imgBadge: "Gastronomía",
        imgAlt: "Chef profesional en cocina",
      },
      oficios: {
        badge: "Saber Hacer Práctico",
        title: "Carpinteros, Ebanistas, Mecánicos y Técnicos",
        desc: "La gente busca aprender habilidades manuales reales para ahorrar dinero o emprender. Tu experiencia práctica con las herramientas vale oro.",
        teachIcon: "🪵",
        teach: "Muebles de melamina desde cero, acabados en madera, mecánica preventiva o instalaciones.",
        format: "Demostraciones grabadas en tu taller + listas de despiece y materiales + checklist de compras.",
        result: "De depender solo de pedidos físicos ➔ A generar un ingreso mensual predecible enseñando tu oficio",
        img: "/profesiones/carpintero.webp",
        imgBadge: "Oficios Manuales",
        imgAlt: "Carpintero artesano en taller",
      },
      academia: {
        badge: "Formación & Mentoría",
        title: "Profesores de Idiomas, Matemáticas y Ciencias",
        desc: "Rompe el techo de ingresos de dar clases particulares 1 a 1 donde cambias horas por dinero y tus ingresos caen si te enfermas o tomas vacaciones.",
        teachIcon: "📚",
        teach: "Inglés conversacional para profesionistas, preparación para admisiones o matemáticas sin miedo.",
        format: "Módulos explicativos pre-grabados + ejercicios descargables + una sesión grupal semanal de dudas.",
        result: "De dar 30 horas semanales de clase ➔ A dedicar solo 3 horas y atender a decenas de alumnos",
        img: "/profesiones/profesor.webp",
        imgBadge: "Educación & Mentoría",
        imgAlt: "Profesora y tutora en oficina de estudio",
      },
      belleza: {
        badge: "Servicios de Estética",
        title: "Barberos, Estilistas, Maquillaje y Uñas",
        desc: "Tu cuerpo se cansa de estar de pie 10 horas cortando cabello o aplicando uñas. Multiplica tus ingresos enseñando tu técnica a quienes inician en el rubro.",
        teachIcon: "💈",
        teach: "Técnicas de fade y barba perfecta, aplicación de uñas acrílicas, automaquillaje o micropigmentación.",
        format: "Primeros planos en video con ángulos clave + guía de marcas recomendadas y herramientas.",
        result: "Cobrar por curso lo equivalente a 15 citas presenciales, sin desgastar tu espalda ni tus manos",
        img: "/profesiones/barbero.webp",
        imgBadge: "Cuidado & Estética",
        imgAlt: "Barbero profesional en barbería",
      },
      musica: {
        badge: "Habilidades Creativas",
        title: "Músicos, Fotógrafos, Ilustradores y Creativos",
        desc: "Comparte tu método artístico estructurado para que principiantes aprendan sin frustrarse, desde su casa y a su propio ritmo.",
        teachIcon: "🎸",
        teach: "Guitarra o piano desde cero, fotografía con celular para marcas, ilustración digital o cerámica.",
        format: "Lecciones audiovisuales prácticas + partituras/plantillas descargables + retos semanales.",
        result: "Un catálogo de cursos que inscribe alumnos 24/7 mientras tú sigues creando tu propio arte",
        img: "/profesiones/musico.webp",
        imgBadge: "Artes & Creatividad",
        imgAlt: "Músico e instructora con guitarra acústica",
      },
    };

    const roleKeys = ["cocina", "oficios", "academia", "belleza", "musica"];
    let currentRoleIndex = 0;
    let autoRotateTimer: NodeJS.Timeout | null = null;
    let userInteractedWithRoles = false;
    let isRoleSectionVisible = false;

    const stopRoleAutoRotate = () => {
      userInteractedWithRoles = true;
      if (autoRotateTimer) {
        clearInterval(autoRotateTimer);
        autoRotateTimer = null;
      }
    };

    const activateRoleTab = (roleKey: string, isManual = false) => {
      if (isManual) {
        stopRoleAutoRotate();
        const foundIdx = roleKeys.indexOf(roleKey);
        if (foundIdx !== -1) currentRoleIndex = foundIdx;
      }

      const data = ROLE_TABS_DATA[roleKey];
      if (!data) return;

      const tabBtns = document.querySelectorAll<HTMLElement>("[data-role-tab]");
      tabBtns.forEach((btn) => {
        const key = btn.getAttribute("data-role-tab");
        if (key === roleKey) {
          btn.className =
            "role-tab-btn px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer bg-slate-900 text-white border border-slate-900 shadow-sm";
          // Si el usuario hace clic manual, centrar la pestaña solo dentro del contenedor horizontal móvil (sin mover la ventana)
          if (isManual && btn.parentElement) {
            const container = btn.parentElement;
            const scrollLeft = btn.offsetLeft - container.offsetWidth / 2 + btn.offsetWidth / 2;
            container.scrollTo({ left: scrollLeft, behavior: "smooth" });
          }
        } else {
          btn.className =
            "role-tab-btn px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:text-slate-900 shadow-2xs";
        }
      });

      const cardContainer = document.getElementById("role-card-container");
      if (cardContainer) cardContainer.style.opacity = "0.35";

      setTimeout(() => {
        const badgeEl = document.getElementById("role-badge");
        const titleEl = document.getElementById("role-title");
        const descEl = document.getElementById("role-desc");
        const teachIconEl = document.getElementById("role-teach-icon");
        const teachEl = document.getElementById("role-teach");
        const formatEl = document.getElementById("role-format");
        const resultEl = document.getElementById("role-result");
        const imgEl = document.getElementById("role-img") as HTMLImageElement | null;
        const imgBadgeEl = document.getElementById("role-img-badge");

        if (badgeEl) badgeEl.textContent = data.badge;
        if (titleEl) titleEl.textContent = data.title;
        if (descEl) descEl.textContent = data.desc;
        if (teachIconEl) teachIconEl.textContent = data.teachIcon;
        if (teachEl) teachEl.textContent = data.teach;
        if (formatEl) formatEl.textContent = data.format;
        if (resultEl) resultEl.textContent = data.result;
        if (imgBadgeEl) imgBadgeEl.textContent = data.imgBadge;
        if (imgEl) {
          imgEl.src = data.img;
          imgEl.alt = data.imgAlt;
        }

        if (cardContainer) cardContainer.style.opacity = "1";
      }, 100);
    };

    (window as any).activateRoleTab = activateRoleTab;

    // Solo rotar si el usuario no ha interactuado Y la sección está visible en pantalla
    autoRotateTimer = setInterval(() => {
      if (userInteractedWithRoles || !isRoleSectionVisible) return;
      currentRoleIndex = (currentRoleIndex + 1) % roleKeys.length;
      activateRoleTab(roleKeys[currentRoleIndex], false);
    }, 4500);

    // Observer para pausar la rotación si la sección #para-quien no está en pantalla
    const paraQuienSection = document.getElementById("para-quien");
    let roleObserver: IntersectionObserver | null = null;
    if (paraQuienSection && "IntersectionObserver" in window) {
      roleObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isRoleSectionVisible = entry.isIntersecting;
          });
        },
        { threshold: 0.15 }
      );
      roleObserver.observe(paraQuienSection);
    } else {
      isRoleSectionVisible = true;
    }

    const handleRoleInteraction = () => {
      stopRoleAutoRotate();
    };

    if (paraQuienSection) {
      paraQuienSection.addEventListener("mouseenter", handleRoleInteraction, { passive: true });
      paraQuienSection.addEventListener("touchstart", handleRoleInteraction, { passive: true });
    }

    // 8. Delegación de eventos para clicks en botones de la landing
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Click en mini-pestaña de oficios / profesiones
      const roleTabBtn = target.closest<HTMLElement>("[data-role-tab]");
      if (roleTabBtn) {
        e.preventDefault();
        const roleKey = roleTabBtn.getAttribute("data-role-tab");
        if (roleKey) {
          activateRoleTab(roleKey, true); // true = interacción manual del usuario, detiene la rotación
        }
        return;
      }

      // Si el usuario hace clic dentro de la tarjeta de oficios, detener la rotación para no interrumpir su lectura
      if (target.closest("#role-card-container, #para-quien")) {
        stopRoleAutoRotate();
      }

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
      if (autoRotateTimer) clearInterval(autoRotateTimer);
      document.removeEventListener("click", handleDocumentClick);
      if (observer && hero) {
        observer.unobserve(hero);
      }
      if (roleObserver && paraQuienSection) {
        roleObserver.unobserve(paraQuienSection);
      }
      if (paraQuienSection) {
        paraQuienSection.removeEventListener("mouseenter", handleRoleInteraction);
        paraQuienSection.removeEventListener("touchstart", handleRoleInteraction);
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
