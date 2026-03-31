import type { Metadata, Viewport } from "next";
import { Cormorant, Spectral } from "next/font/google";
import { ChurchTheme } from "@/components/ChurchTheme";
import { FloatingSocial } from "@/components/FloatingSocial";
import { Navbar } from "@/components/Navbar";
import { PartnerStrip } from "@/components/PartnerStrip";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import "./globals.css";

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
});

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteName = "Comunità parrocchiale Napoli";

export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Comunità parrocchiale — Napoli",
    template: "%s — Comunità parrocchiale Napoli",
  },
  description:
    "Tre chiese nel centro storico di Napoli: Sant’Arcangelo agli Armieri, Sant’Eligio Maggiore e San Giovanni a mare.",
  keywords: [
    "Sant'Eligio Maggiore",
    "San Giovanni a Mare",
    "Sant'Arcangelo agli Armieri",
    "parrocchie Napoli centro storico",
    "messe Napoli",
    "eventi parrocchiali Napoli",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: siteUrl,
    siteName,
    title: "Comunità parrocchiale — Napoli",
    description:
      "Tre chiese nel centro storico di Napoli: Sant’Arcangelo agli Armieri, Sant’Eligio Maggiore e San Giovanni a mare.",
    images: [
      {
        url: "/Logo-comunita.png",
        width: 1040,
        height: 600,
        alt: "Logo Comunità parrocchiale Napoli",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Comunità parrocchiale — Napoli",
    description:
      "Tre chiese nel centro storico di Napoli: Sant’Arcangelo agli Armieri, Sant’Eligio Maggiore e San Giovanni a mare.",
    images: ["/Logo-comunita.png"],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: "/favicon.ico?v=2",
    shortcut: "/favicon.ico?v=2",
    apple: "/Logo-comunita.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${cormorant.variable} ${spectral.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col pt-[calc(4.75rem+env(safe-area-inset-top,0px))] md:pt-0">
        <ChurchTheme />
        <ScrollToTop />
        <Navbar />
        <PartnerStrip />
        <FloatingSocial />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
