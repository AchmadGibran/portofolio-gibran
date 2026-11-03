// ─────────────────────────────────────────────────────────────────────────────
// 5 proyek portofolio. Field yang kosong ("") otomatis tampil sebagai tombol "(segera)" / kotak placeholder.
// Urutan dalam satu group = urutan tampil. Jumlah proyek coding ganjil (3), jadi proyek TERAKHIR di group
// "code" (OpenJob) otomatis tampil lebih lebar sebagai satu-satunya kartu di barisnya.
//
//  group     : "code" (proyek coding) | "design" (UI/UX)  → kelompok & filter
//  kind      : "web" | "api" | "design"                    → menentukan ilustrasi di kartu
//  category  : label bidang proyek
//  type      : "Group Project" | "Individual Project"      → lencana transparansi tim
//  context   : konteks proyek (Academic / Dicoding / Coursework / Client Solution / Lomba Inovasi)
//  github    : URL repositori (proyek coding). README dibuka langsung dari halaman GitHub-nya
//  figma     : URL Figma *Prototype Mode* (https://www.figma.com/proto/...), akses publik ("Anyone with the link can view")
//  proof     : bukti visual (mis. screenshot Postman) → taruh file di public/projects/
// ─────────────────────────────────────────────────────────────────────────────
export const PROJECTS = [
  {
    title: "SIM-Mahasiswa", group: "code", kind: "web",
    category: "Full-Stack Web App", type: "Group Project", context: "Academic",
    tech: ["PHP Laravel", "React.js", "MySQL"],
    desc: "Sistem informasi manajemen akademik: pengolahan data mahasiswa, manajemen mata kuliah, autentikasi multi-role, dan dashboard analitis.",
    github: "https://github.com/lReisyaa/Sim-Mahasiswa", demo: "",
    proof: [], glow: "from-indigo-500/40 to-blue-500/10",
  },
  {
    title: "Personal Note App v2", group: "code", kind: "web",
    category: "Front-End Web App", type: "Individual Project", context: "Dicoding",
    tech: ["React.js", "JavaScript", "Tailwind CSS"],
    desc: "Aplikasi catatan pribadi interaktif dengan fitur CRUD, pencarian real-time, dan sistem arsip.",
    github: "https://github.com/AchmadGibran/personal-notes-app", demo: "",
    proof: [], glow: "from-sky-500/40 to-indigo-500/10",
  },
  {
    title: "OpenJob RESTful API & Automated Testing", group: "code", kind: "api",
    category: "Backend Development", type: "Individual Project", context: "Coursework",
    tech: ["Node.js", "Express.js", "PostgreSQL", "JWT", "Joi", "Postman"],
    desc: "RESTful API platform lowongan kerja dengan migrasi database (node-pg-migrate), validasi data (Joi), autentikasi JWT, dan pengujian otomatis menggunakan Postman collection.",
    github: "https://github.com/AchmadGibran/openjob-api", demo: "",
    // Bukti pengujian: simpan screenshot Postman (hasil run collection) di public/projects/ dengan nama di bawah.
    proof: [
      { src: "/projects/openjob_hasil.png", alt: "Hasil pengujian otomatis OpenJob API di Postman", hint: "Taruh screenshot Postman di public/projects/openjob-postman.png" },
    ],
    glow: "from-emerald-500/40 to-teal-500/10",
  },
  {
    title: "Hadir.in KHP", group: "design", kind: "design",
    category: "UI/UX & Product Design", type: "Group Project", context: "Client Solution",
    tech: ["Figma", "UI Design", "Prototyping", "SRS"],
    desc: "Perancangan antarmuka dan alur produk sistem presensi dan payroll untuk mitra Kedai Hitam Putih, dari kebutuhan pengguna hingga prototype yang bisa dicoba.",
    figma: "https://www.figma.com/proto/ZfZSi4IHV5sUlXfRg2u3Eu/Hadir.in-KHP?node-id=24-41&p=f&viewport=68%2C94%2C0.05&t=nTxAuEXEEhC7JQyR-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=24%3A41&page-id=0%3A1",
    glow: "from-fuchsia-500/40 to-indigo-500/10",
  },
  {
    title: "Prototype PanganBontang", group: "design", kind: "design",
    category: "UI/UX & Interactive Prototype", type: "Group Project", context: "Lomba Inovasi",
    tech: ["Figma", "Interactive Prototype", "UI Design"],
    desc: "Prototype interaktif PanganBontang, karya tim untuk lomba inovasi, dirancang di Figma.",
    figma: "https://www.figma.com/proto/xGOzz5ZkFh1gI4CfPineJE/ColorCoded?node-id=187-869&p=f&viewport=557%2C372%2C0.07&t=4Jn5e3MWtlNijThy-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=187%3A866&page-id=0%3A1",
    glow: "from-amber-500/40 to-rose-500/10",
  },
];
