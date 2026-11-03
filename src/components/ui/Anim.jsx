"use client";
import { createElement, useEffect, useRef, useState } from "react";

const useInView = (margin = "-8% 0px") => {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  const [armed, setArmed] = useState(false); // tunggu loader selesai agar animasi tidak jalan di balik layar pembuka
  useEffect(() => {
    if (document.documentElement.dataset.ready) return setArmed(true);
    const f = () => setArmed(true);
    window.addEventListener("porto:ready", f);
    return () => window.removeEventListener("porto:ready", f);
  }, []);
  useEffect(() => {
    if (!armed) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { rootMargin: margin });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [margin, armed]);
  return [ref, on];
};

// Teks muncul per huruf. `hero` = menunggu loader selesai dulu.
export function Split({ lines, className = "", delay = 0, hero = false, as = "h2" }) {
  const [ref, inView] = useInView();
  const [ready, setReady] = useState(!hero);
  useEffect(() => {
    if (!hero) return;
    if (document.documentElement.dataset.ready) return setReady(true);
    const f = () => setReady(true);
    window.addEventListener("porto:ready", f);
    return () => window.removeEventListener("porto:ready", f);
  }, [hero]);
  let n = 0;
  return createElement(as, { ref, className, "aria-label": lines.join(" "), ...(inView && ready ? { "data-on": "" } : {}) },
    lines.map((line, li) => (
      <span key={li} className="split-line" aria-hidden>
        {[...line].map((ch, i) => (
          <span key={i} className="char" style={{ "--i": n++, "--d": `${delay}ms` }}>{ch === " " ? "\u00A0" : ch}</span>
        ))}
      </span>
    )));
}

export function Reveal({ children, delay = 0, className = "", as: Tag = "div" }) {
  const [ref, on] = useInView("-6% 0px");
  return <Tag ref={ref} className={`reveal ${className}`} style={{ "--d": `${delay}ms` }} {...(on ? { "data-in": "" } : {})}>{children}</Tag>;
}

export function Counter({ to, decimals = 0, suffix = "" }) {
  const [ref, on] = useInView("-10% 0px");
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!on) return;
    const t0 = performance.now(); let raf;
    const step = (t) => { const p = Math.min(1, (t - t0) / 1400); setV(to * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [on, to]);
  return <span ref={ref} className="tabular-nums">{v.toFixed(decimals)}{suffix}</span>;
}

export const SceneLabel = ({ no, name }) => <p className="label mb-5"><span className="text-faint">Scene {no}</span> — {name}</p>;
