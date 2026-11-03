import { Megaphone, Guitar, FolderArchive } from "lucide-react";
import { HIGHLIGHT_CERTS as C } from "../data/highlights";
import { Split, Reveal, SceneLabel } from "../components/ui/Anim";
import ImageSlot from "../components/ui/ImageSlot";
import TabLink from "../components/TabLink";
import { MUSIK } from "../data/certificates";

// Semua bingkai sertifikat berukuran sama (tinggi tetap); gambar dimuat utuh (object-contain) agar tidak terpotong.
const Cert = ({ c, caption }) => (
  <figure>
    <ImageSlot kind="cert" src={c.src} alt={c.alt} hint={c.hint} fit="object-contain" className="h-60 w-full p-2 sm:h-64" />
    <figcaption className="mt-2 text-center text-xs text-faint">{caption}</figcaption>
  </figure>
);
const Item = ({ label, children }) => (<div><p className="font-semibold text-fg">{label}</p><p className="mt-1">{children}</p></div>);

const CARDS = [
  { icon: Megaphone, title: "Social Commerce & Digital Marketing",
    body: (<><Item label="Sertifikasi">Kompetensi BNSP (BLKI / Ditekindo), Social Media Marketing.</Item><Item label="TikTok Live Selling Numismatics">Mengelola live selling item uang kuno dan menyelesaikan 90+ transaksi langsung.</Item></>),
    foot: <Cert c={C.smm} caption="Sertifikasi BNSP · Social Media Marketing" /> },
  { icon: Guitar, title: "Audio Production & Musical Achievements",
    body: (<><Item label="Rekam Jejak Prestasi Musik Nasional">Peringkat 6 Nasional FLS2N Gitar Solo SMK 2022 & Juara Harapan 3 Nasional Duet Gitar FLS2N SMP.</Item>
      <TabLink tab="prestasi" className="text-xs font-semibold text-accent hover:underline">Lihat semua {MUSIK.length} penghargaan musik →</TabLink></>),
    foot: <Cert c={C.fls2nSmk} caption={C.fls2nSmk.caption} /> },
  { icon: FolderArchive, title: "Government Data & Records Operations",
    body: <Item label="Third-Party Records Management & Data Entry Specialist (2025–2026)">Mengelola digitalisasi dokumen, pengindeksan database, kategorisasi berkas, dan data entry di beberapa instansi pemerintahan.</Item>,
    foot: <Cert c={C.arsip} caption="Pengalaman kerja pengarsipan & data entry" /> },
];

export default function Highlights() {
  return (
    <section id="highlights" data-stage className="relative flex min-h-[100svh] flex-col justify-center px-5 pb-16 pt-28 sm:px-10">
      <Reveal><SceneLabel no="06" name="Highlights" /></Reveal>
      <Split lines={["Di luar", "bidang utama."]} className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl" />
      <p className="mt-3 max-w-xl text-sm text-muted">Pengalaman yang melengkapi proses belajar saya. Klik gambar sertifikat untuk memperbesar.</p>
      <div className="mt-8 grid items-stretch gap-4 lg:grid-cols-3 lg:gap-5">
        {CARDS.map(({ icon: Icon, title, body, foot }, i) => (
          <Reveal key={title} delay={i * 120} className="surface flex flex-col justify-between gap-5 rounded-3xl p-5 sm:p-6">
            <div>
              <Icon size={22} className="text-cy" />
              <h3 className="font-display mt-3 text-lg font-bold leading-snug">{title}</h3>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">{body}</div>
            </div>
            {foot}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
