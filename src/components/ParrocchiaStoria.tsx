import Image from "next/image";
import type { ParrocchiaTheme } from "@/lib/parrocchie";
import type { ParrocchiaStoriaData } from "@/lib/storia-parrocchie";

function shellClass(tema: ParrocchiaTheme) {
  if (tema === "barocco") return "baroque-frame";
  if (tema === "normanno")
    return "norman-band rounded-2xl border border-[var(--nav-border)]";
  return "rounded-2xl border border-[var(--nav-border)]";
}

export function ParrocchiaStoria({
  data,
  tema,
}: {
  data: ParrocchiaStoriaData;
  tema: ParrocchiaTheme;
}) {
  const reverse = data.immaginiASinistra === true;

  return (
    <section
      className={`${shellClass(tema)} bg-[var(--paper)]/90 p-6 shadow-sm backdrop-blur-sm md:p-8`}
      aria-labelledby="storia-parrocchia-titolo"
    >
      <div
        className={`flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10 ${reverse ? "lg:flex-row-reverse" : ""}`}
      >
        <div className="min-w-0 flex-1">
          {data.didascalia ? (
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              {data.didascalia}
            </p>
          ) : null}
          <h2
            id="storia-parrocchia-titolo"
            className="font-display mt-2 text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl"
          >
            {data.titolo}
          </h2>
          {data.sottotitolo ? (
            <p className="mt-2 text-lg italic leading-snug text-[var(--ink-muted)]">
              {data.sottotitolo}
            </p>
          ) : null}

          <div className="mt-6 space-y-4 text-[var(--ink-muted)]">
            {data.blocchi.map((b, i) => {
              if (b.kind === "h3") {
                return (
                  <h3
                    key={i}
                    className="font-display text-lg font-semibold text-[var(--ink)]"
                  >
                    {b.text}
                  </h3>
                );
              }
              if (b.kind === "p") {
                return (
                  <p key={i} className="leading-relaxed">
                    {b.text}
                  </p>
                );
              }
              return (
                <ul
                  key={i}
                  className="list-inside list-disc space-y-2 pl-1 leading-relaxed marker:text-[var(--accent)]"
                >
                  {b.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              );
            })}
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-md shrink-0 flex-col gap-4 lg:mx-0 lg:w-[min(100%,22rem)]">
          {data.immagini.map((img) => (
            <figure
              key={img.src}
              className="overflow-hidden rounded-xl border border-[var(--nav-border)] bg-[var(--paper-deep)] shadow-sm"
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 352px"
                  className="object-cover object-center"
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
