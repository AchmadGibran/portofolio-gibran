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
        <Reveal><SceneLabel no="07" name="Contact" /></Reveal>
        <Split lines={["Mari bikin", "sesuatu bersama."]} className="font-display text-4xl font-extrabold leading-[.98] tracking-tighter sm:text-5xl" />
        <Reveal delay={150} className="mt-3 text-sm text-muted">Punya proyek atau tawaran kolaborasi? Pesan Anda langsung masuk ke email saya.</Reveal>
        <Reveal delay={200}>
          <a href={`mailto:${PROFILE.email}`} className="group mt-3 inline-flex items-center gap-2 break-all font-display text-lg font-bold text-accent sm:text-xl">
            {PROFILE.email}<ArrowUpRight size={18} className="shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>
        </Reveal>
        <Reveal delay={250} className="surface mt-4 rounded-2xl"><ContactForm email={PROFILE.email} /></Reveal>
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
