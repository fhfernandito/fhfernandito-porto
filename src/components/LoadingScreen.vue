<template>
  <div class="loader" ref="loaderRef" v-show="!introOut">
    <div class="inner-container">
      <!-- Full Name: Navia Creative Studio -->
      <div class="full-name-container" ref="fullNameContainerRef">
        <h2 ref="fullNameRef" class="full-name">
          F. Hanindya Fernandito
        </h2>
      </div>

      <!-- Short Name: Let's navigate your dreams together -->
      <div class="short-name-container" ref="shortNameContainerRef">
        <h2 ref="shortNameRef" class="short-name">
          Let's see<br />
          the strongest programmer.
        </h2>
      </div>

      <!-- Progress Counter -->
      <div class="progress-container" ref="progressContainerRef">
        <h1 ref="progressRef" class="progress">{{ progressValue }}%</h1>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const loaderRef = ref(null);
const fullNameRef = ref(null);
const fullNameContainerRef = ref(null);
const shortNameRef = ref(null);
const shortNameContainerRef = ref(null);
const progressRef = ref(null);
const progressContainerRef = ref(null);
const introOut = ref(false);
const progressValue = ref(0);

const router = useRouter();

// #page-content dirender oleh layout di balik <router-view>, dan route-nya dimuat
// async. Saat LoadingScreen mount elemen itu belum ada di DOM — dan gsap.set
// dengan selector string yang tidak cocok bukan error, melainkan diam-diam tidak
// mengenai apa pun. Itulah sebabnya halaman tidak pernah diletakkan di luar layar
// dan animasi gesernya tidak terlihat sama sekali.
async function waitForPageContent(maxFrames = 120) {
  await router.isReady();

  for (let i = 0; i < maxFrames; i++) {
    const el = document.querySelector('#page-content');
    if (el) return el;
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }

  return null;
}

onMounted(async () => {
  const pageContent = await waitForPageContent();

  if (!pageContent) {
    console.warn('LoadingScreen: #page-content tidak ditemukan, animasi geser halaman dilewati');
  }

  // Loader ini menutup satu layar penuh, jadi ia wajib tetap menyingkir walau
  // elemen halaman tidak ketemu
  const finish = () => {
    introOut.value = true;

    // Clean up transforms AND positioning to restore scroll
    if (pageContent) {
      gsap.set(pageContent, { clearProps: 'all' });
    }

    // Force layout recalculation and refresh ScrollTrigger
    ScrollTrigger.refresh();

    // Double check to ensure body overflow is correct
    document.body.style.overflow = '';
    document.body.style.height = '';
  };

  // Set initial state for page content
  // Start off-screen right, scaled down
  if (pageContent) {
    gsap.set(pageContent, {
      x: '100%',
      scale: 0.9,
      opacity: 1,
      borderRadius: '20px',
      border: '2px solid #f0f4f1',
      transformOrigin: 'center center',
      position: 'fixed', // Fix position during animation to prevent scroll issues
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#fff', // Ensure background prevents see-through
      zIndex: 1
    });
  }

  // Animate progress from 0 to 100
  gsap.to(progressValue, {
    value: 100,
    duration: 5,
    ease: 'power2.inOut',
    onUpdate: function() {
      progressValue.value = Math.round(progressValue.value);
    },
    onComplete: () => {
      // Step 1: Slide "Navia Creative Studio" up and out
      gsap.to(fullNameRef.value, {
        y: '-150%',
        duration: 0.8,
        ease: 'power4.inOut'
      });

      // Step 2: Slide progress counter up and out
      gsap.to(progressRef.value, {
        y: '-200%',
        duration: 0.8,
        ease: 'power4.inOut'
      });

      // Step 3: Show "Let's navigate..." sliding UP into view
      gsap.to(shortNameRef.value, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power4.out',
        delay: 0.4
      });

      // Step 4: Scale loader down
      gsap.to(loaderRef.value, {
        scale: 0.9,
        borderRadius: '20px',
        duration: 0.5,
        ease: 'power2.inOut',
        delay: 1.8
      });

      // Step 5: Slide loader LEFT and page content from RIGHT simultaneously
      // Note: Page content stays at scale 0.9 during slide
      gsap.to(loaderRef.value, {
        x: '-100%',
        duration: 0.8,
        ease: 'power2.inOut',
        delay: 2.3
      });

      if (!pageContent) {
        gsap.delayedCall(3.6, finish);
        return;
      }

      gsap.to(pageContent, {
        x: '0%',
        duration: 0.8,
        ease: 'power2.inOut',
        delay: 2.3
      });

      // Step 6: Scale UP page content after slide finishes
      gsap.to(pageContent, {
        scale: 1,
        borderRadius: 0,
        border: 'none',
        duration: 0.5,
        ease: 'power2.inOut',
        delay: 3.1, // 2.3 + 0.8
        onComplete: finish
      });
    }
  });
});
</script>

<style scoped>
.loader {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  height: 100svh;
  color: #28282b;
  background-color: #f0f4f1;
}

.inner-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.full-name-container {
  width: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.full-name {
  text-align: center;
  color: #020002;
  font-size: clamp(1.5rem, 5vw, 4rem);
  font-weight: 400;
  margin: 0;
}

.short-name-container {
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.short-name {
  text-align: center;
  opacity: 0;
  color: #020002;
  font-size: clamp(1.5rem, 5vw, 4rem);
  font-weight: 400;
  margin: 0;
  line-height: 1.3;
  transform: translateY(100%);
}

.progress-container {
  bottom: -20px;
  left: 5px;
  position: absolute;
  overflow: hidden;
}

.progress {
  text-align: center;
  color: #020002;
  font-size: 5rem;
  font-weight: 300;
  margin: 0;
}
</style>
