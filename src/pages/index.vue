<template>
  <v-container
    fluid
    :class="$vuetify.display.smAndDown ? undefined : 'px-16'"
    class="d-flex align-center justify-center flex-column ga-6 bg-black"
    height="100vh"
    style="position: sticky; top: 0; z-index: 0;"
  >
    <GuitarStrings
      :count="
        $vuetify.display.xs
          ? 11
          : $vuetify.display.sm
            ? 14
            : $vuetify.display.md
              ? 17
              : 20
      "
    />
  
    <div class="position-relative">
      <p class="hero-title font-weight-medium text-center">
        <span class="text-grey-darken-4">WHERE LOGIC</span>
        <br>
        <span>FINDS RHYTHM</span>
      </p>
    </div>

    <div class="position-relative mt-4">
      <p class="text-center">
        <span class="text-grey-darken-2 font-weight-medium">EVERY LAYER A STRING.</span>
        <br>
        <span class="text-primary font-weight-medium">EVERY SYSTEM A SONG.</span>
      </p>
    </div>

    <div class="hero-footnote">
      <div class="d-flex align-center justify-center flex-column">
        <p class="text-caption font-weight-medium">
          Scroll To Play
        </p>
        <v-icon>mdi-chevron-down</v-icon>
      </div>
    </div>
  </v-container>

  <v-container
    ref="quoteContainerRef"
    fluid
    :class="$vuetify.display.smAndDown ? 'px-4' : 'px-16'"
    class="bg-grey-lighten-4 rounded-t-xl"    
    style="height: 400vh; position: relative; z-index: 1;"
  >
    <div style="position: sticky; top: 0; width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center;">
      <div style="perspective: 1000px;" :style="{maxWidth: $vuetify.display.mdAndUp ? '70%' : '100%'}">
        <p ref="quoteTextRef" class="text-h5 text-sm-h4 text-md-h3 text-center opacity-80" :style="{lineHeight: $vuetify.display.mdAndUp ? '62px' : '40px'}">A system is never a single thing. It is something that remembers what matters, parts that never misunderstand each other, and a screen that makes sense the moment you open it. Each one is a string — precise on its own, silent by itself. I build web applications where all of them play in tune.</p>
      </div>
    </div>
  </v-container>

  <!-- Naik 100vh menutupi quote yang masih terpaku di viewport.
       min-height 100vh wajib: margin negatif menaikkan section ini 100vh, jadi
       kalau isinya lebih pendek dari itu ujungnya berhenti DI ATAS ujung quote,
       dan sisa container quote yang abu muncul sebagai ruang kosong di bawah. -->
  <div class="bg-black rounded-t-xl" style="position: relative; z-index: 2; margin-top: -100vh; min-height: 102vh;">
    <v-container
      fluid
      :class="$vuetify.display.smAndDown ? 'px-4' : 'px-16'"
      class="py-16 py-md-16"
    >
      <WorkGallery />
    </v-container>
  </div>
</template>

<script setup>
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import SplitText from 'gsap/src/SplitText';
import { mergeProps } from 'vue';
gsap.registerPlugin(ScrollTrigger, SplitText);


const quoteContainerRef = ref();
const quoteTextRef = ref();

const animation = async () => {
  gsap.utils.toArray(".line-animation").forEach((el) => {
    SplitText.create(el, {
      type: "words",
      mask: "words",
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.words, {
          yPercent: 100,
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.01,
          scrollTrigger: {
            trigger: el,
            start: "top 130%",
            toggleActions: "play none none reverse",
          },
        });
      },
    });
  }); 

  let mm = gsap.matchMedia();
  // mm.add("@media (min-width: 600px)", () => {
  //   gsap.fromTo(
  //     ".we-believe-animation",
  //     {
  //       y: 300,
  //     },
  //     {
  //       y: 0,
  //       duration: 1,
  //       ease: "none",        
  //       scrollTrigger: {
  //         trigger: ".we-believe-animation",
  //         start: "top 130%",
  //         scrub: true,
  //         toggleActions: "play none none reverse",
  //         markers: true,
  //       },
  //     }
  //   );
  // });  
}

const createTextOpacityAnimation = (element, trigger) => {
  const splitted = new SplitType(element, { types: 'words' });
  splitted.words.forEach((word) => gsap.set(word, { opacity: 0 }));

  gsap.fromTo(
    splitted.words,
    {
      'will-change': 'opacity, transform',
      z: () => gsap.utils.random(500, 950),
      opacity: 0,
      xPercent: () => gsap.utils.random(-500, 500),
      yPercent: () => gsap.utils.random(-700, 700),
      rotationX: () => gsap.utils.random(-90, 90),
    },
    {
      ease: 'power2.out',
      opacity: 1,
      rotationX: 0,
      rotationY: 0,
      xPercent: 0,
      yPercent: 0,
      z: 0,
      scrollTrigger: {
        trigger: trigger.$el || trigger,
        start: 'top top',
        // selesai setelah 200vh scroll, tepat sebelum section proyek mulai menutupi
        end: '+=200%',
        scrub: true,
        invalidateOnRefresh: true,
      },
      stagger: {
        each: 0.006,
        from: 'random',
      },
    }
  );
};

let gsapCtx;

onMounted(async () => {
  gsapCtx = gsap.context(async () => {
    await animation();
    if (quoteTextRef.value && quoteContainerRef.value) {
      createTextOpacityAnimation(quoteTextRef.value, quoteContainerRef.value);
    }
  });
});

onUnmounted(() => {
  gsapCtx.revert();
});
</script>

<style>
/* `.v-application *` di index.html memakai !important dan mengenai setiap
   <span> di dalamnya secara langsung, jadi selektor ini harus menyebut
   .v-application (agar specificity-nya menang) sekaligus menyasar anak-anak
   (agar tidak kalah dari deklarasi langsung pada <span>) */
.v-application .hero-title,
.v-application .hero-title * {
  /* min 40px, ideal ~11% lebar viewport, max 180px */
  font-size: clamp(2.5rem, 11vw, 180px);
  line-height: 0.85;
  letter-spacing: -0.055em !important;
  text-wrap: balance;
}

/* dipatok ke tengah-bawah hero; translateX menetralkan offset dari left: 50% */
.hero-footnote {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: max-content;
  max-width: 90%;
}

.word {
  position: relative;
  display: inline-block;
  will-change: opacity, transform;
}

.marquee-container {
  display: flex;
  width: max-content;
}

.marquee-content {
  display: flex;
  flex-shrink: 0;
  animation: scroll-left 30s linear infinite;
}

@keyframes scroll-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-100% - 1rem)); /* matches ga-4, maintaining a seamless gap between loop clones */
  }
}
</style>