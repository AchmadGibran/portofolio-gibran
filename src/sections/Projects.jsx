"use client";
import { useState } from "react";
import { Github, ExternalLink, Figma, Users, User, ChevronLeft, ChevronRight } from "lucide-react";
import { PROJECTS } from "../data/projects";
import { Split, Reveal, SceneLabel } from "../components/ui/Anim";
import ImageSlot from "../components/ui/ImageSlot";

// Gambar sampul: proyek dengan bukti (OpenJob) memakai gambar hasil pengujian; lainnya memakai cover.
const COVER = {
  "SIM-Mahasiswa": "sim-mahasiswa", "Personal Note App v2": "personal-notes",
  "Hadir.in KHP": "hadirin-khp", "Prototype PanganBontang": "panganbontang",
};
const imageOf = (p) => p.image || p.proof?.[0]?.src || `/projects/${COVER[p.title]}.png`;
const Link = ({ href, icon: I, children }) => href ? (
  <a href={href} target="_blank" rel="noreferrer" className="btn btn-ghost !px-4 !py-2"><I size={15} />{children}</a>
) : null;
const pad = (n) => String(n + 1).padStart(2, "0");

// Satu kartu detail dengan ukuran tetap + daftar pemilih proyek. Tidak ada tumpukan scroll: pindah proyek lewat daftar/panah.
export default function Projects() {
  const [i, setI] = useState(0);
  const p = PROJECTS[i], n = PROJECTS.length;
  const go = (k) => setI((k + n) % n);

  return (
    <section id="projects" data-stage className="relative flex min-h-[100svh] flex-col justify-center px-5 pb-16 pt-28 sm:px-10">
      <Reveal><SceneLabel no="05" name="Projects" /></Reveal>
      <Split lines={["Karya pilihan."]} className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl" />

      <div className="mt-8 grid gap-4 lg:grid-cols-[260px_1fr] lg:gap-6">
        {/* pemilih proyek: chip horizontal di mobile, daftar vertikal di desktop */}
        <div role="tablist" aria-label="Daftar proyek" className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
          {PROJECTS.map((q, k) => (
            <button key={q.title} role="tab" aria-selected={k === i} onClick={() => setI(k)} title={q.title}
              className={`flex shrink-0 snap-start items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors lg:w-full ${k === i ? "border-accent/60 bg-accent/10 text-fg" : "text-muted hover:bg-fg/5 hover:text-fg"}`}>
              <span className={`font-mono text-xs ${k === i ? "text-accent" : "text-faint"}`}>{pad(k)}</span>
              <span className="max-w-[10rem] truncate text-sm font-semibold lg:max-w-none lg:whitespace-normal lg:leading-snug">{q.title}</span>
            </button>
          ))}
        </div>

        <article key={i} className="pop surface grid gap-5 rounded-3xl p-4 sm:p-6 lg:min-h-[400px] lg:grid-cols-[1.15fr_1fr] lg:gap-8">
          <ImageSlot kind="image" src={imageOf(p)} alt={`Tampilan ${p.title}`} hint={p.title} fit="object-contain" className="aspect-[16/10] w-full self-start" />
          <div className="flex flex-col justify-between gap-5">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="label">{p.category}</p>
                <span className="chip inline-flex items-center gap-1.5">{p.type === "Group Project" ? <Users size={12} /> : <User size={12} />}{p.type} · {p.context}</span>
              </div>
              <h3 className="font-display mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-soft sm:text-base">{p.desc}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">{p.tech?.map((t) => <span key={t} className="chip">{t}</span>)}</div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <Link href={p.github} icon={Github}>GitHub</Link>
                <Link href={p.demo} icon={ExternalLink}>Demo</Link>
                <Link href={p.figma} icon={Figma}>Prototype</Link>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-muted">
                <button type="button" aria-label="Proyek sebelumnya" onClick={() => go(i - 1)} className="grid h-9 w-9 place-items-center rounded-full border hover:bg-fg/10"><ChevronLeft size={16} /></button>
                <span className="tabular-nums">{pad(i)} / {pad(n - 1)}</span>
                <button type="button" aria-label="Proyek berikutnya" onClick={() => go(i + 1)} className="grid h-9 w-9 place-items-center rounded-full border hover:bg-fg/10"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        </article>
      </div>
      <p className="mt-3 text-xs text-faint">Klik gambar untuk memperbesar.</p>
    </section>
  );
}
