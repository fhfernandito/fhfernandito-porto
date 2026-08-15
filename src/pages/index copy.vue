<template>  
  <v-container
    fluid
    :class="$vuetify.display.smAndDown ? undefined : 'px-16'"
    class="d-flex align-center justify-center flex-column position-relative ga-6"
    min-height="100vh"
  >
    <div style="position: relative; z-index: 10;">
      <div>
        <div class="text-center mb-3">
          <a href="https://www.paypal.com/paypalme/fhfernandito">
            <v-avatar
              v-tooltip:top="'Donate me 😁'"
              size="60"
              color="blue-lighten-5"        
              border                  
            >
              <v-icon>
                <svg viewBox="7.056000232696533 3 37.35095977783203 45"><g xmlns="http://www.w3.org/2000/svg" clip-path="url(#paypal__a)"><path fill="#002991" d="M38.914 13.35c0 5.574-5.144 12.15-12.927 12.15H18.49l-.368 2.322L16.373 39H7.056l5.605-36h15.095c5.083 0 9.082 2.833 10.555 6.77a9.687 9.687 0 0 1 .603 3.58z"/><path fill="#60CDFF" d="M44.284 23.7A12.894 12.894 0 0 1 31.53 34.5h-5.206L24.157 48H14.89l1.483-9 1.75-11.178.367-2.322h7.497c7.773 0 12.927-6.576 12.927-12.15 3.825 1.974 6.055 5.963 5.37 10.35z"/><path fill="#008CFF" d="M38.914 13.35C37.31 12.511 35.365 12 33.248 12h-12.64L18.49 25.5h7.497c7.773 0 12.927-6.576 12.927-12.15z"/></g></svg>
              </v-icon>
            </v-avatar>      
          </a>
        </div> 
      </div>
      <div>
        <v-chip border variant="tonal">Hello, welcome back to my? Btw, I'm founder of&nbsp;<a href="https://naviacs.com" target="_blank" class="text-decoration-underline text-black" style="pointer-events: auto;">Navia</a>&nbsp;and&nbsp;<a href="https://mejaku.id" target="_blank" class="text-decoration-underline text-black" style="pointer-events: auto;">Mejaku</a>.</v-chip>
      </div>
    </div>    
    <div style="pointer-events: none;">
      <p 
        style="font-size: clamp(4rem, 15vw, 15rem); line-height: 0.8;" class="opacity-10 text-center"
      >
        hire me
      </p>
    </div>    
    <div class="d-flex flex-wrap align-center justify-center ga-2">
      <v-hover v-slot="{ isHovering, props: hoverProps }">
        <v-tooltip text="Vue.js" location="bottom">
          <template v-slot:activator="{ props: tooltipProps }">
            <v-btn
              v-bind="mergeProps(hoverProps, tooltipProps)"          
              size="x-large"
              :variant="isHovering ? 'outlined' : 'flat'"
              icon="mdi-vuejs"              
              href="https://vuejs.org"
              target="_blank"
            ></v-btn>
          </template>
        </v-tooltip>
      </v-hover>
      <v-hover v-slot="{ isHovering, props: hoverProps }">
        <v-tooltip text="Nuxt.js" location="bottom">
          <template v-slot:activator="{ props: tooltipProps }">
            <v-btn
              v-bind="mergeProps(hoverProps, tooltipProps)"          
              size="x-large"
              :variant="isHovering ? 'outlined' : 'flat'"
              icon="mdi-nuxt"
              href="https://nuxt.com"
              target="_blank"
            ></v-btn>
          </template>
        </v-tooltip>
      </v-hover>
      <v-hover v-slot="{ isHovering, props: hoverProps }">
        <v-tooltip text="React" location="bottom">
          <template v-slot:activator="{ props: tooltipProps }">
            <v-btn
              v-bind="mergeProps(hoverProps, tooltipProps)"          
              size="x-large"
              :variant="isHovering ? 'outlined' : 'flat'"
              icon="mdi-react"
              href="https://react.dev"
              target="_blank"
            ></v-btn>
          </template>
        </v-tooltip>
      </v-hover>
      <v-hover v-slot="{ isHovering, props: hoverProps }">
        <v-tooltip text="Laravel" location="bottom">
          <template v-slot:activator="{ props: tooltipProps }">
            <v-btn
              v-bind="mergeProps(hoverProps, tooltipProps)"          
              size="x-large"
              :variant="isHovering ? 'outlined' : 'flat'"
              icon="mdi-laravel"
              href="https://laravel.com"
              target="_blank"
            ></v-btn>
          </template>
        </v-tooltip>
      </v-hover>
      <v-hover v-slot="{ isHovering, props: hoverProps }">
        <v-tooltip text="Python" location="bottom">
          <template v-slot:activator="{ props: tooltipProps }">
            <v-btn
              v-bind="mergeProps(hoverProps, tooltipProps)"          
              size="x-large"
              :variant="isHovering ? 'outlined' : 'flat'"
              icon="mdi-language-python"
              href="https://www.python.org"
              target="_blank"
            ></v-btn>
          </template>
        </v-tooltip>
      </v-hover>
      <v-hover v-slot="{ isHovering, props: hoverProps }">
        <v-tooltip text="Electron" location="bottom">
          <template v-slot:activator="{ props: tooltipProps }">
            <v-btn
              v-bind="mergeProps(hoverProps, tooltipProps)"          
              size="x-large"
              :variant="isHovering ? 'outlined' : 'flat'"
              icon="mdi-electron-framework"
              href="https://www.electronjs.org"
              target="_blank"
            ></v-btn>
          </template>
        </v-tooltip>
      </v-hover>
      <v-hover v-slot="{ isHovering, props: hoverProps }">
        <v-tooltip text="Docker" location="bottom">
          <template v-slot:activator="{ props: tooltipProps }">
            <v-btn
              v-bind="mergeProps(hoverProps, tooltipProps)"          
              size="x-large"
              :variant="isHovering ? 'outlined' : 'flat'"
              icon="mdi-docker"
              href="https://www.docker.com"
              target="_blank"
            ></v-btn>
          </template>
        </v-tooltip>
      </v-hover>
    </div>
    <div>
      <p 
        style="font-size: clamp(4rem, 15vw, 15rem); line-height: 0.8;" class="opacity-10 text-center"
      >
        please
      </p>
    </div>    
    <div class="mt-1 overflow-hidden" style="width: 100vw; max-width: 100vw;">      
      <div class="marquee-container d-flex ga-4">
        <!-- Render 3 blocks to guarantee it overflows enough for seamless looping on ultra-wide screens -->
        <div class="marquee-content d-flex ga-4" v-for="i in 3" :key="i" :aria-hidden="i !== 1">
          <v-card variant="tonal" class="py-4 px-8 text-no-wrap" rounded="pill">AWS</v-card>
          <v-card variant="tonal" class="py-4 px-8 text-no-wrap" rounded="pill">Google Cloud</v-card>
          <v-card variant="tonal" class="py-4 px-8 text-no-wrap" rounded="pill">Firebase</v-card>
          <v-card variant="tonal" class="py-4 px-8 text-no-wrap" rounded="pill">Midtrans</v-card>                    
          <v-card variant="tonal" class="py-4 px-8 text-no-wrap" rounded="pill">Pusher</v-card>
          <v-card variant="tonal" class="py-4 px-8 text-no-wrap" rounded="pill">Leaflet</v-card>          
          <v-card variant="tonal" class="py-4 px-8 text-no-wrap" rounded="pill">Docker</v-card>
          <v-card variant="tonal" class="py-4 px-8 text-no-wrap" rounded="pill">Twilio</v-card>
          <v-card variant="tonal" class="py-4 px-8 text-no-wrap" rounded="pill">Vercel</v-card>
        </div>
      </div>
    </div>       
  </v-container>   

  <v-container
    ref="quoteContainerRef"
    fluid
    :class="$vuetify.display.smAndDown ? 'px-4' : 'px-16'"  
    style="height: 300vh; position: relative;"
  >
    <div style="position: sticky; top: 0; width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center;">
      <div style="perspective: 1000px;" :style="{maxWidth: $vuetify.display.mdAndUp ? '70%' : '100%'}"> 
        <p ref="quoteTextRef" class="text-h5 text-sm-h4 text-md-h3 text-center opacity-80" :style="{lineHeight: $vuetify.display.mdAndUp ? '62px' : '40px'}">I believe that great software is more than just code. It is about solving complex problems efficiently. I am dedicated to architecting robust, scalable, and innovative digital solutions that turn ambitious ideas into seamless realities.</p>
      </div>
    </div>
  </v-container>

  <v-container
    fluid
    :class="$vuetify.display.smAndDown ? undefined : 'px-16'"    
    class="py-16"
    min-height="100vh"
    v-for="(project, index) in projects"
    :key="project.id"
  >
    <v-row>
      <v-col cols="12" lg="5">
        <div class="overflow-hidden">
          <p class="text-h3 text-sm-h1 line-animation">
            {{ String(index + 1).padStart(2, '0') }}
          </p>
        </div>
      </v-col>
      <v-col cols="12" lg="7">
        <div class="d-flex flex-column ga-4">
          <v-card
            :image="project.image"
            rounded="xl"
            variant="flat"
            style="aspect-ratio: 16/10;"
          ></v-card>          
          <div class="mt-1">
            <div class="overflow-hidden">
              <p class="text-h5 text-sm-h3 line-animation">
                {{ project.title }}
              </p>
            </div>          
          </div>
          <div v-if="project.link && project.link.length > 0">
            <div class="overflow-hidden">
              <p class="opacity-60 line-animation">Link.</p>
            </div>
            <div class="overflow-hidden">              
              <p class="line-animation">
                <template v-for="(item, i) in project.link" :key="i">
                  <a :href="item.url" target="_blank" class="text-black text-decoration-underline">
                    {{ item.label }}
                  </a>
                  <span v-if="i !== project.link.length - 1" class="text-black text-decoration-none">&nbsp;&nbsp;•&nbsp;&nbsp;</span>
                </template>
              </p>
            </div>
          </div>
          <div>
            <div class="overflow-hidden">
              <p class="opacity-60 line-animation">Tech.</p>
            </div>
            <div class="overflow-hidden">
              <p class="line-animation">{{ project.tech }}</p>
            </div>
          </div>
          <div>
            <div class="overflow-hidden">
              <p class="opacity-60 line-animation">Introduction.</p>
            </div>
            <div class="overflow-hidden">
              <p class="line-animation">{{ project.introduction }}</p>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
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

<script setup>
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import SplitText from 'gsap/src/SplitText';
import { mergeProps } from 'vue';
gsap.registerPlugin(ScrollTrigger, SplitText);


const quoteContainerRef = ref();
const quoteTextRef = ref();

const projects = ref([
  {    
    title: "Mejaku",
    tech: `Vue.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}MySQL${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Midtrans${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}AWS (S3)${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Resend${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}AI (Gemini)${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Bluetooth Navigator (Print Receipt)`,
    link: [
      { label: "Website", url: "https://mejaku.id" },
      { label: "Instagram", url: "https://www.instagram.com/mejakuid/" }
    ],
    image: "/projects/mejaku.png",
    introduction: "Mejaku is an AI-powered Software-as-a-Service (SaaS) Point of Sale platform designed to streamline F&B operations. It features an intelligent cashier module tailored for dine-in services and an integrated table management system that empowers customers to place direct orders via QR codes. Enhanced by AI capabilities (powered by Gemini), the platform goes beyond basic transactions to offer centralized multi-outlet management, comprehensive product and inventory control, visual analytics for business performance tracking, role-based staff authorization, and seamless hardware integration for thermal receipt printers and payment gateways.",
  },
  {    
    title: "Hello Crew",
    tech: `Nuxt.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}MySQL${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Webhook${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}AWS (S3)${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Google Auth`,
    link: [
      { label: "Website", url: "https://hellocrew.id" },
      { label: "TikTok 1", url: "https://vt.tiktok.com/ZS9hDrjFY/" },
      { label: "TikTok 2", url: "https://vt.tiktok.com/ZS9YxbDPL/" }
    ],
    image: "/projects/hellocrew.png",
    introduction: "\"The Global Seafarer Hub\" - A centralized platform functioning as the primary database and dedicated career portal for seafarers. This is the central hub where all seafarers register accounts, complete profiles, and upload documents or certificates. Hello Crew is responsible for aggregating and displaying the complete list of job vacancies from various shipping companies integrated within the ecosystem.",
  },
  {    
    title: "Hello Crew Enterprise",
    tech: `Vue.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}MySQL${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}PWA${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Webhook${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}AWS (S3)${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}AI (Gemini)${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Google Auth`,
    link: [
      { label: "Website", url: "https://hellocrew-sosm.sevenoceans.co.id" }
    ],
    image: "/projects/hellocrewenterprise.png",
    introduction: "\"The Crewing Agency Operation System\" - An AI-powered internal management platform tailored for shipping companies. While initial account registration occurs on the main Hello Crew hub, all core operational workflows—from job applications, sign-on/sign-off processes, and work record tracking, to performance evaluations—are fully managed within Hello Crew Enterprise. Enhanced by AI capabilities (powered by Gemini), the system streamlines complex crew management tasks and seamlessly transmits experience data and evaluations back to the main hub, ensuring seafarer reputations remain continuously and accurately updated.",
  },
  {
    title: "Plan Maintenance System (PMS)",
    tech: `Vue.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Python${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}MySQL${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Leaflet${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}DeepL (Translation)${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}PWA${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Electron`,
    link: [
      { label: "Website", url: "https://pms.sevenoceans.co.id" }
    ],
    image: "/projects/pms.png",    
    introduction: "Plan Maintenance System (PMS) is an all-in-one platform designed to streamline maritime operations end to end—centralizing personnel onboard management, ship certificate tracking, real-time dashboards, and GPS-based visibility. It keeps crew duties, monitors every vessel certificate from issue to expiry with clear highlights for renewals, and provides live insights into ship condition, engine performance, and consumables through intuitive reporting. With GPS integration—augmented by ocean data such as weather and wave information—the PMS supports safer navigation and smarter route planning, helping owners and operators boost compliance, efficiency, and decision-making across their fleets.",
  },
  {
    title: "SeaLinks",
    tech: `Vue.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}MySQL${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Capacitor${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Firebase (Cloud Messaging)${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Pusher (Realtime Chat)`,
    link: null,
    image: "/projects/sealinks.webp",    
    introduction: "A mobile app (Android/IOS) for maritime industry. This app is offer and booking system between vessel owners and cargo owners. Features include vessel listing, booking management, chatting, and notifications. This app is designed to streamline the booking process and improve communication between vessel owners and cargo owners.",
  },
  {
    title: "PT Seven Oceans Technology Services (Company Profile)",
    tech: `WebGL${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}GSAP${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Vue.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Vuetify${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel`,
    link: [
      { label: "Website", url: "https://sots.sevenoceans.co.id" }
    ],
    image: "/projects/sots.png",    
    introduction: "PT Seven Oceans Technology Services is a technology company focused on developing reliable and innovative digital solutions. We build and deliver custom-made software tailored to client needs or as ready-to-use products. With experience across multiple sectors from maritime and industrial to digital enterprise. We provide efficient, secure, and results oriented technology integration.",
  },  
  {
    title: "Seven Oceans Group (Company Profile)",
    tech: `Vue.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Vuetify${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel`,
    link: [
      { label: "Website", url: "https://sevenoceans.co.id" }
    ],
    image: "/projects/sogcompro.png",    
    introduction: "Seven Oceans Group is a leading maritime company that provides comprehensive solutions for the maritime industry, including ship management, crew management, and vessel maintenance. The company is committed to providing innovative and efficient solutions to meet the needs of its clients and contribute to the growth of the maritime industry.",
  },
  {    
    title: "Roomar",
    tech: `Wordpress`,
    link: [
      { label: "Website", url: "https://roomarofficial.com" }
    ],
    image: "/projects/roomar.png",    
    introduction: "An e-commerce website for Roomar, a parfume and diffuser brand, to showcase and sell their products online.",
  },
  {    
    title: "Grha Pengharapan",
    tech: `Vue.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}MySQL`,
    link: [
      { label: "Website", url: "https://grhapengharapan.org" }
    ],
    image: "/projects/grhapengharapan.png",    
    introduction: "A property management website for Grha Pengharapan Church to manage their organization data, events, and resources efficiently. Features include event scheduling, resource allocation, and member management.",
  },
]);

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
        end: 'bottom bottom',
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