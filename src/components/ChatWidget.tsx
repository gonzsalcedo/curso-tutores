"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

export default function ChatWidget() {
  const pathname = usePathname();
  // Mostrar en la landing y páginas informativas públicas (ocultar en panel de admin y aula de cursos)
  const isLanding = pathname === "/" || pathname === "/terminos" || pathname === "/privacidad";

  useEffect(() => {
    const el = document.getElementById("chatac-widget-container");
    if (el) {
      el.style.display = isLanding ? "block" : "none";
    }
  }, [pathname, isLanding]);

  if (!isLanding) return null;

  return (
    <Script
      id="chatac-script"
      src="/widget.js?id=73c922f5-e306-486a-8510-24cf7722d1f2"
      data-message="¿Tienes dudas sobre cómo empaquetar tu curso o conocimiento? ¡Escríbeme! 👋"
      strategy="afterInteractive"
    />
  );
}
