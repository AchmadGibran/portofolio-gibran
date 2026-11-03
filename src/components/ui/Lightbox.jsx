"use client";

import { createContext, useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export const LightboxCtx = createContext(() => {});

// Menyediakan fungsi open({ src, alt }) ke seluruh komponen + menampilkan gambar layar penuh
export function LightboxProvider({ children }) {
  const [box, setBox] = useState(null);
  const go = (d) => setBox((b) => (b && b.list ? { ...b, index: (b.index + d + b.list.length) % b.list.length } : b));
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setBox(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const cur = box && (box.list ? box.list[box.index] : box);
  return (
    <LightboxCtx.Provider value={setBox}>
      {children}
      {box && (
        <div role="dialog" aria-modal="true" aria-label={cur.alt} onClick={() => setBox(null)}
          className="fadein fixed inset-0 z-[60] flex cursor-zoom-out items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <button type="button" aria-label="Tutup" className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"><X size={20} /></button>
          {box.list && (<>
            <button type="button" aria-label="Sebelumnya" onClick={(e) => { e.stopPropagation(); go(-1); }} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20"><ChevronLeft size={22} /></button>
            <button type="button" aria-label="Berikutnya" onClick={(e) => { e.stopPropagation(); go(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20"><ChevronRight size={22} /></button>
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">{box.index + 1} / {box.list.length} · {cur.alt}</p>
          </>)}
          <img key={cur.src} src={cur.src} alt={cur.alt} className="pop max-h-full max-w-full rounded-xl shadow-2xl" />
        </div>
      )}
    </LightboxCtx.Provider>
  );
}
