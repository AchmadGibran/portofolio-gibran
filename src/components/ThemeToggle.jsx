"use client";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { Sun, Moon } from "lucide-react";

// Toggle tema "lampu": gelap <-> terang dengan lingkaran yang melebar dari tombol (View Transitions API).
// Peramban yang belum mendukung otomatis berpindah tanpa animasi. Pilihan disimpan di localStorage.
export default function ThemeToggle() {
  const [light, setLight] = useState(false);
  useEffect(() => { setLight(document.documentElement.classList.contains("light")); }, []);

  const toggle = (e) => {
    const next = !light, root = document.documentElement;
    const apply = () => {
      root.classList.toggle("light", next);
      try { localStorage.setItem("theme", next ? "light" : "dark"); } catch {}
      setLight(next);
    };
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return apply();
    const r = e.currentTarget.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(() => flushSync(apply)).ready.then(() =>
      root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${R}px at ${x}px ${y}px)`] },
        { duration: 750, easing: "cubic-bezier(.77,0,.18,1)", pseudoElement: "::view-transition-new(root)" }));
  };

  return (
    <button type="button" onClick={toggle} aria-pressed={light} aria-label={light ? "Aktifkan mode gelap" : "Aktifkan mode terang"}
      title={light ? "Matikan lampu (mode gelap)" : "Nyalakan lampu (mode terang)"}
      className="grid h-10 w-10 place-items-center rounded-full border bg-ink/60 text-fg backdrop-blur-md transition-transform hover:scale-110 active:scale-95">
      {light ? <Moon size={17} /> : <Sun size={17} />}
    </button>
  );
}
