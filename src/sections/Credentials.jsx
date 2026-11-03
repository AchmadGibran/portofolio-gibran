import { Split, Reveal, SceneLabel } from "../components/ui/Anim";
import CertTabs from "../components/CertTabs";

// Karakter di kiri; kartu kredensial ringkas di kanan (tidak memenuhi layar).
export default function Credentials() {
  return (
    <section id="education" data-stage className="relative flex min-h-[100svh] items-center px-5 pb-16 pt-28 sm:px-10 md:justify-end">
      <div className="w-full max-w-xl">
        <Reveal><SceneLabel no="03" name="Credentials" /></Reveal>
        <Split lines={["Pendidikan &", "Sertifikasi."]} className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl" />
        <CertTabs />
      </div>
    </section>
  );
}
