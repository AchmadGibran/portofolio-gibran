import { ArrowUpRight } from "lucide-react";
import { SOCIALS } from "../data/socials";
import { PROFILE } from "../data/profile";
import { Split, Reveal, SceneLabel } from "../components/ui/Anim";
import ContactForm from "../components/ContactForm";

// Adegan penutup: karakter di tengah, terlihat samar menembus kaca form (backdrop-blur); konten ringkas muat satu layar.
export default function Contact() {
  return (
    <section id="contact" data-stage className="relative flex min-h-[100svh] items-center px-5 pb-10 pt-24 sm:px-10">
      <div className="mx-auto w-full max-w-xl">
        {/* Blok teks di atas wajah karakter: diberi "scrim" lembut (warna latar tema, bukan hitam pekat) + bayangan teks
            supaya tetap terbaca di tema gelap maupun terang, tanpa menutupi karakter secara kasar. */}
        <div className="relative isolate">
          <div aria-hidden className="pointer-events-none absolute -inset-x-8 -inset-y-5 -z-10 rounded-[2.5rem] bg-ink/65 blur-2xl" />
          <Reveal><SceneLabel no="07" name="Contact" /></Reveal>
          <Split lines={["Mari bikin", "sesuatu bersama."]} className="font-display text-4xl font-extrabold leading-[.98] tracking-tighter [text-shadow:0_2px_18px_rgb(var(--c-base)/.9)] sm:text-5xl" />
          <Reveal delay={150} className="mt-3 text-sm font-medium text-soft [text-shadow:0_1px_10px_rgb(var(--c-base)/.95),0_0_2px_rgb(var(--c-base)/.8)] sm:text-[15px]">Punya proyek atau tawaran kolaborasi? Pesan Anda langsung masuk ke email saya.</Reveal>
          <Reveal delay={200}>
            <a href={`mailto:${PROFILE.email}`} className="group mt-3 inline-flex items-center gap-2 break-all font-display text-lg font-bold text-accent [text-shadow:0_1px_12px_rgb(var(--c-base)/.95)] sm:text-xl">
              {PROFILE.email}<ArrowUpRight size={18} className="shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>
        {/* data-hold-card: posisi kotak ini dibaca Stage3D supaya tangan karakter "memegang" kedua sisi kartu (hanya desktop) */}
        <div data-hold-card className="mt-4">
          <Reveal delay={250} className="surface rounded-2xl"><ContactForm email={PROFILE.email} /></Reveal>
        </div>
        <ul className="mt-5 flex flex-wrap gap-2">
          {SOCIALS.map(({ icon: Icon, label, href }, i) => (
            <Reveal as="li" key={label} delay={i * 70}>
              <a href={href} target="_blank" rel="noreferrer" className="btn btn-ghost !px-4 !py-2"><Icon size={15} className="text-accent" />{label}</a>
            </Reveal>
          ))}
        </ul>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[.25em] text-faint">© {new Date().getFullYear()} {PROFILE.name} — Fin.</p>
      </div>
    </section>
  );
}
