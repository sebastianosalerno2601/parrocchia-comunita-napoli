"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { parrocchie } from "@/lib/parrocchie";

export function ChurchTheme() {
  const pathname = usePathname();

  useEffect(() => {
    const match = pathname.match(/^\/chiese\/([^/]+)/);
    const slug = match?.[1];
    const p = parrocchie.find((x) => x.slug === slug);
    const root = document.documentElement;

    if (p) {
      root.dataset.church = p.tema;
    } else {
      delete root.dataset.church;
    }

    return () => {
      delete root.dataset.church;
    };
  }, [pathname]);

  return null;
}
