import { ref, shallowRef } from "vue";

/**
 * Pemutar musik latar untuk seluruh halaman.
 *
 * State-nya sengaja disimpan di level modul, bukan di dalam fungsi composable-nya:
 * tombol play ada di Navigation sementara visualisasinya ada di GuitarStrings, dan
 * keduanya harus memakai satu AudioContext yang sama. Context kedua berarti dua
 * jalur audio yang berjalan sendiri-sendiri, dan analyser-nya tidak akan pernah
 * melihat lagu yang sebenarnya terdengar.
 */

// diputar berurutan lalu kembali ke lagu pertama, jadi musiknya tidak pernah habis
// (satu lagu pun ikut aturan yang sama: begitu selesai, langsung diulang)
const PLAYLIST = ["/tracks/track_2.mp3"];

const FADE_IN_SEC = 2;
const FADE_OUT_SEC = 1.5;

const isPlaying = ref(false);
// AnalyserNode bukan data biasa; shallowRef mencegah Vue membungkusnya jadi proxy
const analyser = shallowRef(null);

let ctx = null;
let gain = null;
let elements = [];
let current = 0;
let stopTimer = null;

function buildGraph() {
  if (ctx) return;

  ctx = new AudioContext();

  gain = ctx.createGain();
  gain.gain.value = 0;

  const node = ctx.createAnalyser();
  // 4096 -> lebar tiap bin sekitar 11 Hz. Serendah ini diperlukan supaya senar-senar
  // bass, yang jaraknya cuma belasan Hz, tidak jatuh di bin yang sama persis.
  node.fftSize = 4096;
  node.smoothingTimeConstant = 0.65;
  // rentang dB yang dipetakan ke 0..255. Dipersempit dari bawaannya (-100..-30)
  // supaya lantai derau tidak ikut terbaca sebagai sinyal.
  node.minDecibels = -80;
  node.maxDecibels = -15;

  elements = PLAYLIST.map((src, index) => {
    const el = new Audio(src);
    // lagu berikutnya sudah tersangga sebelum gilirannya tiba, jadi sambungannya
    // nyaris tanpa jeda
    el.preload = "auto";
    // perulangan diurus di tingkat playlist, bukan per lagu
    el.loop = false;
    el.addEventListener("ended", () => playFrom(index + 1));
    ctx.createMediaElementSource(el).connect(gain);
    return el;
  });

  // analyser dipasang SETELAH gain, jadi yang tergambar di senar persis yang
  // terdengar — termasuk saat lagunya sedang fade in maupun fade out
  gain.connect(node).connect(ctx.destination);
  analyser.value = node;
}

function playFrom(index) {
  // lagu bisa saja keburu dihentikan tepat saat yang lama selesai
  if (!isPlaying.value) return;

  current = index % elements.length;
  const el = elements[current];
  el.currentTime = 0;
  el.play().catch(() => {});
}

function rampGain(target, seconds) {
  const now = ctx.currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(gain.gain.value, now);
  gain.gain.linearRampToValueAtTime(target, now + seconds);
}

async function play() {
  // dibangun saat diklik, bukan saat mount: AudioContext yang lahir sebelum ada
  // interaksi pengguna akan langsung berstatus suspended
  buildGraph();

  // batalkan jeda yang masih menunggu, supaya klik cepat tidak mematikan lagu
  // yang baru saja dinyalakan lagi
  clearTimeout(stopTimer);
  await ctx.resume();

  isPlaying.value = true;

  try {
    await elements[current].play();
  } catch {
    isPlaying.value = false;
    return;
  }

  rampGain(1, FADE_IN_SEC);
}

function stop() {
  if (!ctx) return;

  // ditandai berhenti sejak awal fade, bukan di ujungnya: kalau tidak, menekan
  // play di tengah fade out justru terbaca sebagai perintah berhenti sekali lagi
  isPlaying.value = false;
  rampGain(0, FADE_OUT_SEC);

  stopTimer = setTimeout(() => {
    // hanya dijeda setelah suaranya benar-benar habis; posisi lagu dibiarkan
    // supaya bisa dilanjutkan, bukan diulang dari awal
    elements[current].pause();
  }, FADE_OUT_SEC * 1000);
}

function toggle() {
  if (isPlaying.value) stop();
  else play();
}

export function useMusicPlayer() {
  return { isPlaying, analyser, toggle, play, stop };
}
