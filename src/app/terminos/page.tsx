import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones de Uso | Programa Digital Escalable",
  description: "Términos y condiciones de uso del Programa Digital Escalable con Gonzalo Salcedo.",
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-800 flex flex-col justify-between">
      {/* Header Minimalista */}
      <header className="w-full border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base hover:text-blue-700 transition-colors">
            <span className="text-lg">🎓</span>
            <span>Programa Digital Escalable</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span>← Volver al Inicio</span>
          </Link>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-3xl mx-auto px-4 py-10 sm:py-14 flex-grow">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          
          <div className="border-b border-slate-100 pb-6 text-center sm:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold uppercase tracking-wider mb-3">
              Documento Legal
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Términos y Condiciones de Uso
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Última actualización: Septiembre de 2026 • Plataforma formativa de Gonzalo Salcedo
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-600 space-y-6">
            
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">1. Aceptación y Objeto de los Términos</h2>
              <p>
                Al acceder, navegar o adquirir cualquiera de los programas formativos, talleres o recursos digitales ofrecidos a través del sitio web de <strong>Programa Digital Escalable</strong> (en adelante, la "Plataforma"), gestionado por <strong>Gonzalo Salcedo</strong>, el usuario acepta de manera íntegra e incondicional los presentes Términos y Condiciones.
              </p>
              <p>
                Si no estás de acuerdo con alguna de las cláusulas aquí descritas, te solicitamos abstenerte de utilizar la plataforma o contratar los servicios formativos.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">2. Naturaleza del Programa Formativo</h2>
              <p>
                El <strong>Programa Digital Escalable</strong> es un servicio de capacitación educativa y consultoría práctica diseñado para guiar a tutores, educadores y profesionales con oficio en la estructuración, empaquetado y comercialización de cursos y contenidos digitales.
              </p>
              <p>
                Los contenidos se entregan a través de un aula virtual con videos pregrabados de alta definición, guías prácticas, plantillas de trabajo y canales de soporte según el plan contratado.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">3. Tarifas, Precios y Divisas</h2>
              <p>
                Los precios de inscripción al programa, así como cualquier actualización, módulo complementario o servicio adicional, están sujetos a las tarifas vigentes mostradas de forma transparente en la pantalla de pago (checkout) al momento de formalizar la compra.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                <li>
                  <strong>Variabilidad de Divisas:</strong> La plataforma puede mostrar y liquidar transacciones en diversas divisas (incluyendo pesos mexicanos MXN, dólares estadounidenses USD u otras monedas locales según el país de compra del usuario). La divisa exacta aplicable y el importe total a cobrar siempre se detallan de forma clara previo a la confirmación de pago.
                </li>
                <li>
                  <strong>Actualización de Tarifas:</strong> Nos reservamos el derecho de modificar precios, ofertas temporales o planes en el futuro. Todo ajuste tarifario no afectará a los alumnos que ya hayan formalizado previamente su inscripción.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">4. Licencia de Uso Personal e Intransferible</h2>
              <p>
                La adquisición del curso confiere al alumno una <strong>licencia de acceso personal, individual e intransferible</strong> para fines educativos propios.
              </p>
              <p className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl">
                <strong>Queda estrictamente prohibido:</strong> compartir credenciales de acceso con terceros, revender, descargar de forma no autorizada, reproducir públicamente o comercializar los videos, guiones, plantillas o códigos suministrados en el aula virtual. El incumplimiento de esta cláusula causará la baja inmediata del usuario sin derecho a reembolso y las acciones legales pertinentes.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">5. Garantía de Satisfacción de 7 Días</h2>
              <p>
                Con el objetivo de garantizar una experiencia educativa de total confianza, ofrecemos una <strong>garantía de satisfacción de 7 días naturales</strong> contados a partir del momento de confirmación de la compra.
              </p>
              <p>
                Si durante este período consideras que el programa no cumple con lo prometido, podrás solicitar la devolución íntegra del 100% de tu dinero comunicándote a través de nuestros canales oficiales de soporte o WhatsApp. El reembolso se tramitará directamente hacia el mismo método de pago original a través de la pasarela bancaria.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">6. Procesamiento Seguro de Pagos</h2>
              <p>
                Todas las operaciones electrónicas con tarjeta de crédito o débito se procesan a través de pasarelas de pago bancario con certificación PCI-DSS nivel 1 (como Stripe). En ningún momento nuestra plataforma almacena números completos de tarjeta ni códigos de seguridad bancarios (CVV).
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">7. Descargo de Responsabilidad de Resultados</h2>
              <p>
                La plataforma enseña estrategias comprobadas, herramientas pedagógicas y técnicas de automatización de ventas. Sin embargo, los resultados comerciales de cada alumno dependen directamente de su dedicación personal, la naturaleza de su disciplina, la calidad de su oferta y las condiciones particulares de su mercado. No se garantizan ingresos específicos ni retornos financieros automáticos sin la ejecución del trabajo formativo.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">8. Contacto y Soporte</h2>
              <p>
                Para cualquier duda, aclaración o solicitud relacionada con estos Términos y Condiciones, puedes contactarnos a través de los canales oficiales de atención al alumno disponibles en la plataforma o escribiéndonos vía WhatsApp.
              </p>
            </section>

          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <span>© {new Date().getFullYear()} Programa Digital Escalable con Gonzalo Salcedo.</span>
            <div className="flex items-center gap-4">
              <Link href="/privacidad" className="hover:text-blue-700 font-semibold transition-colors">
                Política de Privacidad
              </Link>
              <span>•</span>
              <Link href="/" className="hover:text-blue-700 font-semibold transition-colors">
                Página Principal
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
