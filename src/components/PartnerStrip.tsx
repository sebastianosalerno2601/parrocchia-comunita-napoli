import Image from "next/image";

const partners = [
  {
    nome: "Asso.Gio.Ca",
    src: "/partners/Asso.Gio.ca.png",
  },
  {
    nome: 'Istituto Comprensivo "Campo del Moricino"',
    src: "/partners/Moricino-Borsellino.jpg",
  },
  {
    nome: "Parrocchia Santa Maria La Scala",
    src: "/partners/Logo-Santa-Maria-La-Scala.png",
  },
] as const;

export function PartnerStrip() {
  return (
    <section className="border-b border-[var(--nav-border)] bg-[var(--paper)]/95 px-3 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ink-muted)]">
          Partner
        </p>
        <div className="grid w-full grid-cols-3 items-stretch gap-2 sm:gap-6 md:gap-8">
          {partners.map((partner) => (
            <div
              key={partner.nome}
              className="grid min-h-36 grid-rows-[5.2rem_1fr] items-stretch rounded-lg border border-[var(--nav-border)] bg-[var(--paper-deep)]/60 px-2 py-2.5 sm:min-h-42 sm:grid-rows-[6rem_1fr] sm:px-4 sm:py-3.5 md:min-h-44 md:grid-rows-[6.2rem_1fr]"
              title={partner.nome}
            >
              <p className="flex h-full items-center justify-center text-center font-display text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--ink-muted)] sm:text-xs">
                {partner.nome}
              </p>
              <div className="flex items-center justify-center">
                <Image
                  src={partner.src}
                  alt={`Logo partner: ${partner.nome}`}
                  width={380}
                  height={160}
                  className="h-22 w-auto object-contain sm:h-18 md:h-22"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

