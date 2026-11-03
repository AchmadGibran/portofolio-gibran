"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { stage } from "../lib/stage";

const Stage3D = dynamic(() => import("./three/Stage3D"), { ssr: false });
const SCENES = ["Intro", "About", "Credentials", "Stack", "Projects", "Highlights", "Contact"];
const clamp = (v) => Math.min(1, Math.max(0, v));
const smooth = (t) => t * t * (3 - 2 * t);

// Menghitung posisi scroll sebagai "adegan" (stage.p) + HUD ala showreel (REC, timecode, bar progres).
export default function Stage() {
  const bar = useRef(null), hud = useRef(null);

  useEffect(() => {
    const els = [...document.querySelectorAll("[data-stage]")];
    let tops = [];
    const measure = () => { tops = els.map((e) => e.getBoundingClientRect().top + scrollY); tops.push(document.documentElement.scrollHeight); update(); };
    const update = () => {
      const y = scrollY, n = els.length - 1;
      let i = 0;
      while (i < n && y >= tops[i + 1] - 1) i++;
      const span = Math.max(1, tops[i + 1] - tops[i]);
      // tahan di adegan ini 35% awal, lalu bergerak halus ke adegan berikutnya
      stage.p = i + (i < n ? smooth(clamp(((y - tops[i]) / span - 0.35) / 0.65)) : 0);
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight), frac = clamp(y / max);
      if (bar.current) bar.current.style.transform = `scaleX(${frac})`;
      if (hud.current) {
        const s = Math.round(frac * 90), mm = String(Math.floor(s / 60)).padStart(2, "0"), ss = String(s % 60).padStart(2, "0");
        hud.current.textContent = `SCENE ${String(i + 1).padStart(2, "0")}/${String(n + 1).padStart(2, "0")} · ${SCENES[i] || ""} · ${mm}:${ss}`;
      }
      stage.wake?.();
    };
    measure();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", measure);
    const ro = new ResizeObserver(measure); ro.observe(document.body);
    return () => { removeEventListener("scroll", update); removeEventListener("resize", measure); ro.disconnect(); };
  }, []);

  return (
    <>
      <Stage3D />
      <div ref={bar} aria-hidden className="fixed left-0 top-0 z-[80] h-[2px] w-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
      <div aria-hidden className="pointer-events-none fixed bottom-4 left-4 z-[60] hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-faint sm:flex">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" /> REC <span ref={hud} />
      </div>
    </>
  );
}
