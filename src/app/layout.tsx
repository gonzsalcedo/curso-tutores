import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tutor.gonzsalcedo.com"),
  title: "Curso Digital Escalable: Convierte lo que Sabes en Ingresos y Libertad",
  description: "Aprende a empaquetar tu conocimiento, habilidad u oficio en un curso digital automatizado y escalable. Enseña a más alumnos con total libertad.",
  keywords: [
    "curso para tutores",
    "crear curso digital",
    "vender cursos online",
    "clases particulares escalables",
    "academia online",
    "Gonzalo Salcedo",
  ],
  alternates: {
    canonical: "https://tutor.gonzsalcedo.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎓</text></svg>",
  },
  openGraph: {
    title: "Curso Digital Escalable: Convierte lo que Sabes en Ingresos y Libertad",
    description: "Empaqueta tu habilidad, oficio o conocimiento en un curso digital automatizado. Enseña a más alumnos y genera ingresos con total libertad de tiempo.",
    url: "https://tutor.gonzsalcedo.com",
    siteName: "Curso Digital Escalable | Gonzalo Salcedo",
    images: [
      {
        url: "https://tutor.gonzsalcedo.com/gonzalo-salcedo-office.webp",
        width: 1200,
        height: 630,
        alt: "Gonzalo Salcedo - Curso Digital Escalable",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Curso Digital Escalable: Convierte lo que Sabes en Ingresos y Libertad",
    description: "Empaqueta tu habilidad o conocimiento en un curso digital en un fin de semana. Enseña a más alumnos y genera ingresos con libertad.",
    images: ["https://tutor.gonzsalcedo.com/gonzalo-salcedo-office.webp"],
    creator: "@gonzsalcedo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${plusJakarta.variable} ${outfit.variable} scroll-smooth`}>
      <body className="antialiased min-h-screen bg-[#F3F4F7] text-slate-800 font-sans">
        <AuthProvider>{children}</AuthProvider>

        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID || "2140367103553718"}');
fbq('track', 'PageView');`}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2140367103553718&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        {/* Google Analytics (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-52ZBRL8QM0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-52ZBRL8QM0');
          `}
        </Script>

        {/* Schema.org Structured Data (Google Rich Snippets) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Course",
                  "name": "Curso Digital Escalable: Convierte lo que Sabes en un Negocio Educativo con Libertad",
                  "description": "Aprende a empaquetar tu conocimiento, habilidad u oficio en un curso digital automatizado y escalable.",
                  "provider": {
                    "@type": "Person",
                    "name": "Gonzalo Salcedo",
                    "url": "https://tutor.gonzsalcedo.com",
                  },
                  "offers": {
                    "@type": "Offer",
                    "price": "997",
                    "priceCurrency": "MXN",
                    "availability": "https://schema.org/InStock",
                    "url": "https://tutor.gonzsalcedo.com",
                  },
                  "inLanguage": "es",
                  "educationalCredentialAwarded": "Acceso ilimitado de por vida al aula virtual y plantillas",
                },
                {
                  "@type": "Person",
                  "name": "Gonzalo Salcedo",
                  "jobTitle": "Educador Digital y Consultor de Negocios de Enseñanza",
                  "url": "https://tutor.gonzsalcedo.com",
                  "image": "https://tutor.gonzsalcedo.com/gonzalo-salcedo-office.webp",
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
