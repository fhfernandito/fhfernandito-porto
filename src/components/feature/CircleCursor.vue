<template>
  <Teleport to="body">
    <div class="cursor" aria-hidden="true">
      <svg ref="ringRef" class="cursor__ring" viewBox="0 0 40 40">
        <!-- lintasan samar supaya cincin tetap terbaca saat progress masih 0 -->
        <circle class="cursor__track" cx="20" cy="20" :r="RADIUS" />
        <circle ref="barRef" class="cursor__bar" cx="20" cy="20" :r="RADIUS" />
      </svg>
      <div ref="dotRef" class="cursor__dot"></div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const RADIUS = 19;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const dotRef = ref(null);
const ringRef = ref(null);
const barRef = ref(null);

const config = {
  // makin kecil makin lambat cincin menyusul -> delay makin terasa
  ease: 0.12,
};

let raf = null;
let lastMeasure = 0;

// posisi disimpan di luar ref: nilainya berubah tiap frame dan tidak perlu
// memicu render ulang Vue, cukup ditulis langsung ke style elemen
const pointer = { x: -100, y: -100 };
const ring = { x: -100, y: -100 };

let scrollLimit = 1;

const measure = () => {
  lastMeasure = performance.now();
  scrollLimit = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight
  );
};

const onMouseMove = (e) => {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
};

const render = (now) => {
  // Tinggi halaman berubah karena gambar yang baru dimuat, toggle mode galeri,
  // atau font yang selesai ter-render. Diukur ulang berkala — bukan tiap frame,
  // sebab membaca scrollHeight memaksa browser menghitung layout.
  if (now - lastMeasure > 250) measure();

  // titik kecil menempel persis di ujung kursor
  if (dotRef.value) {
    dotRef.value.style.transform =
      `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`;
  }

  // cincin mengejar sebagian jarak tiap frame, jadi selalu tertinggal
  ring.x += (pointer.x - ring.x) * config.ease;
  ring.y += (pointer.y - ring.y) * config.ease;

  if (ringRef.value) {
    ringRef.value.style.transform =
      `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
  }

  // panjang garis yang tergambar mewakili posisi scroll terhadap seluruh halaman
  if (barRef.value) {
    const progress = Math.min(1, Math.max(0, window.scrollY / scrollLimit));
    barRef.value.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  }

  raf = requestAnimationFrame(render);
};


onMounted(() => {
  measure();

  if (barRef.value) {
    barRef.value.style.strokeDasharray = CIRCUMFERENCE;
    barRef.value.style.strokeDashoffset = CIRCUMFERENCE;
  }

  window.addEventListener("mousemove", onMouseMove, { passive: true });
  window.addEventListener("resize", measure);

  raf = requestAnimationFrame(render);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("resize", measure);
  if (raf !== null) cancelAnimationFrame(raf);
});
</script>

<style scoped>
.cursor__dot,
.cursor__ring {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 10000;
  /* difference membalik warna apa pun di bawahnya, jadi kursor tetap terbaca
     di section hitam maupun abu terang tanpa perlu diganti warnanya */
  mix-blend-mode: difference;
  will-change: transform;
}

.cursor__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
}

.cursor__ring {
  width: 40px;
  height: 40px;
  overflow: visible;
}

.cursor__track,
.cursor__bar {
  fill: none;
  stroke-width: 1;
}

.cursor__track {
  stroke: rgba(255, 255, 255, 0.25);
}

.cursor__bar {
  stroke: #fff;
  stroke-linecap: round;
  /* diputar agar garis progress mulai dari titik jam 12, bukan jam 3 */
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}

/* perangkat sentuh tidak punya kursor untuk diikuti */
@media (hover: none) {
  .cursor__dot,
  .cursor__ring {
    display: none;
  }
}
</style>

<style>
/* kursor bawaan disembunyikan agar tidak tampil ganda dengan lingkarannya */
@media (hover: hover) {
  body {
    cursor: none;
  }
}
</style>
