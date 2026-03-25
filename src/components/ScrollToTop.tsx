"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Porta la finestra in cima a ogni cambio di route (es. da una parrocchia all’altra). */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
