"use client";
import { useEffect, useRef } from "react";

// Kursor khusus: hanya di perangkat dengan mouse. Di layar sentuh tidak dimuat sama sekali.
export default function Cursor() {
  const dot = useRef(null);
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.body.classList.add("has-cursor");
    let x = -100, y = -100, rx = x, ry = y, big = false, raf;
    const move = (e) => { x = e.clientX; y = e.clientY; big = !!e.target.closest?.("a,button,[role=button]"); };
    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%) scale(${big ? 2.6 : 1})`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { removeEventListener("pointermove", move); cancelAnimationFrame(raf); document.body.classList.remove("has-cursor"); };
  }, []);
  return <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-4 w-4 rounded-full bg-white mix-blend-difference [@media(hover:hover)_and_(pointer:fine)]:block transition-[scale]" style={{ transform: "translate(-100px,-100px)" }} />;
}
