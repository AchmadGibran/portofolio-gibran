"use client";

// Tombol yang membuka tab tertentu di section Credentials lalu menggulir ke sana.
export default function TabLink({ tab, children, className }) {
  const go = () => {
    window.dispatchEvent(new CustomEvent("open-credtab", { detail: tab }));
    setTimeout(() => document.getElementById("education")?.scrollIntoView({ behavior: "smooth" }), 60);
  };
  return <button type="button" onClick={go} className={className}>{children}</button>;
}
