"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

// Pesan dikirim lewat Web3Forms langsung ke email pemilik (access key publik by design, diatur di .env.local / Vercel).
const KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
const field = "w-full rounded-xl border bg-transparent px-4 py-3 text-sm text-fg outline-none transition placeholder:text-faint focus:border-accent focus:ring-2 focus:ring-accent/30";

export default function ContactForm({ email }) {
  const [status, setStatus] = useState("idle"); // idle | sending | ok | error

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    if (d.get("botcheck")) return; // jebakan bot

    const name = String(d.get("name")).trim(), from = String(d.get("email")).trim(), message = String(d.get("message")).trim();

    if (!KEY) { // cadangan bila key belum diisi: buka aplikasi email
      window.location.href = `mailto:${email}?subject=${encodeURIComponent("Pesan dari " + name)}&body=${encodeURIComponent(message + "\n\n— " + name + " (" + from + ")")}`;
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ access_key: KEY, subject: `Pesan portofolio dari ${name}`, from_name: "Portofolio", name, email: from, message, botcheck: "" }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 p-5">
      <h3 className="text-lg font-bold text-fg">Tulis Pesan</h3>
      <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-soft" htmlFor="contact-name">Nama
          <input id="contact-name" name="name" required maxLength={80} autoComplete="name" placeholder="Nama Anda" style={{ borderColor: "var(--surface-line)" }} className={`${field} mt-1.5`} />
        </label>
        <label className="block text-sm font-medium text-soft" htmlFor="contact-email">Email
          <input id="contact-email" name="email" type="email" required maxLength={120} autoComplete="email" placeholder="nama@email.com" style={{ borderColor: "var(--surface-line)" }} className={`${field} mt-1.5`} />
        </label>
      </div>
      <label className="block text-sm font-medium text-soft" htmlFor="contact-message">Pesan
        <textarea id="contact-message" name="message" required minLength={10} maxLength={2000} rows={3} placeholder="Ceritakan proyek atau pertanyaan Anda…" style={{ borderColor: "var(--surface-line)" }} className={`${field} mt-1.5 resize-y`} />
      </label>
      <button type="submit" disabled={status === "sending"}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-ink shadow-lg shadow-violet-500/25 transition hover:brightness-110 disabled:opacity-60">
        {status === "sending" ? <><Loader2 size={16} className="animate-spin" /> Mengirim…</> : <><Send size={16} /> Kirim Pesan</>}
      </button>
      <div aria-live="polite" className="text-sm empty:hidden">
        {status === "ok" && <p className="flex items-center gap-2 text-emerald-500"><CheckCircle2 size={16} /> Terkirim! Terima kasih, saya akan segera membalas.</p>}
        {status === "error" && <p className="flex items-center gap-2 text-rose-500"><AlertCircle size={16} /> Gagal mengirim. Coba lagi, atau email langsung ke {email}.</p>}
      </div>
    </form>
  );
}
