import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Institut Belle & Sereine — Lausanne",
    template: "%s | Institut Belle & Sereine",
  },
  description:
    "Institut de beauté à Lausanne. Soins visage, massages, épilation et onglerie. Réservation en ligne 24h/24.",
  keywords: ["institut de beauté", "lausanne", "soins visage", "massage", "épilation", "onglerie", "vaud"],
  authors: [{ name: "Institut Belle & Sereine" }],
  openGraph: {
    type: "website",
    locale: "fr_CH",
    siteName: "Institut Belle & Sereine",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased" style={{ fontFamily: "'Outfit', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
