"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";
import { stage } from "../../lib/stage";

// Model dibuat di MetaPerson Creator lalu dikecilkan (public/models/gibran.glb).
// Ganti file itu untuk memperbarui karakter; nama tulang (Head, Neck, Spine2) dan morph (eyeBlink*) dipakai di bawah.
const MODEL = "/models/gibran.glb";
const ACCENT = "#8b5cf6";

// Posisi kursor ternormalisasi (-1..1), dibagikan lewat objek biasa agar tidak memicu re-render.
// Keyframe tiap adegan (urutan = urutan section [data-stage]).
// c: posisi kamera, l: titik pandang, x: geser karakter ke samping, o: opasitas (desktop), mo: opasitas (mobile),
// orbit: skala benda-benda yang mengorbit, my: geser vertikal di mobile agar tidak menimpa teks.
const KF = [
  { c: [0, 1.38, 3.1], l: [0, 1.3, 0], x: 0.62, o: 1, mo: 0.95, orbit: 1, my: 0.3 },     // 01 hero
  { c: [0.15, 1.65, 0.95], l: [0, 1.62, 0], x: 0.34, m: 0.05, o: 1, mo: 0.4, orbit: 0, my: 0 }, // 02 about: close-up wajah (m = margin batas pinggir layar, kecil = boleh sedikit terpotong)
  { c: [0, 1.36, 2.7], l: [0, 1.3, 0], x: -0.62, o: 0.95, mo: 0.35, orbit: 1, my: 0 },   // 03 credentials
  { c: [0, 1.25, 4.6], l: [0, 1.25, 0], x: 0, o: 0.3, mo: 0.18, orbit: 1.5, my: 0 },     // 04 stack: wide + benda orbit
  { c: [0, 1.3, 3.4], l: [0, 1.3, 0], x: 0.9, o: 0, mo: 0, orbit: 1, my: 0 },            // 05 projects: karakter menyingkir
  { c: [0, 1.3, 3.6], l: [0, 1.3, 0], x: -0.9, o: 0, mo: 0, orbit: 1, my: 0 },           // 06 highlights
  { c: [-0.1, 1.55, 1.55], l: [0, 1.52, 0], x: 0, o: 0.85, mo: 0.28, orbit: 0.6, my: 0 }, // 07 contact: karakter di tengah, terlihat tembus kaca form
];
const ease = (t) => t * t * (3 - 2 * t);

const pointer = { x: 0, y: 0, last: 0 };
const _q = new THREE.Quaternion(), _pq = new THREE.Quaternion(), _d = new THREE.Quaternion(), _e = new THREE.Euler();

// Putar tulang di ruang dunia (yaw/pitch) tanpa bergantung pada orientasi sumbu lokal rig.
function aim(bone, base, yaw, pitch) {
  bone.parent.getWorldQuaternion(_pq);
  _d.setFromEuler(_e.set(pitch, yaw, 0, "YXZ"));
  _q.copy(_pq).invert().multiply(_d).multiply(_pq).multiply(base);
  bone.quaternion.copy(_q);
}

const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _dir = new THREE.Vector3(), _tgt = new THREE.Vector3();

// Model diekspor dalam pose T (tangan membentang). Tiap ruas tulang diarahkan di ruang dunia (tidak bergantung
// pada orientasi sumbu lokal rig). Arah = [x relatif sisi (+ keluar badan), y, z (+ ke depan)].
// Coba pose lain lewat URL: http://localhost:3000/?pose=front atau ?pose=crossed — lalu tetapkan pilihan di POSE_DEFAULT.
const POSE_DEFAULT = "relaxed";
const POSES = {
  // santai: lengan sedikit menjauh dari badan, siku menekuk lembut, jari melengkung halus
  // sisi kanan sengaja sedikit berbeda dari kiri (armR/foreR) agar tidak terlihat simetris seperti patung
  relaxed: { shoulder: 0.2, arm: [0.17, -1, 0.02], armR: [0.24, -1, -0.03], fore: [0.08, -1, 0.3], foreR: [0.14, -1, 0.45],
    hand: [-0.08, -1, 0.2], palm: [-1, 0, 0.3], curl: [0.25, 0.45, 0.6] },
  // tangan menyilang di dada: lengan kiri di depan, kanan sedikit di belakangnya (bisa tembus jas, setel sudut bila perlu)
  crossed: { shoulder: 0.1, arm: [0.08, -1, 0.5], armR: [0.1, -1, 0.42], fore: [-0.95, 0.3, 0.45], foreR: [-0.95, 0.28, 0.15],
    hand: [-0.9, 0.05, 0.3], handR: [-0.9, 0.05, 0.1], palm: [0, 0.2, -1], curl: [0.2, 0.35, 0.45] },
  // elegan/formal: kedua tangan bertemu longgar di depan pinggang
  front: { shoulder: 0.15, arm: [0.14, -1, 0.12], fore: [-0.5, -0.4, 0.75], hand: [-0.5, -0.3, 0.7], palm: [-0.4, 0.8, 0], curl: [0.15, 0.25, 0.3] },
};

function aimBone(bone, child, target) {
  bone.getWorldPosition(_a); child.getWorldPosition(_b);
  _dir.subVectors(_b, _a).normalize();
  _d.setFromUnitVectors(_dir, target);
  bone.parent.getWorldQuaternion(_pq);
  bone.quaternion.premultiply(_q.copy(_pq).invert().multiply(_d).multiply(_pq)).normalize();
  bone.updateMatrixWorld(true);
}
const vec = (v, sx) => new THREE.Vector3(v[0] * sx, v[1], v[2]).normalize();

function relaxArms(scene, name) {
  const P = POSES[name] || POSES[POSE_DEFAULT];
  scene.updateMatrixWorld(true);
  for (const side of ["Left", "Right"]) {
    const get = (n) => scene.getObjectByName(side + n);
    const arm = get("Arm"), fore = get("ForeArm"), hand = get("Hand"), mid = get("HandMiddle1"), clav = get("Shoulder");
    if (!arm || !fore || !hand) continue;
    arm.getWorldPosition(_a); fore.getWorldPosition(_b);
    const sx = Math.sign(_b.x - _a.x) || 1; // +1 bila lengan berada di sisi +x
    const R = side === "Right";
    if (clav && P.shoulder) aimBone(clav, arm, new THREE.Vector3(sx, -P.shoulder, -0.05).normalize()); // bahu turun rileks
    aimBone(arm, fore, vec(R && P.armR ? P.armR : P.arm, sx));
    aimBone(fore, hand, vec(R && P.foreR ? P.foreR : P.fore, sx));
    const H = R && P.handR ? P.handR : P.hand;
    if (mid) aimBone(hand, mid, vec(H, sx));
    // jari: tiap ruas melengkung bertahap ke arah telapak
    const along = vec(H, sx), palm = vec(P.palm, sx);
    // jari telunjuk paling lurus, kelingking paling melengkung; jempol menggantung sejajar telapak
    const FINGERS = { Index: 0.7, Middle: 1, Ring: 1.1, Pinky: 1.25 };
    for (const f in FINGERS) {
      for (let k = 1; k <= 3; k++) {
        const bone = get("Hand" + f + k), child = get("Hand" + f + (k + 1));
        if (!bone || !child) continue;
        const a = P.curl[k - 1] * FINGERS[f];
        aimBone(bone, child, along.clone().multiplyScalar(Math.cos(a)).addScaledVector(palm, Math.sin(a)).normalize());
      }
    }
    for (let k = 1; k <= 3; k++) {
      const bone = get("HandThumb" + k), child = get("HandThumb" + (k + 1));
      if (!bone || !child) continue;
      aimBone(bone, child, along.clone().multiplyScalar(0.85).addScaledVector(palm, 0.3 + 0.1 * k).add(new THREE.Vector3(0, 0, 0.15)).normalize());
    }
  }
}


// Benda-benda kecil dari bentuk dasar (ringan, tanpa aset tambahan). Hapus <Floaty> di bawah bila ada yang tak diinginkan.
function Floaty({ children, position, speed, phase }) {
  const g = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    g.current.rotation.y = t * speed + phase;
    g.current.position.y = position[1] + Math.sin(t * 1.2 + phase) * 0.025;
  });
  return <group ref={g} position={position}>{children}</group>;
}
const mat = (color, extra = {}) => <meshStandardMaterial color={color} roughness={0.55} {...extra} />;

// Gitar Explorer: siluet DITELUSURI dari render gitar asli (public/models/guitar.jpg), bukan ditebak.
// Gambar ditempel di sisi depan pelat tipis; punggung, leher, dan sisi dibuat putih polos.
const poly = (pts) => { const sh = new THREE.Shape(); pts.forEach(([x, y], i) => (i ? sh.lineTo(x, y) : sh.moveTo(x, y))); sh.closePath(); return sh; };
const G_W = 0.2346, G_H = 0.56;
const G_SHAPE = poly([[-0.1151,-0.2794],[-0.1179,-0.2789],[-0.1179,-0.2745],[-0.1134,-0.2656],[-0.1123,-0.2579],[-0.109,-0.2534],[-0.1079,-0.2457],[-0.078,-0.1826],[-0.0548,-0.145],[-0.0238,-0.1018],[-0.0194,-0.0896],[-0.0227,-0.0742],[-0.0271,-0.0642],[-0.026,-0.0631],[-0.0293,-0.0575],[-0.0426,-0.0166],[-0.0288,-0.0138],[-0.0166,-0.0072],[-0.0155,-0.0083],[0.0006,0.0055],[0.0061,0.0133],[0.0061,0.0642],[0.0116,0.2158],[0.0006,0.2247],[0.0006,0.2313],[-0.0017,0.2357],[0.0,0.2374],[0.0033,0.2363],[0.0072,0.2424],[0.0072,0.2446],[0.0022,0.2462],[0.0017,0.249],[0.0077,0.2496],[0.0105,0.2523],[0.0105,0.2579],[0.0055,0.2606],[0.005,0.2634],[0.0077,0.2662],[0.01,0.264],[0.0116,0.2656],[0.0122,0.2806],[0.0299,0.2662],[0.0393,0.27],[0.0382,0.259],[0.047,0.2568],[0.0454,0.2529],[0.0393,0.2501],[0.0393,0.2457],[0.0481,0.2435],[0.0476,0.2407],[0.0432,0.2418],[0.0415,0.2402],[0.047,0.2236],[0.0376,0.2186],[0.0338,0.2125],[0.0326,0.0498],[0.0349,0.0044],[0.0393,-0.0033],[0.0498,-0.0116],[0.062,-0.0105],[0.0836,0.0111],[0.1018,0.0338],[0.1129,0.0371],[0.1168,0.0365],[0.0968,-0.0077],[0.0902,-0.0288],[0.078,-0.0564],[0.0703,-0.0819],[0.0736,-0.093],[0.0924,-0.1317],[0.0946,-0.1406],[0.1035,-0.1572],[0.1134,-0.1837],[0.0919,-0.1832],[0.0819,-0.1854],[0.0764,-0.1843],[0.0675,-0.1865],[0.0542,-0.1865],[0.0432,-0.1898],[0.0398,-0.1887],[0.01,-0.1964],[-0.0188,-0.2075],[-0.0432,-0.2197],[-0.0642,-0.2352],[-0.0664,-0.2352],[-0.0952,-0.2595]]);

function Guitar() {
  const T = 0.016;
  const tex = useLoader(THREE.TextureLoader, "/models/guitar.jpg");
  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.repeat.set(1 / G_W, 1 / G_H); // UV bentuk = koordinat x,y (berpusat di 0) -> petakan ke 0..1
    tex.offset.set(0.5, 0.5);
    tex.needsUpdate = true;
  }, [tex]);
  return (
    <group rotation={[0, 0, 0.45]} scale={0.85}>
      <mesh position={[0, 0, -T / 2]}><extrudeGeometry args={[G_SHAPE, { depth: T, bevelEnabled: false }]} />{mat("#ece8dc", { roughness: 0.3 })}</mesh>
      <mesh position={[0, 0, T / 2 + 0.0004]}><shapeGeometry args={[G_SHAPE]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
    </group>
  );
}

function Laptop() {
  return (
    <group rotation={[0.15, 0, 0]}>
      <mesh><boxGeometry args={[0.2, 0.01, 0.14]} />{mat("#9aa3b2", { metalness: 0.5 })}</mesh>
      <group position={[0, 0.005, -0.07]} rotation={[-0.35, 0, 0]}>
        <mesh position={[0, 0.07, 0]}><boxGeometry args={[0.2, 0.14, 0.008]} />{mat("#1b1d2a")}</mesh>
        <mesh position={[0, 0.07, 0.005]}><planeGeometry args={[0.18, 0.12]} /><meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.9} /></mesh>
      </group>
    </group>
  );
}

// Clipboard berisi daftar tugas (kesan arsip/administrasi)
function Clipboard() {
  const rows = [0.045, 0.012, -0.021, -0.054];
  return (
    <group rotation={[0.1, 0, -0.12]}>
      <mesh><boxGeometry args={[0.125, 0.175, 0.008]} />{mat("#8b5e34")}</mesh>
      <mesh position={[0, -0.004, 0.0055]}><boxGeometry args={[0.105, 0.145, 0.002]} />{mat("#f6f3ea", { roughness: 0.9 })}</mesh>
      <mesh position={[0, 0.085, 0.009]}><boxGeometry args={[0.055, 0.02, 0.012]} />{mat("#c8ccd4", { metalness: 0.6, roughness: 0.3 })}</mesh>
      {rows.map((y, i) => (
        <group key={y} position={[0, y, 0.0075]}>
          <mesh position={[-0.035, 0, 0]}><boxGeometry args={[0.014, 0.014, 0.002]} />{mat(i < 3 ? "#22c55e" : "#cbd0d8")}</mesh>
          <mesh position={[0.012, 0, 0]}><boxGeometry args={[0.06, 0.005, 0.002]} />{mat("#9aa3b2")}</mesh>
        </group>
      ))}
    </group>
  );
}

// Megafon (digital marketing / promosi) dengan gelombang suara
function Megaphone() {
  return (
    <group rotation={[0, 0, -0.25]} scale={1.1}>
      <mesh rotation={[0, 0, -Math.PI / 2]}><cylinderGeometry args={[0.07, 0.028, 0.12, 28]} />{mat("#f43f5e", { roughness: 0.35 })}</mesh>
      <mesh position={[0.06, 0, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.07, 0.007, 10, 28]} />{mat("#f4f4f5")}</mesh>
      <mesh position={[-0.075, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><cylinderGeometry args={[0.03, 0.03, 0.03, 20]} />{mat("#27272a")}</mesh>
      <mesh position={[-0.03, -0.065, 0]}><boxGeometry args={[0.022, 0.05, 0.022]} />{mat("#27272a")}</mesh>
      {[0.105, 0.14].map((x, i) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, -0.5]}>
          <torusGeometry args={[0.03 + i * 0.03, 0.004, 8, 20, 1]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Coin() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.055, 0.055, 0.009, 32]} />
      <meshStandardMaterial color="#f5c451" metalness={0.5} roughness={0.35} emissive="#8a6a12" emissiveIntensity={0.45} />
    </mesh>
  );
}

function Avatar({ reduce, mobile, shell }) {
  const gltf = useLoader(GLTFLoader, MODEL);
  const camera = useThree((s) => s.camera);
  const orbit = useRef();
  const root = useRef();

  const rig = useMemo(() => {
    const scene = gltf.scene;
    relaxArms(scene, new URLSearchParams(window.location.search).get("pose") || POSE_DEFAULT);
    const bones = { head: scene.getObjectByName("Head"), neck: scene.getObjectByName("Neck"), spine: scene.getObjectByName("Spine2"), spine1: scene.getObjectByName("Spine1"), armL: scene.getObjectByName("LeftArm"), armR: scene.getObjectByName("RightArm") };
    const morphs = [];
    scene.traverse((o) => {
      if (o.isMesh) { o.frustumCulled = false; if (o.morphTargetDictionary) morphs.push(o); }
    });
    const base = {};
    for (const k in bones) if (bones[k]) base[k] = bones[k].quaternion.clone();
    return { scene, bones, base, morphs };
  }, [gltf]);

  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => { stage.wake = invalidate; invalidate(); return () => { stage.wake = null; }; }, [invalidate]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const k = 1 - Math.exp(-dt * 6);

    // ---- Kamera "sinematik" mengikuti scroll: interpolasi antar keyframe adegan ----
    const sp = stage.p, last = KF.length - 1, i = Math.min(last, Math.floor(sp));
    const A = KF[i], B = KF[Math.min(last, i + 1)], f = ease(sp - i);
    const mx = (a, b) => a + (b - a) * f;
    const wide = Math.min(1, state.size.width / state.size.height / 1.5);
    const c = (rig.c ||= { pos: new THREE.Vector3(0, 1.4, 3.1), look: new THREE.Vector3(0, 1.3, 0), x: 0, o: 0, orbit: 1, tp: new THREE.Vector3(), tl: new THREE.Vector3() });
    c.tp.set(mx(A.c[0], B.c[0]), mx(A.c[1], B.c[1]), mx(A.c[2], B.c[2]) + (mobile ? 0.5 : 0));
    c.tl.set(mx(A.l[0], B.l[0]), mx(A.l[1], B.l[1]) - (mobile ? mx(A.my, B.my) : 0), mx(A.l[2], B.l[2]));
    const kc = 1 - Math.exp(-dt * 4.5);
    c.pos.lerp(c.tp, kc); c.look.lerp(c.tl, kc);
    // batasi geser ke samping sesuai lebar layar nyata + jarak kamera, supaya badan karakter tidak pernah terpotong
    const hw = 0.2679 * c.pos.z * (state.size.width / state.size.height), lim = Math.max(0, hw - mx(A.m ?? 0.3, B.m ?? 0.3));
    c.x += (Math.max(-lim, Math.min(lim, mx(A.x, B.x) * wide)) - c.x) * kc;
    const oT = mx(A.o, B.o) * (mobile ? mx(A.mo, B.mo) : 1);
    c.o += (oT - c.o) * kc;
    c.orbit += (mx(A.orbit, B.orbit) * (mobile ? 0.55 : 1) - c.orbit) * kc;
    camera.position.copy(c.pos); camera.lookAt(c.look);
    if (shell.current) shell.current.style.opacity = c.o.toFixed(3);
    orbit.current.visible = c.orbit > 0.05; orbit.current.scale.setScalar(Math.max(0.001, c.orbit));
    root.current.position.x = c.x; orbit.current.position.x = c.x;
    const idle = !reduce && performance.now() - pointer.last > 2500;
    const tx = idle ? Math.sin(t * 0.6) * 0.35 : pointer.x;
    const ty = idle ? Math.sin(t * 0.45) * 0.12 : pointer.y;

    const s = (rig.s ||= { yaw: 0, pitch: 0 });
    s.yaw += (tx * 0.6 - s.yaw) * k;
    s.pitch += (-ty * 0.35 - s.pitch) * k;
    const { head, neck, spine, spine1, armL, armR } = rig.bones, base = rig.base;
    // napas halus + bahu/lengan mengayun sangat pelan, supaya pose tidak membeku
    const br = reduce ? 0 : Math.sin(t * 1.6), sw = reduce ? 0 : Math.sin(t * 0.8);
    if (spine1) aim(spine1, base.spine1, 0, br * 0.012);
    if (armL) aim(armL, base.armL, 0, br * 0.012 + sw * 0.014);
    if (armR) aim(armR, base.armR, 0, br * 0.012 - sw * 0.012);
    if (spine) aim(spine, base.spine, s.yaw * 0.25, 0);
    if (neck) aim(neck, base.neck, s.yaw * 0.35, s.pitch * 0.35);
    if (head) aim(head, base.head, s.yaw * 0.6, s.pitch * 0.7);

    // kedip + senyum tipis lewat morph target
    const blink = !reduce && t % 4.2 < 0.14 ? 1 : 0;
    for (const m of rig.morphs) {
      const d = m.morphTargetDictionary, inf = m.morphTargetInfluences;
      const set = (n, v) => { if (d[n] !== undefined) inf[d[n]] += (v - inf[d[n]]) * Math.min(1, dt * 18); };
      set("eyeBlinkLeft", blink); set("eyeBlinkRight", blink);
      set("mouthSmileLeft", 0.3); set("mouthSmileRight", 0.3);
      set("browInnerUp", 0.1);
    }
    if (!reduce) {
      root.current.position.y = Math.sin(t * 1.4) * 0.006;
      root.current.rotation.z = Math.sin(t * 0.5) * 0.012; // pindah tumpuan tipis
      orbit.current.rotation.y = t * 0.5;
    }
    // Mode "demand": render berhenti total saat karakter tak terlihat (hemat baterai), bangun lagi saat scroll.
    if (oT > 0.02 || c.o > 0.02) invalidate();
  });

  return (
    <group>
      <group ref={root}><primitive object={rig.scene} /></group>
      {/* benda minat yang mengorbit: gitar (musik), laptop (data), clipboard (arsip), koin (numismatik), megafon (digital marketing) */}
      <group ref={orbit} position={[0, 1.25, 0]}>
        <Floaty position={[0.72, 0.18, 0]} speed={0.7} phase={0}><Guitar /></Floaty>
        <Floaty position={[0.22, -0.08, 0.68]} speed={1.2} phase={1.2}><Coin /></Floaty>
        <Floaty position={[-0.58, 0.02, 0.42]} speed={0.5} phase={2.4}><Laptop /></Floaty>
        <Floaty position={[-0.58, -0.1, -0.42]} speed={0.6} phase={3.6}><Megaphone /></Floaty>
        <Floaty position={[0.22, 0.1, -0.68]} speed={0.6} phase={4.8}><Clipboard /></Floaty>
      </group>
    </group>
  );
}

// Bila model gagal dimuat, halaman tetap jalan tanpa karakter.
class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e) { console.error("Model 3D gagal dimuat:", e); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function Stage3D() {
  const shell = useRef(null);
  const [env, setEnv] = useState(null); // { reduce, mobile } setelah dicek di browser

  useEffect(() => {
    let ok = false;
    try { const cv = document.createElement("canvas"); ok = !!(cv.getContext("webgl2") || cv.getContext("webgl")); } catch {}
    if (!ok) return;
    setEnv({
      reduce: matchMedia("(prefers-reduced-motion: reduce)").matches,
      mobile: matchMedia("(max-width: 767px), (pointer: coarse)").matches,
    });
    const move = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
      pointer.last = performance.now();
      stage.wake?.();
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div ref={shell} aria-hidden className="pointer-events-none fixed inset-0 z-[1]" style={{ opacity: 0 }}>
      {env && (
        <Canvas frameloop="demand" dpr={env.mobile ? [1, 1.25] : [1, 1.5]} camera={{ position: [0, 1.4, 3.1], fov: 30 }}
          gl={{ alpha: true, antialias: !env.mobile, powerPreference: "high-performance" }}>
          <ambientLight intensity={1.0} />
          <directionalLight position={[2, 3, 4]} intensity={2.6} />
          <pointLight position={[-1.8, 1.8, -1.2]} color={ACCENT} intensity={9} />
          <pointLight position={[1.8, 1.0, -1.2]} color="#38bdf8" intensity={6} />
          <Boundary>
            <Suspense fallback={null}><Avatar reduce={env.reduce} mobile={env.mobile} shell={shell} /></Suspense>
          </Boundary>
        </Canvas>
      )}
    </div>
  );
}
