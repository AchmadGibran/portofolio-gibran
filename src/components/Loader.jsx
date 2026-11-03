"use client";
import { useEffect, useState } from "react";
import { PROFILE } from "../data/profile";

const STATUS = [[0, "Menyiapkan kamera"], [25, "Memuat karakter 3D"], [60, "Menata pencahayaan"], [90, "Hampir siap"], [100, "Action!"]];

// Pembuka: memuat model 3D sungguhan (progres nyata dari unduhan), lalu "layar bioskop" terbuka.
export default function Loader() {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState("load"); // load | open | gone

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const t0 = performance.now();
    let real = 0, done = false, shown = 0, raf, alive = true;

    (async () => {
      try {
        const r = await fetch("/models/gibran.glb"); // sekaligus menghangatkan cache untuk kanvas 3D
        const total = +r.headers.get("content-length") || 0;
        const rd = r.body.getReader();
        let got = 0;
        for (;;) {
          const { done: d, value } = await rd.read();
          if (d) break;
          got += value.length;
          real = total ? Math.min(1, got / total) : Math.min(0.9, got / 5.6e6);
        }
      } catch {}
      real = 1; done = true;
    })();

    const finish = () => {
      setPhase("open");
      setTimeout(() => { root.dataset.ready = "1"; window.dispatchEvent(new Event("porto:ready")); }, 450);
      setTimeout(() => { root.style.overflow = ""; setPhase("gone"); }, 1300);
    };
    const tick = () => {
      if (!alive) return;
      const el = performance.now() - t0;
      const target = Math.min(done ? 1 : 0.92, real, el / 1800);
      shown += (target - shown) * 0.12;
      if (done && el > 1800 && shown > 0.995) { setPct(100); finish(); return; }
      setPct(Math.round(shown * 100));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(raf); root.style.overflow = ""; };
  }, []);

  if (phase === "gone") return null;
  const open = phase === "open";
  const status = [...STATUS].reverse().find(([at]) => pct >= at)[1];
  const pad = (n) => String(n).padStart(2, "0");
  const [first, ...rest] = PROFILE.name.toUpperCase().split(" ");
  const corner = "absolute h-6 w-6 border-fg/50 sm:h-8 sm:w-8";
  return (
    <div className="fixed inset-0 z-[100]" role="status" aria-label="Memuat">
      <div className={`curtain absolute inset-x-0 top-0 h-1/2 bg-ink ${open ? "-translate-y-full" : ""}`} />
      <div className={`curtain absolute inset-x-0 bottom-0 h-1/2 bg-ink ${open ? "translate-y-full" : ""}`} />
      <div className={`absolute inset-0 flex flex-col justify-between p-6 transition-opacity duration-500 sm:p-10 ${open ? "opacity-0" : ""}`}>
        {/* bingkai viewfinder kamera */}
        <i aria-hidden className={`${corner} left-4 top-4 border-l-2 border-t-2`} /><i aria-hidden className={`${corner} right-4 top-4 border-r-2 border-t-2`} />
        <i aria-hidden className={`${corner} bottom-4 left-4 border-b-2 border-l-2`} /><i aria-hidden className={`${corner} bottom-4 right-4 border-b-2 border-r-2`} />

        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[.25em] text-soft sm:text-xs">
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500 [animation:flash_1s_steps(1)_infinite]" />REC · TC 00:00:{pad(Math.floor(pct * 0.6))}</span>
          <span>Take 01 · Scene 00/07</span>
        </div>

        <h1 className="font-display text-center text-[clamp(3rem,13vw,10rem)] font-extrabold leading-[.88] tracking-tighter" aria-label={PROFILE.name}>
          <span className="fill-text block" style={{ "--p": `${Math.min(100, pct * 2)}%` }}>{first}</span>
          <span className="fill-text block" style={{ "--p": `${Math.max(0, pct * 2 - 100)}%` }}>{rest.join(" ")}</span>
        </h1>

        <div>
          <div className="flex items-end justify-between gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[.25em] text-accent sm:text-xs">{status}{pct < 100 && <span className="caret" />}</p>
            <p className="font-display text-5xl font-extrabold leading-none tabular-nums sm:text-7xl">{pct}<span className="text-accent">%</span></p>
          </div>
          <div className="mt-4 h-px w-full overflow-hidden bg-fg/15"><div className="h-full bg-accent" style={{ width: `${pct}%` }} /></div>
        </div>
      </div>
    </div>
  );
}
