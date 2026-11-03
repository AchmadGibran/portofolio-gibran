import { GraduationCap, School } from "lucide-react";

// orientation: rasio sertifikat ("portrait" = vertikal, "landscape" = horizontal)
export const CREDENTIALS = [
  {
    icon: GraduationCap, title: "S1 Teknik Informatika", place: "STITEK Bontang", note: "IPK 3.90 / 4.00", period: "2024 – Sekarang", status: "Sedang berjalan",
    cert: {
      name: "Sertifikat Dicoding Indonesia",
      detail: "Program Dicoding Asah, Web Development & Front-End Learning Path",
      src: "/sertifikat/dicoding-asah.webp", orientation: "landscape",
    },
  },
  {
    icon: School, title: "Rekayasa Perangkat Lunak (RPL)", place: "SMK Negeri 1 Bontang", note: "Pendidikan menengah",
    cert: {
      name: "Sertifikasi BNSP",
      detail: "Software Engineering",
      src: "/sertifikat/bnsp-smk.webp", orientation: "portrait",
    },
  },
];
