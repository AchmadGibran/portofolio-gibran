"use client";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV } from "../data/navigation";
import { PROFILE } from "../data/profile";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    NAV.forEach(([id]) => { const el = document.getElementById(id); el && io.observe(el); });
    return () => io.disconnect();
  }, []);
  useEffect(() => { document.documentElement.style.overflow = open ? "hidden" : ""; }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 sm:px-8">
      <div className="flex items-center gap-3">
        <a href="#top" className="font-display text-sm font-bold uppercase tracking-[.18em]">{PROFILE.name.split(" ").map((w) => w[0]).join("")}<span className="text-accent">.</span></a>
        <ThemeToggle />
      </div>
      <div className="flex items-center gap-2">
        <nav className="hidden gap-1 rounded-full border bg-ink/60 p-1 backdrop-blur-md md:flex" aria-label="Navigasi utama">
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={`rounded-full px-4 py-1.5 text-sm transition-colors ${active === id ? "bg-fg text-ink" : "text-soft hover:text-fg"}`}>{label}</a>
          ))}
        </nav>
        <button type="button" aria-label={open ? "Tutup menu" : "Buka menu"} onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-full border bg-ink/60 backdrop-blur-md md:hidden">{open ? <X size={18} /> : <Menu size={18} />}</button>
      </div>
      {open && (
        <div className="fadein fixed inset-0 -z-10 flex flex-col justify-center gap-2 bg-ink/95 px-8 md:hidden">
          {NAV.map(([id, label], i) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="font-display text-5xl font-extrabold tracking-tight text-fg/90 active:text-accent">
              <span className="mr-3 font-mono text-xs text-accent">0{i + 1}</span>{label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
