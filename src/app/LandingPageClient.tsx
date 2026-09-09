"use client";

import React, { useEffect, useState } from "react";

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
    // 1. Registrar startVideoDemo en window
    (window as any).startVideoDemo = () => {
      const cover = document.getElementById("vsl-cover");
      const container = document.getElementById("video-embed-container");
      const iframe = document.getElementById("bunny-vsl-iframe") as HTMLIFrameElement | null;

      if (container && iframe) {
        const dataSrc = iframe.getAttribute("data-src") || "";
        if (!iframe.src || iframe.src === "" || iframe.src === window.location.href) {
          iframe.src = dataSrc;
        }
        cover?.classList.add("hidden");
        container.classList.remove("hidden");
      } else {
        const target = document.getElementById("oferta");
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    // 2. Registrar handleWhatsAppSupport en window
    (window as any).handleWhatsAppSupport = (event?: any, source?: string) => {
      if (event) event.preventDefault();
      const whatsappUrl = "https://wa.me/521XXXXXXXXXX?text=Hola%20Gonzalo,%20tengo%20una%20duda%20antes%20de%20inscribirme%20al%20Programa%20Digital%20Escalable";
      window.open(whatsappUrl, "_blank");
    };

    // 3. Registrar handleCheckoutRedirect en window
    (window as any).handleCheckoutRedirect = async (event?: any, source?: string) => {
      if (event) event.preventDefault();

      const btn = (event && event.currentTarget) || document.getElementById("checkout-cta");
      const originalHtml = btn ? btn.innerHTML : "";
      if (btn) {
        btn.innerHTML = `<span>Conectando con pasarela segura...</span>`;
        btn.style.pointerEvents = "none";
      }

      try {
        if (typeof (window as any).fbq === "function") {
          (window as any).fbq("track", "InitiateCheckout", {
            content_name: "Programa Digital Escalable",
            content_category: "Educacion Digital",
            value: 3500.0,
            currency: "MXN",
            button_location: source || "pricing_box_main",
          });
        }
      } catch (err) {
        console.error("Pixel tracking error:", err);
      }

      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: "curso-tutores",
            courseTitle: "Programa Digital Escalable",
            price: 3500,
            currency: "MXN",
          }),
        });

        const data = await res.json();

        if (data && data.url) {
          window.location.href = data.url;
          return;
        }

        // Si Stripe aún no tiene STRIPE_SECRET_KEY en el servidor local
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

    // 4. Delegación de eventos para clicks en botones de la landing
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

    // 5. Observer para barra sticky inferior móvil
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

    // 4. Inyectar Widget de ChatAC (Asistente Gonz) de forma dinámica
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
