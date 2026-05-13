import type { MetadataRoute } from "next";
import { listEventi } from "@/lib/eventi-store";

/** Sitemap aggiornata con eventi da DB (fallback solo pagine statiche se il DB non è disponibile). */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://santeligiomaggiore.it";
  const base = siteUrl.replace(/\/$/, "");
  const lastModified = new Date();

  const paths = [
    "/",
    "/caritas",
    "/eventi",
    "/privacy-policy",
    "/cookie-policy",
    "/chiese/sant-arcangelo-armieri",
    "/chiese/sant-eligio-maggiore",
    "/chiese/san-giovanni-a-mare",
  ] as const;

  const staticEntries: MetadataRoute.Sitemap = paths.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency:
      path === "/" || path.startsWith("/chiese/") || path === "/eventi"
        ? "weekly"
        : "monthly",
    priority:
      path === "/"
        ? 1
        : path.startsWith("/chiese/")
          ? 0.8
          : path === "/eventi"
            ? 0.7
            : 0.5,
  }));

  let eventEntries: MetadataRoute.Sitemap = [];
  try {
    const eventi = await listEventi();
    eventEntries = eventi.map((e) => ({
      url: `${base}/eventi/${e.id}`,
      lastModified: new Date(e.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.55,
    }));
  } catch {
    // Build o ambiente senza Supabase: restano le URL statiche.
  }

  return [...staticEntries, ...eventEntries];
}

