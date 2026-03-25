export const tipiCertificato = [
  { value: "battesimo", label: "Battesimo" },
  { value: "cresima", label: "Cresima" },
  { value: "matrimonio", label: "Matrimonio" },
] as const;

export type TipoCertificatoValue = (typeof tipiCertificato)[number]["value"];
