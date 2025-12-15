import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://anthonypezer.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: {
    default:
      "Gana $2,000 a $5,000 USD con Compra y Venta de Relojes | Anthony Pezer",
    template: "%s | Anthony Pezer - Inversión en Relojes",
  },
  description:
    "Aprende la habilidad que Anthony Pezer utiliza para generar $3K-$5K por operación comprando y revendiendo relojes de lujo. Método simple y replicable en 90 días.",
  keywords: [
    "inversión en relojes",
    "compra venta relojes",
    "relojes de lujo",
    "Anthony Pezer",
    "negocio de relojes",
    "invertir en relojes",
    "relojes como inversión",
    "masterclass relojes",
    "cultura relojes",
    "ganar dinero con relojes",
  ],
  authors: [{ name: "Anthony Pezer" }],
  creator: "Anthony Pezer",
  publisher: "Cultura Relojes",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
    languages: {
      "es-MX": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: siteUrl,
    siteName: "Anthony Pezer - Inversión en Relojes",
    title: "Gana $2,000 a $5,000 USD con Compra y Venta de Relojes",
    description:
      "Descubre el método que personas comunes están usando para generar ingresos con relojes de lujo — sin ser millonario, sin contactos, solo estrategia.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Anthony Pezer - Masterclass de Relojes de Lujo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gana $2,000 a $5,000 USD con Compra y Venta de Relojes",
    description:
      "Aprende la habilidad de lujo que genera $3K–$5K por operación con relojes en 90 días.",
    images: ["/og-image.jpg"],
    creator: "@anthonypezer",
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
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Anthony Pezer - Inversión en Relojes",
      description:
        "Aprende a generar $3K-$5K por operación comprando y revendiendo relojes de lujo",
      inLanguage: "es-MX",
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: "Gana $2,000 a $5,000 USD con Compra y Venta de Relojes",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#person` },
      description:
        "Descubre el método que personas comunes están usando para generar ingresos con relojes de lujo — sin ser millonario, sin contactos, solo estrategia.",
      inLanguage: "es-MX",
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Anthony Pezer",
      url: siteUrl,
      sameAs: ["https://calendly.com/anthonypezer"],
      jobTitle: "Experto en Inversión de Relojes",
    },
    {
      "@type": "Course",
      "@id": `${siteUrl}/#course`,
      name: "Masterclass de Inversión en Relojes de Lujo",
      description:
        "Aprende la habilidad de lujo que genera $3K–$5K por operación con relojes en 90 días",
      provider: {
        "@type": "Person",
        name: "Anthony Pezer",
      },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        inLanguage: "es-MX",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
