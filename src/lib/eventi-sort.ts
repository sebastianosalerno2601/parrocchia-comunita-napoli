/** Ordina per data/ora evento (ISO) crescente: prima il più imminente. */
export function compareDataIsoAsc(a: { dataIso: string }, b: { dataIso: string }) {
  return new Date(a.dataIso).getTime() - new Date(b.dataIso).getTime();
}

/** Ordine inverso: prima l’evento con data più tarda (es. passati più recenti). */
export function compareDataIsoDesc(a: { dataIso: string }, b: { dataIso: string }) {
  return compareDataIsoAsc(b, a);
}

export function sortProssimiPassati<
  T extends { dataIso: string; isUpcoming: boolean; isPast: boolean },
>(eventi: T[]): { prossimi: T[]; passati: T[] } {
  return {
    prossimi: eventi.filter((e) => e.isUpcoming).sort(compareDataIsoAsc),
    passati: eventi.filter((e) => e.isPast).sort(compareDataIsoDesc),
  };
}

/** Elenco admin: prima tutti i prossimi (dal più vicino), poi i passati (dal più recente). */
export function orderEventiForAdminList<
  T extends { dataIso: string; isUpcoming: boolean; isPast: boolean },
>(eventi: T[]): T[] {
  const { prossimi, passati } = sortProssimiPassati(eventi);
  return [...prossimi, ...passati];
}
