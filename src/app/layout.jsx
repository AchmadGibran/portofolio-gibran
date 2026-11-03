import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import { LightboxProvider } from "../components/ui/Lightbox";
import Loader from "../components/Loader";
import Stage from "../components/Stage";
import Cursor from "../components/Cursor";
import { PROFILE } from "../data/profile";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const body = Figtree({ subsets: ["latin"], variable: "--font-body" });

export const metadata = {
  title: `${PROFILE.name} | Portofolio`,
  description: `${PROFILE.name}, ${PROFILE.headline}.`,
};
export const viewport = { themeColor: "#06070c", width: "device-width", initialScale: 1 };

// Dijalankan sebelum halaman tampil agar tidak berkedip: bawaan GELAP, kecuali pengunjung pernah memilih terang.
const THEME_SCRIPT = `try{if(localStorage.getItem("theme")==="light")document.documentElement.classList.add("light")}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} /></head>
      <body className="min-h-screen bg-transparent text-fg antialiased">
        <div className="cine-bg" aria-hidden />
        <Loader />
        <Stage />
        <Cursor />
        <div className="grain" aria-hidden />
        <LightboxProvider>{children}</LightboxProvider>
      </body>
    </html>
  );
}
