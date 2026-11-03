"use client";
import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import { PROFILE } from "../data/profile";
import { Split, Reveal } from "../components/ui/Anim";

function Typed({ lines }) {
  const [t, setT] = useState("");
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setT(lines[0]);
    let i = 0, c = 0, del = false, id;
    const run = () => {
      const s = lines[i];
      c += del ? -1 : 1; setT(s.slice(0, c));
      let wait = del ? 28 : 55;
      if (!del && c === s.length) { del = true; wait = 1700; }
      else if (del && c === 0) { del = false; i = (i + 1) % lines.length; wait = 350; }
      id = setTimeout(run, wait);
    };
    id = setTimeout(run, 1800);
    return () => clearTimeout(id);
  }, [lines]);
  return <span>{t}<span className="caret" /></span>;
}

export default function Hero() {
  const [first, ...rest] = PROFILE.name.split(" ");
  return (
    <section id="top" data-stage className="relative flex min-h-[100svh] flex-col justify-end px-5 pb-16 pt-28 sm:px-10 md:justify-center md:pb-10">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent md:hidden" />
      <div className="relative max-w-5xl">
        <Reveal className="mb-5"><p className="label">{PROFILE.headline}</p></Reveal>
        <Split hero as="h1" lines={[first.toUpperCase(), rest.join(" ").toUpperCase()]}
          className="font-display text-[clamp(3.1rem,14.5vw,10.5rem)] font-extrabold leading-[.86] tracking-tighter" />
        <Reveal delay={700} className="mt-6 max-w-xl">
          <p className="surface inline-flex min-h-[3rem] items-center gap-2 rounded-xl px-4 py-3 font-mono text-sm text-fg sm:text-base">
            <span className="shrink-0 font-bold text-accent">$</span><span>saya membangun <Typed lines={PROFILE.typed} /></span>
          </p>
        </Reveal>
        <Reveal delay={850} className="mt-5 flex flex-wrap gap-2">
          {PROFILE.badges.map((b) => <span key={b} className="chip">{b}</span>)}
        </Reveal>
        <Reveal delay={1000} className="mt-8 flex flex-wrap gap-3">
          <a href="#projects" className="btn btn-solid">Lihat Proyek</a>
          <a href="#contact" className="btn btn-ghost">Hubungi Saya</a>
        </Reveal>
      </div>
      <a href="#about" aria-label="Scroll ke bawah" className="absolute bottom-6 right-5 hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[.3em] text-faint sm:flex md:right-10">
        Scroll <span className="relative block h-12 w-px overflow-hidden bg-fg/15"><span className="absolute inset-0 bg-accent [animation:scrollcue_1.8s_ease-in-out_infinite]" /></span><ArrowDown size={14} />
      </a>
    </section>
  );
}
