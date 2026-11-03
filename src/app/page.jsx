import Nav from "../components/Nav";
import Hero from "../sections/Hero";
import About from "../sections/About";
import Credentials from "../sections/Credentials";
import Stack from "../sections/Stack";
import Projects from "../sections/Projects";
import Highlights from "../sections/Highlights";
import Contact from "../sections/Contact";

// Urutan section = urutan keyframe kamera di components/three/Stage3D.jsx (atribut data-stage).
export default function Page() {
  return (
    <>
      <Nav />
      <main className="relative z-10">
        <Hero /><About /><Credentials /><Stack /><Projects /><Highlights /><Contact />
      </main>
    </>
  );
}
