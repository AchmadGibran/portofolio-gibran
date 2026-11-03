"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { Image as ImageIcon, User, Award } from "lucide-react";
import { LightboxCtx } from "./Lightbox";

// Slot gambar: tampil placeholder bila file belum ada; klik untuk memperbesar
function ImageSlot({ src, full, list, index, alt, hint, kind = "image", fit = "object-cover", className = "" }) {
  const Icon = { photo: User, cert: Award, image: ImageIcon }[kind];
  const open = useContext(LightboxCtx);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef(null);

  // Gambar yang gagal dimuat sebelum hydration tidak memicu onError, jadi dicek ulang di sini.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, [src]);

  if (!src || failed)
    return (
      <div className={`flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-fg/20 bg-fg/[0.02] p-3 text-center text-xs text-faint ${className}`}>
        <Icon size={22} /> <span>{hint}</span>
      </div>
    );
  return (
    <button type="button" onClick={() => open(list ? { list, index } : { src: full || src, alt })} aria-label={`Perbesar: ${alt}`}
      className={`group/img block cursor-zoom-in overflow-hidden rounded-2xl border border-fg/10 bg-panel transition hover:border-accent/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${className}`}>
      <img ref={imgRef} src={src} alt={alt} onError={() => setFailed(true)} loading="lazy"
        className={`h-full w-full transition duration-500 group-hover/img:scale-[1.03] ${fit}`} />
    </button>
  );
}

export default ImageSlot;
