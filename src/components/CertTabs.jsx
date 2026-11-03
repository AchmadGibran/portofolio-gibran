"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Code2, Trophy } from "lucide-react";
import { CREDENTIALS } from "../data/credentials";
import { DICODING, DICODING_GROUPS, MUSIK, AKADEMIK } from "../data/certificates";
import ImageSlot from "./ui/ImageSlot";

const PRESTASI = [...MUSIK, ...AKADEMIK];
const TABS = [["pendidikan", "Pendidikan", GraduationCap, null], ["it", "Sertifikasi IT", Code2, DICODING.length], ["prestasi", "Prestasi", Trophy, PRESTASI.length]];
const LEVEL = {
  Nasional: "border-amber-400/50 bg-amber-400/10 text-amber-500", Provinsi: "border-accent/40 bg-accent/10 text-accent",
  Kota: "border-emerald-500/40 bg-emerald-500/10 text-emerald-500", Sekolah: "border-sky-500/40 bg-sky-500/10 text-sky-500",
};
const dcList = DICODING.map((c) => ({ src: c.full, alt: c.title }));
const prList = PRESTASI.map((c) => ({ src: c.full, alt: `${c.title} — ${c.event}` }));

function Pendidikan() {
  return (
    <div className="space-y-4">
      {CREDENTIALS.map(({ icon: Icon, title, place, note, period, status, cert }) => (
        <div key={title} className="surface rounded-2xl p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent"><Icon size={19} /></div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg font-bold leading-tight">{title}</h3>
              <p className="text-sm text-soft">{place}</p>
              <p className="mt-0.5 font-mono text-xs text-accent">{note}</p>
            </div>
            {status && (
              <div className="shrink-0 text-right">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-500">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />{status}
                </span>
                <p className="mt-1 font-mono text-[11px] text-muted">{period}</p>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center gap-3 border-t pt-4">
            <ImageSlot kind="cert" src={cert.src} alt={cert.name} hint={cert.name}
              className={cert.orientation === "portrait" ? "h-16 w-12 shrink-0" : "h-14 w-20 shrink-0"} fit="object-cover" />
            <div className="min-w-0"><p className="text-sm font-semibold">{cert.name}</p><p className="text-xs leading-snug text-muted">{cert.detail}</p></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SertifikasiIT() {
  return (
    <div>
      <p className="mb-4 text-sm text-muted">Dicoding Academy · <span className="font-semibold text-fg">{DICODING.length} kelas</span> selesai (Agu – Nov 2026), disusun dari fondasi ke front-end dan back-end.</p>
      {DICODING_GROUPS.map((g) => (
        <div key={g} className="mb-5 last:mb-0">
          <p className="label mb-2">{g}</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {DICODING.map((c, i) => c.group === g && (
              <figure key={c.full}>
                <ImageSlot kind="cert" src={c.thumb} list={dcList} index={i} alt={c.title} hint={c.title} className="aspect-[1.45/1] w-full" />
                <figcaption className="mt-1.5">
                  <p className="line-clamp-2 text-[11px] font-medium leading-snug">{c.title}</p>
                  <p className="font-mono text-[10px] text-faint">{c.date}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Prestasi() {
  const Row = (c, i) => (
    <div key={c.full} className="surface flex items-center gap-3 rounded-2xl p-3">
      <ImageSlot kind="cert" src={c.thumb} list={prList} index={i} alt={c.title} hint={c.title} fit="object-contain" className="h-20 w-24 shrink-0 p-1" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-snug">{c.title}</p>
        <p className="text-xs leading-snug text-muted">{c.event}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${LEVEL[c.level]}`}>{c.level}</span>
          <span className="font-mono text-[11px] text-faint">{c.year}</span>
        </div>
      </div>
    </div>
  );
  return (
    <div>
      <p className="label mb-2">Musik · Gitar (FLS2N)</p>
      <div className="space-y-2.5">{MUSIK.map((c, i) => Row(c, i))}</div>
      <p className="label mb-2 mt-5">Akademik</p>
      <div className="space-y-2.5">{AKADEMIK.map((c, i) => Row(c, MUSIK.length + i))}</div>
    </div>
  );
}

export default function CertTabs() {
  const [tab, setTab] = useState("pendidikan");
  // Highlights dapat membuka tab ini lewat event; tinggi section berubah, jadi Stage diminta mengukur ulang.
  useEffect(() => {
    const h = (e) => setTab(e.detail || "prestasi");
    window.addEventListener("open-credtab", h);
    return () => window.removeEventListener("open-credtab", h);
  }, []);
  useEffect(() => { const t = setTimeout(() => window.dispatchEvent(new Event("resize")), 120); return () => clearTimeout(t); }, [tab]);

  return (
    <div className="mt-7">
      <div role="tablist" aria-label="Kategori kredensial" className="surface mb-5 flex gap-1 rounded-full p-1">
        {TABS.map(([id, name, Icon, n]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
            className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-2 text-xs font-semibold transition sm:text-sm ${tab === id ? "bg-accent text-white shadow-lg shadow-indigo-500/25" : "text-soft hover:text-fg"}`}>
            <Icon size={15} className="shrink-0" /><span className="truncate">{name}</span>
            {n != null && <span className={`rounded-full px-1.5 text-[10px] ${tab === id ? "bg-white/25" : "bg-fg/10"}`}>{n}</span>}
          </button>
        ))}
      </div>
      <div key={tab} className="fadein">
        {tab === "pendidikan" && <Pendidikan />}
        {tab === "it" && <SertifikasiIT />}
        {tab === "prestasi" && <Prestasi />}
      </div>
      <p className="mt-3 text-xs text-faint">Klik gambar sertifikat untuk memperbesar; panah kiri/kanan untuk berpindah.</p>
    </div>
  );
}
