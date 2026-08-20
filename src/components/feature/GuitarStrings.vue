<template>
  <canvas ref="canvas" class="guitar-strings"></canvas>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted } from "vue";
import { useTheme } from "vuetify";
import { useMusicPlayer } from "@/composables/useMusicPlayer";

const theme = useTheme();
const { analyser, isPlaying } = useMusicPlayer();

const props = withDefaults(
  defineProps<{
    /** Jumlah senar vertikal */
    count?: number;
    /** Warna senar saat dipetik. Kosongkan untuk memakai warna `primary` dari tema */
    color?: string;
    /** Warna senar saat diam */
    idleColor?: string;
  }>(),
  {
    count: 20,
    idleColor: "#1A1A1A",
  }
);

const activeColor = computed(
  () => props.color ?? theme.current.value.colors.primary
);

interface StringPoint {
  x: number; // posisi mendatar saat ini
  y: number; // posisi tegak, tetap
  vx: number; // kecepatan mendatar
  baseX: number; // posisi diam, tempat pegas menarik kembali
}

interface GuitarString {
  points: StringPoint[];
  active: number; // 0..1, seberapa "menyala" senar ini

  // --- bagian yang digerakkan musik ---
  binLo: number; // bin FFT pertama milik senar ini
  binHi: number; // batas atas (eksklusif)
  peak: number; // puncak yang pernah terukur, untuk kalibrasi otomatis
  env: number; // 0..1, amplitudo getaran saat ini
  phase: number; // sudut ayunan, terus bertambah tiap frame
  wobble: number; // laju ayunan (siklus per detik)
  swing: number; // simpangan puncak dalam px
}

const config = {
  segments: 12, // ruas per senar -> 13 titik massa
  stiffness: 0.08, // tarikan pegas tiap titik ke posisi diamnya
  damping: 0.92, // peredaman kecepatan tiap frame
  influence: 150, // radius (px) kursor masih terasa oleh senar
  minSpeed: 3, // kecepatan mendatar minimum agar senar tersentak
  drag: 0.05, // seberapa kuat kursor menyeret titik senar
  activeGain: 0.01, // konversi kecepatan kursor -> kilau
  activeDecay: 0.94, // peredaman kilau
  glowBlur: 15,
  glowThreshold: 0.1,
};

const audioConfig = {
  // Rentang nada yang dibagikan ke senar. Batas atas 8 kHz membuat senar-senar
  // paling kanan jatuh di wilayah desis simbal yang jarang berisi apa-apa,
  // sehingga mereka hanya sesekali tersentak — dan itu memang disengaja.
  //
  // Ketiga angka di bawah ini praktis tidak menyentuh senar kiri: pita bass
  // selalu jauh di atas ambang, jadi diubah bagaimana pun hasilnya sama. Yang
  // mereka atur cuma seberapa ramai sisi kanan. Menurunkannya (mis. maxFreq 5000
  // dengan gate 0.02) membuat seluruh sisi kanan ikut bergoyang terus-menerus.
  minFreq: 55,
  maxFreq: 8000,
  // di bawah ambang ini band dianggap sunyi, supaya kalibrasi otomatis di bawah
  // tidak ikut membesarkan lantai derau
  gate: 0.08,
  // jarak minimum antara ambang dan puncak; penjaga agar pembaginya tidak mengecil
  minSpan: 0.15,
  // konstanta waktu peluruhan puncak (detik). Cukup lambat untuk jadi kalibrasi,
  // bukan kompresor yang memompa-mompa
  peakTau: 2.5,
  // serangan cepat supaya ketukan terasa, peredaman lebih lambat supaya mendengung
  attackTau: 0.025,
  releaseTau: 0.18,
  // simpangan puncak, sebagai pecahan jarak antar senar
  swingBass: 0.38,
  swingTreble: 0.16,
  // laju ayunan (siklus/detik): kiri lambat seperti senar tebal, kanan rapat
  // seperti senar tipis
  wobbleBass: 1.6,
  wobbleTreble: 7,
  // seberapa jauh level audio ikut menyalakan warna dan pendarnya
  glowMix: 0.9,
};

const TWO_PI = Math.PI * 2;

const canvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let animationId: number | null = null;
let resizeObserver: ResizeObserver | null = null;

let strings: GuitarString[] = [];
let width = 0;
let height = 0;
let lastTime = 0;

let spectrum = new Uint8Array(0);
let bandsAssigned = false;

// bentuk simpangan sepanjang senar, dan buffer koordinat gambar. Keduanya dipakai
// ulang tiap frame supaya tidak ada alokasi di dalam loop render.
let shape = new Float64Array(0);
let renderX = new Float64Array(0);

let idleRgb: [number, number, number] = [26, 26, 26];
let activeRgb: [number, number, number] = [255, 235, 59];

// kursor mulai jauh di luar layar supaya senar diam sebelum disentuh
const pointer = { x: -1000, y: -1000, vx: 0, prevX: -1000 };

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ikut berubah saat tema diganti atau prop warna diperbarui
watchEffect(() => {
  activeRgb = hexToRgb(activeColor.value);
  idleRgb = hexToRgb(props.idleColor);
});

function buildStrings() {
  const gap = width / (props.count + 1);
  strings = [];

  // modus dasar senar yang kedua ujungnya terikat: nol di ujung, puncak di tengah
  shape = new Float64Array(config.segments + 1);
  renderX = new Float64Array(config.segments + 1);
  for (let s = 0; s <= config.segments; s++) {
    shape[s] = Math.sin((Math.PI * s) / config.segments);
  }

  for (let i = 1; i <= props.count; i++) {
    const x = i * gap;
    const points: StringPoint[] = [];

    for (let s = 0; s <= config.segments; s++) {
      points.push({ x, y: (height / config.segments) * s, vx: 0, baseX: x });
    }

    // 0 di senar paling kiri (bass), 1 di paling kanan (treble)
    const t = props.count > 1 ? (i - 1) / (props.count - 1) : 0;

    strings.push({
      points,
      active: 0,
      binLo: 0,
      binHi: 1,
      // dimulai dari 1 supaya beberapa detik pertama justru kalem, lalu terbuka
      // sendiri begitu puncak asli tiap band ketahuan
      peak: 1,
      env: 0,
      // fase awal diacak supaya senar tidak melenggok serempak seperti satu pita
      phase: Math.random() * TWO_PI,
      wobble: lerp(audioConfig.wobbleBass, audioConfig.wobbleTreble, t),
      // simpangan dipatok ke jarak antar senar, jadi seramai apa pun lagunya
      // senar tidak pernah bersilangan
      swing: gap * lerp(audioConfig.swingBass, audioConfig.swingTreble, t),
    });
  }

  bandsAssigned = false;
}

function assignBands() {
  const node = analyser.value;
  if (!node || strings.length === 0) return;

  const bins = node.frequencyBinCount;
  const hzPerBin = node.context.sampleRate / 2 / bins;

  if (spectrum.length !== bins) spectrum = new Uint8Array(bins);

  const count = strings.length;
  // senar dibagi rata dalam skala logaritma, bukan linear. Musik bergerak per
  // oktaf: pembagian linear akan menumpuk hampir semua senar di wilayah treble
  // yang jarang berisi melodi, dan menyisakan satu senar untuk seluruh bass.
  const ratio =
    count > 1
      ? Math.pow(audioConfig.maxFreq / audioConfig.minFreq, 1 / (count - 1))
      : 1;
  const halfStep = Math.sqrt(ratio);

  for (let i = 0; i < count; i++) {
    const freq = audioConfig.minFreq * Math.pow(ratio, i);
    const lo = Math.floor(freq / halfStep / hzPerBin);
    const hi = Math.ceil((freq * halfStep) / hzPerBin);

    const binLo = Math.min(Math.max(lo, 0), bins - 1);
    strings[i].binLo = binLo;
    strings[i].binHi = Math.min(Math.max(hi, binLo + 1), bins);
  }

  bandsAssigned = true;
}

function updateAudio(dt: number) {
  const node = analyser.value;

  if (!node || !isPlaying.value) {
    // musik berhenti: getaran mereda sendiri, petikan kursor tetap jalan
    const decay = Math.exp(-dt / audioConfig.releaseTau);
    for (const string of strings) string.env *= decay;
    return;
  }

  // analyser baru ada setelah tombol play ditekan pertama kali
  if (!bandsAssigned) assignBands();
  if (!bandsAssigned) return;

  node.getByteFrequencyData(spectrum);

  const peakDecay = Math.exp(-dt / audioConfig.peakTau);
  const floor = audioConfig.gate + audioConfig.minSpan;
  const attackK = 1 - Math.exp(-dt / audioConfig.attackTau);
  const releaseK = 1 - Math.exp(-dt / audioConfig.releaseTau);

  for (const string of strings) {
    let sum = 0;
    let max = 0;

    for (let b = string.binLo; b < string.binHi; b++) {
      sum += spectrum[b];
      if (spectrum[b] > max) max = spectrum[b];
    }

    // band treble melebar sampai ratusan bin sementara band bass cuma satu dua.
    // Rata-rata murni membuat treble tenggelam oleh bin kosong di sekitarnya,
    // jadi puncak band diberi bobot lebih besar daripada rata-ratanya.
    const bandWidth = string.binHi - string.binLo;
    const raw = (0.65 * max + (0.35 * sum) / bandWidth) / 255;

    // tiap senar mengukur puncaknya sendiri. Tanpa ini penguatan tiap pita
    // frekuensi harus disetel satu per satu, dan hasilnya cuma cocok untuk satu
    // lagu tertentu.
    string.peak = Math.max(raw, floor + (string.peak - floor) * peakDecay);

    const level =
      raw <= audioConfig.gate
        ? 0
        : Math.min(
            1,
            (raw - audioConfig.gate) / (string.peak - audioConfig.gate)
          );

    string.env += (level - string.env) * (level > string.env ? attackK : releaseK);
  }
}

function updateStrings(dt: number) {
  for (const string of strings) {
    for (let i = 0; i < string.points.length; i++) {
      // titik paling atas dan paling bawah terpaku, seperti ujung senar di gitar
      if (i === 0 || i === string.points.length - 1) continue;

      const point = string.points[i];

      // pegas: tiap titik ditarik kembali ke garis lurusnya sendiri
      const offset = point.x - point.baseX;
      point.vx += -config.stiffness * offset;
      point.vx *= config.damping;
      point.x += point.vx;

      // kursor menyeret titik yang ada di sekitarnya
      const withinReach =
        Math.abs(pointer.y - point.y) < config.influence &&
        Math.abs(pointer.x - point.x) < config.influence;

      if (withinReach && Math.abs(pointer.vx) > config.minSpeed) {
        const distance = Math.abs(pointer.x - point.x);
        const falloff = Math.max(0, (config.influence - distance) / config.influence);

        point.vx += pointer.vx * falloff * config.drag;
        string.active = Math.min(
          string.active + Math.abs(pointer.vx) * config.activeGain,
          1
        );
      }
    }

    string.active *= config.activeDecay;
    // senar yang bandnya sedang ramai ikut menyala kuning, seperti baru dipetik
    string.active = Math.max(string.active, string.env * audioConfig.glowMix);

    string.phase = (string.phase + string.wobble * dt * TWO_PI) % TWO_PI;
  }
}

function drawStrings() {
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);

  for (const string of strings) {
    const { points, active } = string;

    // getaran dari musik ditumpuk di atas hasil fisika, bukan menggantikannya:
    // petikan kursor dan ayunan lagu jadi bisa terjadi berbarengan
    const swing = string.env * string.swing * Math.sin(string.phase);
    for (let i = 0; i < points.length; i++) {
      renderX[i] = points[i].x + swing * shape[i];
    }

    // rangkai titik-titik jadi kurva halus lewat titik tengah tiap ruas
    ctx.beginPath();
    ctx.moveTo(renderX[0], points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
      const midX = (renderX[i] + renderX[i + 1]) / 2;
      const midY = (points[i].y + points[i + 1].y) / 2;

      if (i === 0) ctx.lineTo(midX, midY);
      else ctx.quadraticCurveTo(renderX[i], points[i].y, midX, midY);
    }

    const last = points.length - 1;
    ctx.lineTo(renderX[last], points[last].y);

    // warna bergerak dari warna diam ke warna nyala mengikuti `active`
    const r = Math.floor(idleRgb[0] + (activeRgb[0] - idleRgb[0]) * active);
    const g = Math.floor(idleRgb[1] + (activeRgb[1] - idleRgb[1]) * active);
    const b = Math.floor(idleRgb[2] + (activeRgb[2] - idleRgb[2]) * active);

    ctx.strokeStyle = `rgb(${r},${g},${b})`;
    ctx.lineWidth = 1 + active * 3;

    if (active > config.glowThreshold) {
      ctx.shadowBlur = active * config.glowBlur;
      ctx.shadowColor = `rgba(${activeRgb[0]},${activeRgb[1]},${activeRgb[2]},${active})`;
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

function animate(now: number) {
  // dibatasi 50 ms supaya lompatan waktu saat tab kembali aktif tidak melempar
  // getaran jauh dalam satu frame
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  // kecepatan kursor diukur per frame, bukan per event, agar sebanding dengan fisika senar
  pointer.vx = pointer.x - pointer.prevX;
  pointer.prevX = pointer.x;

  updateAudio(dt);
  updateStrings(dt);
  drawStrings();
  animationId = requestAnimationFrame(animate);
}

function handlePointerMove(e: PointerEvent) {
  const rect = canvas.value?.getBoundingClientRect();
  if (!rect || rect.width === 0 || rect.height === 0) return;

  // rect ikut terskala kalau ada ancestor ber-transform, sedangkan posisi senar
  // disimpan dalam satuan layout — koordinat kursor dinormalkan dulu supaya
  // petikan tetap jatuh di senar yang benar
  pointer.x = ((e.clientX - rect.left) / rect.width) * width;
  pointer.y = ((e.clientY - rect.top) / rect.height) * height;
}

function resize() {
  if (!canvas.value || !ctx) return;

  // Ukuran diambil dari layout (offsetWidth/Height), bukan getBoundingClientRect.
  // Rect ikut terskala oleh transform ancestor — LoadingScreen sempat men-scale
  // #page-content jadi 0.9 — dan ukuran yang keliru itu terpanggang ke backing
  // store canvas. ResizeObserver tidak menyala saat transform-nya hilang, sebab
  // border-box-nya tidak berubah, jadi canvas akan salah ukuran selamanya.
  const cssWidth = canvas.value.offsetWidth;
  const cssHeight = canvas.value.offsetHeight;
  if (cssWidth === 0 || cssHeight === 0) return;

  const dpr = window.devicePixelRatio || 1;
  width = cssWidth;
  height = cssHeight;

  canvas.value.width = Math.round(width * dpr);
  canvas.value.height = Math.round(height * dpr);
  // gambar tetap memakai satuan css px, canvas-nya saja yang beresolusi lebih tinggi
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  buildStrings();
}

onMounted(() => {
  if (!canvas.value) return;

  ctx = canvas.value.getContext("2d");
  if (!ctx) return;

  resize();
  lastTime = performance.now();
  animationId = requestAnimationFrame(animate);

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas.value);
  window.addEventListener("pointermove", handlePointerMove, { passive: true });
});

onUnmounted(() => {
  if (animationId !== null) cancelAnimationFrame(animationId);
  resizeObserver?.disconnect();
  window.removeEventListener("pointermove", handlePointerMove);
});
</script>

<style scoped>
.guitar-strings {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  /* senar membentang DI DEPAN teks, seperti senar gitar di atas lubang suara */
  z-index: 1;
  /* kursor tetap tembus ke teks di bawahnya; petikan dihitung dari koordinat window */
  pointer-events: none;
}
</style>
