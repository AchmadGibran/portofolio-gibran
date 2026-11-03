// Tambah sertifikat baru = tambah satu baris di sini + taruh gambarnya di public/sertifikat/ (versi penuh .webp dan thumbnail "-t.webp").
// verify (opsional): tautan verifikasi resmi; bila diisi, muncul ikon tautan di kartu.
const D = "/sertifikat/dicoding/";
const dc = (n, title, date, group) => ({ title, date, group, thumb: `${D}d${n}-t.webp`, full: `${D}d${n}.webp`, verify: "" });

export const DICODING = [
  dc("01", "Memulai Dasar Pemrograman untuk Menjadi Pengembang Software", "22 Agu 2026", "Fondasi"),
  dc("02", "Belajar Dasar Git dengan GitHub", "23 Agu 2026", "Fondasi"),
  dc("03", "Pengenalan ke Logika Pemrograman (Programming Logic 101)", "23 Agu 2026", "Fondasi"),
  dc("04", "Belajar Dasar AI", "26 Agu 2026", "Fondasi"),
  dc("05", "Belajar Dasar Pemrograman Web", "2 Sep 2026", "Front-End"),
  dc("06", "Belajar Dasar Pemrograman JavaScript", "14 Sep 2026", "Front-End"),
  dc("07", "Belajar Membuat Front-End Web untuk Pemula", "17 Sep 2026", "Front-End"),
  dc("08", "Belajar Membuat Aplikasi Web dengan React", "25 Sep 2026", "Front-End"),
  dc("09", "Belajar Fundamental Aplikasi Web dengan React", "10 Okt 2026", "Front-End"),
  dc("10", "Belajar Back-End Pemula dengan JavaScript", "17 Okt 2026", "Back-End"),
  dc("11", "Belajar Fundamental Back-End dengan JavaScript", "1 Nov 2026", "Back-End"),
];
export const DICODING_GROUPS = ["Fondasi", "Front-End", "Back-End"];

const M = "/sertifikat/musik/";
const mu = (id, title, event, year, level) => ({ title, event, year, level, thumb: `${M}${id}-t.webp`, full: `${M}${id}.webp` });
export const MUSIK = [
  mu("ga-kota-2019", "Juara I Gitar Duet", "FLS2N SMP se-Kota Bontang", "2019", "Kota"),
  mu("ga-prov-2019", "Juara 1 Gitar Duet", "FLS2N SMP/MTs Provinsi Kalimantan Timur", "2019", "Provinsi"),
  mu("ga-apresiasi-2019", "Piagam Apresiasi Pemkot Bontang", "Juara I Gitar Duet FLS2N-SMP Provinsi Kaltim", "2019", "Provinsi"),
  mu("ga-nasional-2019", "Juara Harapan III Gitar Duet", "FLS2N SMP Tingkat Nasional (Tangerang)", "2019", "Nasional"),
  mu("ga-solo-prov-2022", "Pemenang I Gitar Solo", "FLS2N SMK Provinsi Kalimantan Timur", "2022", "Provinsi"),
  mu("fls2n-smk-nasional-2022", "Peringkat 6 Gitar Solo", "FLS2N SMK Tingkat Nasional", "2022", "Nasional"),
];

const A = "/sertifikat/akademik/";
export const AKADEMIK = [
  { title: "Siswa Berprestasi Bidang Akademik, Peringkat Dua", event: "Jurusan XII RPL · SMK Negeri 1 Bontang", year: "2024", level: "Sekolah", thumb: `${A}siswa-berprestasi-2024-t.webp`, full: `${A}siswa-berprestasi-2024.webp` },
  { title: "Juara 2 Lomba Ranking Satu", event: "Pekan Pengawasan Partisipatif · Bawaslu Kota Bontang", year: "2025", level: "Kota", thumb: `${A}juara-2-ranking-satu-2025-t.webp`, full: `${A}juara-2-ranking-satu-2025.webp` },
];
