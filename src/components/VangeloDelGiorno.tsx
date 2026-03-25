const WIDGET_SRC = "https://evangeli.net/vangelo/widget/web";
const LINK_OMELIE = "https://evangeli.net/vangelo";
const LINK_ABBONAMENTO = "https://evangeli.net/vangelo/abbonamento";

type Props = {
  className?: string;
  iframeClassName?: string;
};

export function VangeloDelGiornoSection({ className, iframeClassName }: Props) {
  return (
    <section
      className={className}
      aria-labelledby="vangelo-del-giorno-titolo"
    >
      <h2
        id="vangelo-del-giorno-titolo"
        className="font-display text-center text-xl font-semibold text-[var(--ink)]"
      >
        Vangelo del giorno
      </h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-[var(--nav-border)] bg-[var(--paper)] shadow-sm">
        <iframe
          src={WIDGET_SRC}
          title="Vangelo del giorno — Evangeli.net"
          className={["h-[min(75vh,720px)] w-full border-0", iframeClassName]
            .filter(Boolean)
            .join(" ")}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
