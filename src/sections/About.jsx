import { Code2, PenTool, Bot } from "lucide-react";
import { PROJECTS } from "../data/projects";
import { Split, Reveal, Counter, SceneLabel } from "../components/ui/Anim";

const STATS = [
  { to: 3.9, d: 2, label: "IPK / 4.00" },
  { to: 2, d: 0, label: "Sertifikat BNSP" },
  { to: 1, d: 0, label: "Dicoding Asah" },
  { to: PROJECTS.length, d: 0, label: "Proyek" },
];
const SKILLS = [
  { icon: Code2, title: "Web Development", text: "React, Laravel, Node.js/Express, MySQL, dan PostgreSQL." },
  { icon: PenTool, title: "UI/UX Design", text: "Figma: dari alur pengguna hingga prototype interaktif." },
  { icon: Bot, title: "AI-Assisted Workflow", text: "Prompting terstruktur dengan Claude, ChatGPT, dan Gemini untuk prototyping, debugging, dan eksplorasi solusi." },
];

// Adegan medium close-up: karakter di kanan (utuh, tidak terpotong), konten di kiri.
export default function About() {
  return (
    <section id="about" data-stage className="relative flex min-h-[115svh] items-center px-5 py-24 sm:px-10">
      <div className="max-w-xl">
        <Reveal><SceneLabel no="02" name="About" /></Reveal>
        <Split lines={["Web yang rapi,", "dipercepat AI."]} className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl" />
        <Reveal delay={200} className="mt-5 leading-relaxed text-soft sm:text-lg">
          <p>Mahasiswa Teknik Informatika (IPK 3.90) berlatar SMK Rekayasa Perangkat Lunak. Saya membangun aplikasi web end-to-end dan merancang antarmukanya di Figma, serta memanfaatkan AI secara terarah untuk mempercepat pengembangan.</p>
        </Reveal>
        <ul className="mt-7 space-y-3">
          {SKILLS.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={i * 90} className="flex gap-3 border-l-2 border-accent/60 pl-4">
              <Icon size={18} className="mt-0.5 shrink-0 text-accent" />
              <div><p className="text-sm font-semibold text-fg">{title}</p><p className="text-sm leading-relaxed text-muted">{text}</p></div>
            </Reveal>
          ))}
        </ul>
        <div className="mt-8 grid grid-cols-4 gap-2">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="surface rounded-xl px-3 py-3">
              <p className="font-display text-2xl font-extrabold sm:text-3xl"><Counter to={s.to} decimals={s.d} /></p>
              <p className="mt-0.5 text-[11px] leading-tight text-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
