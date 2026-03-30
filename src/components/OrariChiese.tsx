import type { ParrocchiaTheme, ParrocchiaSlug } from "@/lib/parrocchie";
import { ORARI_PARROCCHIE } from "@/lib/orari-parrocchie";

function Block({
  titolo,
  items,
}: {
  titolo: string;
  items: string[];
}) {
  return (
    <div>
      <h3 className="font-display text-lg font-semibold text-[var(--ink)]">
        {titolo}
      </h3>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--ink-muted)]">
        {items.map((it) => (
          <li key={it} className="flex gap-2">
            <span aria-hidden className="mt-0.5">
              •
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OrariChiese({
  slug,
  tema,
}: {
  slug: ParrocchiaSlug;
  tema: ParrocchiaTheme;
}) {
  const data = ORARI_PARROCCHIE[slug];
  if (!data) return null;

  return (
    <div
      className={[
        "mt-6 rounded-2xl border border-[var(--nav-border)] bg-[var(--paper)]/60 p-6 shadow-sm backdrop-blur-sm",
        tema === "barocco" ? "baroque-frame" : "",
        tema === "normanno" ? "norman-band" : "",
      ].join(" ")}
    >
      <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">
        Orari e attività
      </h2>

      <div className="mt-5 grid gap-6 md:grid-cols-2">
        {data.apertura ? (
          <Block titolo={data.apertura.titolo} items={data.apertura.items} />
        ) : null}

        <div>
          <h3 className="font-display text-lg font-semibold text-[var(--ink)]">
            Messe
          </h3>
          <div className="mt-4 space-y-5">
            {data.messe.map((b) => (
              <Block key={b.titolo} titolo={b.titolo} items={b.items} />
            ))}
          </div>
        </div>

        {data.eventi ? (
          <div className="md:col-span-2">
            <div className="mt-0">
              {data.eventi.map((b) => (
                <Block key={b.titolo} titolo={b.titolo} items={b.items} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

