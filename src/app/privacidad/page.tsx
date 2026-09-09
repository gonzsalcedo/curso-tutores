import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | Programa Digital Escalable",
  description: "Política de Privacidad y Tratamiento de Datos Personales del Programa Digital Escalable con Gonzalo Salcedo.",
};

export default function PrivacidadPage() {
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
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-bold uppercase tracking-wider mb-3">
              Privacidad y Seguridad
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Política de Privacidad
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Última actualización: Septiembre de 2026 • Protección y resguardo de datos
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-600 space-y-6">
            
            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">1. Identidad y Responsable del Tratamiento</h2>
              <p>
                <strong>Gonzalo Salcedo</strong>, a través del sitio web del <strong>Programa Digital Escalable</strong> (en adelante, el "Responsable"), es el encargado del tratamiento y debida protección de los datos personales que nos proporciones al registrarte, consultar información o adquirir nuestros programas educativos.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">2. Datos Personales que Recopilamos</h2>
              <p>
                Recopilamos únicamente la información estrictamente necesaria para prestarte el servicio formativo, habilitar tu acceso al aula virtual y brindarte soporte continuo:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                <li><strong>Datos de Identificación y Contacto:</strong> Nombre, apellidos, dirección de correo electrónico y número de teléfono o WhatsApp.</li>
                <li><strong>Datos de Acceso:</strong> Credenciales de autenticación segura para el aula virtual (contraseñas cifradas o tokens de acceso autenticado con Google).</li>
                <li><strong>Datos de Transacción:</strong> Identificador de la orden, fecha, divisa e importe de pago generado por la pasarela de cobro bancario (Stripe). No almacenamos números de tarjeta de crédito/débito en nuestros servidores.</li>
                <li><strong>Métricas de Aprendizaje:</strong> Progreso en las lecciones, módulos completados y participación en el área de alumnos.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">3. Finalidad del Tratamiento de los Datos</h2>
              <p>
                Tus datos personales son utilizados para las siguientes finalidades esenciales:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                <li>Crear, verificar y administrar tu cuenta de alumno en la plataforma.</li>
                <li>Enviarte tus accesos directos, recibos de compra y notificaciones sobre el avance del curso.</li>
                <li>Ofrecerte asistencia técnica y responder dudas a través del canal de soporte o WhatsApp.</li>
                <li>Optimizar la experiencia pedagógica y la calidad técnica de los contenidos.</li>
                <li>Cumplir con las obligaciones fiscales y legales derivadas de la contratación de servicios.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">4. Almacenamiento Seguro e Infraestructura</h2>
              <p>
                Implementamos estándares de seguridad avanzados en la nube para resguardar tu información contra acceso no autorizado, alteración o divulgación:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                <li><strong>Autenticación y Base de Datos:</strong> Gestión segura mediante servidores certificados con reglas estrictas de acceso restringido (Firebase / Google Cloud).</li>
                <li><strong>Comunicaciones Cifradas:</strong> Todo el tráfico entre tu navegador y nuestro sitio web viaja protegido mediante certificados SSL/TLS con encriptación de 256 bits.</li>
                <li><strong>No Venta de Datos:</strong> En ningún caso comercializamos, alquilamos ni transferimos tus datos personales a empresas de publicidad de terceros.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">5. Uso de Cookies y Tecnologías de Medición</h2>
              <p>
                Utilizamos cookies funcionales y etiquetas de medición (como Meta Pixel) exclusivamente para:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                <li>Mantener tu sesión abierta dentro del aula de alumnos.</li>
                <li>Analizar estadísticas anónimas de navegación para corregir fallas y mejorar la velocidad del sitio.</li>
                <li>Medir la efectividad de nuestras campañas de difusión para educadores y profesionales.</li>
              </ul>
              <p>
                Puedes inhabilitar o borrar las cookies en cualquier momento desde la configuración de tu navegador de internet.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">6. Derechos de Acceso, Rectificación, Cancelación y Oposición (ARCO)</h2>
              <p>
                En cualquier momento tienes derecho a conocer qué datos tenemos sobre ti, solicitar la corrección de tus datos en caso de ser inexactos, pedir su eliminación definitiva de nuestra base de datos o revocar el consentimiento que nos hayas otorgado.
              </p>
              <p>
                Para ejercer estos derechos, simplemente escríbenos solicitando la actualización o baja de tus datos a través de nuestros canales oficiales de contacto.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">7. Cambios a esta Política de Privacidad</h2>
              <p>
                Podremos actualizar la presente Política de Privacidad periódicamente para reflejar mejoras operativas o exigencias legales. Cualquier cambio sustancial será publicado en esta misma página con su fecha de revisión actualizada.
              </p>
            </section>

          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <span>© {new Date().getFullYear()} Programa Digital Escalable con Gonzalo Salcedo.</span>
            <div className="flex items-center gap-4">
              <Link href="/terminos" className="hover:text-blue-700 font-semibold transition-colors">
                Términos y Condiciones
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
