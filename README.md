# Portofolio — Versi Alternatif (Gelap Sinematik)

Salinan terpisah dari Porto-1. Data (`src/data/*`) dan aset (`public/*`) sama persis, jadi ubah di sana.

## Jalankan
```
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```
Form kontak: salin `.env.example` ke `.env.local` dan isi `NEXT_PUBLIC_WEB3FORMS_KEY` (opsional, tanpa itu memakai mailto).

## Struktur
- `components/Loader.jsx` — loading dengan progres nyata (unduhan model 3D) + layar bioskop terbuka
- `components/three/Stage3D.jsx` — karakter 3D tetap (fixed). **Keyframe kamera per adegan ada di array `KF`** (posisi, geser, opasitas)
- `components/Stage.jsx` — menghitung scroll → adegan, HUD REC/timecode, bar progres
- `sections/*` — 7 adegan; urutannya harus sama dengan jumlah `KF` (atribut `data-stage`)
- Tanpa library animasi tambahan (tanpa GSAP): hanya CSS + IntersectionObserver, dependensi sama dengan Porto-1

## Tema
Toggle gelap/terang di navbar (animasi lingkaran 'lampu', pilihan tersimpan). Warna lewat CSS variable di `globals.css` (`:root` = gelap, `.light` = terang). Catatan: nama warna Tailwind `ink` (bukan `base`) agar tidak bentrok dengan `text-base`.

## Ringan
Render 3D berhenti total saat karakter tak terlihat (frameloop demand), DPR dibatasi, antialias & blur dimatikan di mobile, kursor khusus hanya di perangkat mouse, `prefers-reduced-motion` dihormati.
