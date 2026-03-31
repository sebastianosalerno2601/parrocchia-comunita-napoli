import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
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

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: path === "/" || path.startsWith("/chiese/") || path === "/eventi" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/chiese/") ? 0.8 : path === "/eventi" ? 0.7 : 0.5,
  }));
}

