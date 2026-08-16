import { ref, shallowRef } from "vue";

/**
 * Mikrofon sebagai sumber getaran senar: tepuk tangan, suara, gitar sungguhan,
 * apa pun yang terdengar di ruangan.
 *
 * Sengaja memakai AudioContext sendiri, terpisah dari pemutar musik. Keduanya
 * tidak pernah perlu bercampur — jalur ini bahkan tidak boleh sampai ke speaker —
 * jadi memisahkannya membuat satu sisi tidak bisa merusak sisi lain.
 */

const isListening = ref(false);
const analyser = shallowRef(null);
// diisi kalau izin ditolak atau perangkatnya tidak ada, supaya UI bisa memberi tahu
const error = ref(null);

let ctx = null;
let stream = null;

async function start() {
  // dipanggil dari beberapa tempat (saat mount, lalu saat interaksi pertama),
  // jadi harus aman kalau kebetulan terpanggil dua kali
  if (isListening.value) return;

  error.value = null;

  if (!navigator.mediaDevices?.getUserMedia) {
    error.value = "unsupported";
    return;
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        // Sengaja dimatikan. Peredam gema memakai keluaran speaker sebagai acuan
        // untuk dibuang — di sebagian sistem itu berarti SELURUH suara yang
        // terdengar, termasuk musik dari aplikasi lain. Padahal justru itu yang
        // ingin didengar.
        //
        // Aman dimatikan karena jalur ini tidak pernah kembali ke speaker, jadi
        // tidak ada feedback. Lagu situs sendiri memang jadi terbaca dua kali,
        // tapi kedua sumber digabung dengan max() per pita, jadi hasilnya sama.
        echoCancellation: false,
        // Sengaja dimatikan. Peredam derau bawaan browser disetel untuk suara
        // manusia, jadi ia ikut membuang musik dan bunyi lain — padahal yang
        // diminta justru "suara apa pun". Dengung tetap ruangan sudah diurus
        // oleh pelacak lantai derau di kanvas, yang tidak pilih-pilih jenis suara.
        noiseSuppression: false,
        // penguatan diserahkan ke kalibrasi per senar di kanvas, bukan ke browser.
        // AGC bawaan akan menaikkan derau ruangan sampai senar bergoyang terus.
        autoGainControl: false,
      },
    });
  } catch (e) {
    // paling sering: pengguna menolak izin, atau halaman tidak dibuka lewat HTTPS
    error.value = e?.name || "denied";
    isListening.value = false;
    return;
  }

  ctx = new AudioContext();
  await ctx.resume();

  const node = ctx.createAnalyser();
  // fftSize sama dengan jalur musik supaya pembagian pita senar bisa dipakai ulang
  node.fftSize = 4096;
  node.smoothingTimeConstant = 0.65;
  node.minDecibels = -70;
  node.maxDecibels = -10;

  // JANGAN disambungkan ke ctx.destination. Mikrofon yang dikembalikan ke speaker
  // langsung menimbulkan feedback yang melengking.
  ctx.createMediaStreamSource(stream).connect(node);

  analyser.value = node;
  isListening.value = true;
}

function stop() {
  // track dihentikan supaya indikator mikrofon di tab browser ikut padam
  stream?.getTracks().forEach((t) => t.stop());
  stream = null;

  analyser.value = null;
  isListening.value = false;

  ctx?.close();
  ctx = null;
}

function toggle() {
  if (isListening.value) stop();
  else return start();
}

async function permissionState() {
  try {
    const status = await navigator.permissions.query({ name: "microphone" });
    return status.state; // granted | prompt | denied
  } catch {
    // Firefox dan Safari belum mendukung query untuk mikrofon
    return "unknown";
  }
}

/**
 * Menyalakan mikrofon tanpa perlu ditekan apa pun.
 *
 * Yang TIDAK bisa dihindari: pada kunjungan pertama browser tetap menampilkan
 * dialog izin. Itu batas keamanan, tidak ada jalan memutarnya. Setelah diizinkan
 * sekali, izinnya diingat per domain, jadi kunjungan berikutnya langsung menyala
 * tanpa dialog sama sekali.
 */
async function autoStart() {
  const state = await permissionState();

  // pernah ditolak permanen: mencoba lagi cuma menghasilkan penolakan diam-diam
  if (state === "denied") return;

  await start();
  if (isListening.value) return;

  // Safari — dan semua browser di iOS — menolak getUserMedia yang tidak berasal
  // dari tindakan pengguna. Dicoba sekali lagi pada sentuhan, klik, atau tombol
  // pertama, apa pun itu. Pengunjung tidak perlu tahu; tidak ada yang harus
  // ditekan secara khusus.
  const retry = () => {
    window.removeEventListener("pointerdown", retry);
    window.removeEventListener("keydown", retry);
    start();
  };

  window.addEventListener("pointerdown", retry);
  window.addEventListener("keydown", retry);
}

export function useAmbientMic() {
  return { isListening, analyser, error, autoStart, toggle, start, stop };
}
