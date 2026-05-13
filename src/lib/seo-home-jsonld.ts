import { parrocchie } from "@/lib/parrocchie";

/** Da stringhe tipo "Via … — 80133 Napoli NA" */
function indirizzoToPostalAddress(line: string) {
  const parts = line.split(" — ").map((s) => s.trim());
  const street = parts[0] ?? line;
  const tail = parts[1] ?? "";
  const m = tail.match(/^(\d{5})\s+(.+?)(?:\s+([A-Z]{2}))?$/);
  return {
    "@type": "PostalAddress" as const,
    streetAddress: street,
    addressLocality: m ? m[2].replace(/\s+[A-Z]{2}$/, "").trim() : "Napoli",
    postalCode: m ? m[1] : "",
    addressRegion: "Campania",
    addressCountry: "IT",
  };
}

const FB =
  parrocchie.find((p) => p.facebookPageUrl)?.facebookPageUrl ?? undefined;

export function buildHomePageJsonLd(base: string) {
  const websiteId = `${base}/#website`;
  const orgId = `${base}/#organization`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "Sant'Eligio Maggiore — Comunità parrocchiale Napoli",
        alternateName: [
          "Comunità parrocchiale Napoli",
          "Chiesa di Sant'Eligio Maggiore Napoli",
          "Parrocchia Sant'Eligio Maggiore",
        ],
        url: base,
        inLanguage: "it-IT",
        publisher: { "@id": orgId },
      },
      {
        "@type": "Organization",
        "@id": orgId,
        name: "Sant'Eligio Maggiore — Comunità parrocchiale Napoli",
        url: base,
        logo: {
          "@type": "ImageObject",
          url: `${base}/Logo-comunita.png`,
        },
        ...(FB ? { sameAs: [FB] } : {}),
        subOrganization: parrocchie.map((p) => ({
          "@type": "Church",
          name: p.nomeCompleto,
          url: `${base}/chiese/${p.slug}`,
          address: indirizzoToPostalAddress(p.indirizzo),
        })),
      },
    ],
  };
}
