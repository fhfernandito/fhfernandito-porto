<template>
  <canvas ref="canvas" class="guitar-strings"></canvas>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();

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

const canvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let animationId: number | null = null;
let resizeObserver: ResizeObserver | null = null;

let strings: GuitarString[] = [];
let width = 0;
let height = 0;

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

// ikut berubah saat tema diganti atau prop warna diperbarui
watchEffect(() => {
  activeRgb = hexToRgb(activeColor.value);
  idleRgb = hexToRgb(props.idleColor);
});

function buildStrings() {
  const gap = width / (props.count + 1);
  strings = [];

  for (let i = 1; i <= props.count; i++) {
    const x = i * gap;
    const points: StringPoint[] = [];

    for (let s = 0; s <= config.segments; s++) {
      points.push({ x, y: (height / config.segments) * s, vx: 0, baseX: x });
    }

    strings.push({ points, active: 0 });
  }
}

function updateStrings() {
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
  }
}

function drawStrings() {
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);

  for (const string of strings) {
    const { points, active } = string;

    // rangkai titik-titik jadi kurva halus lewat titik tengah tiap ruas
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const midX = (current.x + next.x) / 2;
      const midY = (current.y + next.y) / 2;

      if (i === 0) ctx.lineTo(midX, midY);
      else ctx.quadraticCurveTo(current.x, current.y, midX, midY);
    }

    const last = points[points.length - 1];
    ctx.lineTo(last.x, last.y);

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

function animate() {
  // kecepatan kursor diukur per frame, bukan per event, agar sebanding dengan fisika senar
  pointer.vx = pointer.x - pointer.prevX;
  pointer.prevX = pointer.x;

  updateStrings();
  drawStrings();
  animationId = requestAnimationFrame(animate);
}

function handlePointerMove(e: PointerEvent) {
  const rect = canvas.value?.getBoundingClientRect();
  if (!rect) return;

  pointer.x = e.clientX - rect.left;
  pointer.y = e.clientY - rect.top;
}

function resize() {
  if (!canvas.value || !ctx) return;

  const rect = canvas.value.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  const dpr = window.devicePixelRatio || 1;
  width = rect.width;
  height = rect.height;

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
  animate();

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
