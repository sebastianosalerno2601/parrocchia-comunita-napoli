import type { Metadata, Viewport } from "next";
import { Cormorant, Spectral } from "next/font/google";
import { ChurchTheme } from "@/components/ChurchTheme";
import { FloatingSocial } from "@/components/FloatingSocial";
import { Navbar } from "@/components/Navbar";
import { PartnerStrip } from "@/components/PartnerStrip";
import { Footer } from "@/components/Footer";
import { CampoEstivoPopup } from "@/components/CampoEstivoPopup";
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
const siteName = "Sant'Eligio Maggiore — Comunità parrocchiale Napoli";

export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Sant'Eligio Maggiore — Comunità parrocchiale Napoli centro storico",
    template: "%s | Sant'Eligio Maggiore e comunità Napoli",
  },
  description:
    "Sant'Eligio Maggiore a Napoli: comunità parrocchiale nel centro storico con Sant'Arcangelo agli Armieri e San Giovanni a mare. Messe, orari e avvisi.",
  keywords: [
    "Sant'Eligio Maggiore Napoli",
    "Chiesa Sant'Eligio Maggiore",
    "parrocchia Sant'Eligio",
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
    title:
      "Sant'Eligio Maggiore — Comunità parrocchiale Napoli centro storico",
    description:
      "Sant'Eligio Maggiore a Napoli: comunità parrocchiale nel centro storico con Sant'Arcangelo agli Armieri e San Giovanni a mare. Messe, orari e avvisi.",
    images: [
      {
        url: "/Logo-comunita.png",
        width: 1040,
        height: 600,
        alt: "Sant'Eligio Maggiore — Comunità parrocchiale Napoli",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Sant'Eligio Maggiore — Comunità parrocchiale Napoli centro storico",
    description:
      "Sant'Eligio Maggiore a Napoli: comunità parrocchiale nel centro storico con Sant'Arcangelo agli Armieri e San Giovanni a mare. Messe, orari e avvisi.",
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
        <CampoEstivoPopup />
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
