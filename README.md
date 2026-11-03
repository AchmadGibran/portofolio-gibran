```markdown
# 🎬 Achmad Gibran — Personal Interactive Portfolio

Situs web portofolio pribadi interaktif berbasis **Next.js** dan **Three.js** dengan tema sinematik gelap (*Cinematic Dark*). Menampilkan pengalaman pengguna dengan elemen 3D interaktif, efek kamera berbasis scroll, dan integrasi formulir kontak online.

---

## 👨‍💻 Tentang Saya

* **Nama:** Achmad Gibran
* **Peran:** Web Developer & IT Student
* **Latar Belakang:** Mahasiswa Teknik Informatika (IPK 3.90) & Alumni SMK Rekayasa Perangkat Lunak
* **Sertifikasi:** BNSP & Dicoding Asah
* **Fokus Proyek:** OpenJob RESTful API, Hadir.in KHP, SIM Akademik, dan Aplikasi Web End-to-End

---

## 🚀 Fitur Utama

- **Interactive 3D Stage:** Pengalaman interaktif menggunakan Three.js/React Three Fiber dengan karakter 3D & objek dinamis (gitar, laptop, papan klip).
- **Cinematic HUD & Scroll Camera:** Transisi *keyframe* kamera per adegan (`KF`) disesuaikan secara dinamis saat pengguna melakukan scroll, lengkap dengan indikator timecode & HUD layar bioskop (`REC SCENE`).
- **Web3Forms Contact Form:** Formulir kontak aktif terintegrasi langsung dengan Web3Forms (dengan *fallback* `mailto:` jika environment variable belum diisi).
- **Tema Dinamis:** Mode Gelap (default) / Terang yang tersimpan otomatis di *local storage*.
- **Optimasi Performa Tinggi:** 
  - *Frameloop demand* (animasi 3D berhenti otomatis jika objek di luar viewport).
  - Pembatasan DPR & penyesuaian antialias untuk perangkat seluler.
  - Menghormati pengaturan `prefers-reduced-motion`.

---

## 🛠️ Teknologi & Tools

* **Framework:** Next.js, React
* **3D & Graphics:** Three.js / React Three Fiber / @react-three/drei
* **Styling:** Tailwind CSS (Custom color variables & utility classes)
* **Form Services:** Web3Forms API
* **Deployment:** Vercel

---

## 💻 Cara Menjalankan secara Lokal

1. **Clone Repositori & Install Dependensi:**
   ```bash
   git clone [https://github.com/AchmadGibran/portfolio-gibran.git](https://github.com/AchmadGibran/portfolio-gibran.git)
   cd portfolio-gibran
   npm install

```

2. **Konfigurasi Environment Variable (Opsional):**
Salin file `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local

```


Isi *Access Key* Web3Forms di dalam `.env.local`:
```env
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_access_key_here

```


3. **Jalankan Mode Pengembangan:**
```bash
npm run dev

```


Buka [http://localhost:3000](http://localhost:3000) di browser.
4. **Build untuk Produksi:**
```bash
npm run build
npm start

```



---

## 📁 Struktur Folder Utama

```text
├── components/
│   ├── Loader.jsx          # Progres pemuatan model 3D & animasi layar pembuka
│   ├── Stage.jsx           # Kalkulasi scroll adegan, HUD REC, & progress bar
│   └── three/
│       └── Stage3D.jsx     # Karakter 3D & susunan Keyframe (KF) posisi kamera
├── sections/               # 7 bagian adegan (Intro, About, Credentials, dll)
├── src/data/               # Data proyek, pengalaman, & sertifikasi
└── public/                 # Model 3D (.gltf/.glb) dan aset statis

```

---

Dibuat oleh **Achmad Gibran** — 2026

```

```
