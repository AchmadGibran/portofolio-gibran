import { STACK } from "../data/stack";
import { Split, Reveal, SceneLabel } from "../components/ui/Anim";

const ALL = STACK.flatMap((g) => g.items);
const Row = ({ items, rev }) => (
  <div className="overflow-hidden" aria-hidden>
    <div className={`marquee ${rev ? "rev" : ""}`}>
      {[...items, ...items].map((t, i) => (
        <span key={i} className="outline-text font-display whitespace-nowrap px-5 text-4xl font-extrabold uppercase tracking-tight sm:text-6xl">
          {t}<span className="ml-10 text-accent/60">✦</span>
        </span>
      ))}
    </div>
  </div>
);

// Kamera mundur (wide shot): benda-benda minat mengorbit karakter, teks stack berjalan di depan.
export default function Stack() {
  return (
    <section id="stack" data-stage className="relative flex min-h-[110svh] flex-col justify-center gap-12 overflow-hidden py-24">
      <div className="px-5 sm:px-10">
        <Reveal><SceneLabel no="04" name="Stack" /></Reveal>
        <Split lines={["Alat yang", "saya pakai."]} className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl" />
      </div>
      <div className="space-y-2">
        <Row items={ALL.slice(0, Math.ceil(ALL.length / 2))} />
        <Row items={ALL.slice(Math.ceil(ALL.length / 2))} rev />
      </div>
      <div className="grid gap-3 px-5 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
        {STACK.map(({ icon: Icon, title, items }, i) => (
          <Reveal key={title} delay={i * 90} className="surface rounded-2xl p-5 !bg-[var(--surface-bg)]">
            <Icon size={20} className="text-accent" />
            <h3 className="mt-3 font-display text-base font-bold text-fg">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-soft">{items.join(" · ")}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
