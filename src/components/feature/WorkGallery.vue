<template>
  <v-container>
    <!-- judul -->
    <div class="my-16">
      <div class="d-flex align-end">
        <div>
          <div class="overflow-hidden">
            <p class="work-heading font-weight-medium text-white">MY</p>
          </div>
          <div class="overflow-hidden">
            <p class="work-heading font-weight-medium text-primary">WORK</p>
          </div>
        </div>
        <v-spacer></v-spacer>
        <div class="opacity-50 text-body-2 text-sm-body-1">
          <p>my code works</p>
          <p>i don'know why</p>
        </div>
      </div>
    </div>

    <!-- bilah kendali: jumlah karya + pemilih mode -->
    <v-divider></v-divider>
    <div class="d-flex align-center justify-space-between py-4">
      <p class="work-mono text-grey-darken-1">
        {{ String(projects.length).padStart(2, '0') }} WORK
      </p>

      <div class="d-flex align-center ga-2">
        <v-btn
          v-for="option in modes"
          :key="option.value"
          :aria-label="option.label"
          :title="option.label"
          :color="mode === option.value ? 'primary' : undefined"
          :class="mode === option.value ? undefined : 'text-grey-darken-1'"
          icon
          density="comfortable"
          :variant="mode === option.value ? 'text' : 'plain'"
          :ripple="false"
          @click="mode = option.value"
        >
          <v-icon :size="option.icon === 'mdi-view-array' ? 32 : 30" :icon="option.icon"></v-icon>
        </v-btn>
      </div>
    </div>
    <v-divider></v-divider>

    <!-- ---------- MODE CAROUSEL ---------- -->
    <template v-if="mode === 'carousel'">
      <v-window v-model="active" class="work-stage mt-8">
        <v-window-item v-for="(project, index) in projects" :key="project.title" :value="index">
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              v-bind="props"
              :href="projectUrl(project)"
              target="_blank"
              :border="isHovering"
              class="work-slide text-decoration-none"
            >
              <v-img :src="project.image" cover height="100%"></v-img>

              <!-- gradien agar teks tetap terbaca di atas gambar apa pun -->
              <div class="work-slide-scrim"></div>

              <div class="work-slide-caption">
                <p
                  class="text-h6 text-sm-h4 text-lg-h3 font-weight-medium text-white"
                  style="line-height: normal;"
                >
                  {{ project.title }}
                </p>
                <p class="work-mono text-grey">{{ project.category }}</p>
              </div>

              <!-- saat hover, seluruh gambar tertutup panel detail -->
              <v-expand-transition>
                <div v-if="isHovering" class="work-slide-detail">                  
                  <div
                    style="
                      width: 100%;
                      padding: 24px;
                    "
                    :class="$vuetify.display.smAndDown ? 'overflow-y-auto' : 'overflow-y-hidden'"
                  >
                    <div class="d-flex align-start justify-space-between ga-4">
                      <div>
                        <p class="work-mono text-primary mb-2">/{{ pad(index) }}</p>
                        <p
                          class="text-h6 text-sm-h4 text-lg-h3 font-weight-medium text-primary"
                          style="line-height: normal;"
                        >
                          {{ project.title }}
                        </p>
                        <p class="work-mono text-grey">{{ project.category }}</p>
                      </div>
                      <v-btn
                        icon="mdi-arrow-top-right"
                        :size="$vuetify.display.xs ? 'small' : 'large'"
                        variant="flat"
                        color="primary"
                      ></v-btn>
                    </div>

                    <v-divider class="my-4"></v-divider>

                    <div class="mb-4">
                      <p class="work-mono text-grey mb-1">INTRODUCTION.</p>
                      <p class="text-body-2 text-sm-body-1 text-white">{{ project.introduction }}</p>
                    </div>

                    <div class="mb-4">
                      <p class="work-mono text-grey mb-1">TECH.</p>
                      <p class="text-body-2 text-sm-body-1 text-white">{{ project.tech }}</p>
                    </div>

                    <!-- <div v-if="project.link?.length">
                      <p class="work-mono text-grey mb-1">LINK.</p>                      
                      <p class="text-body-2 text-primary">
                        {{ project.link.map((item) => item.label).join('  •  ') }}
                      </p>
                    </div> -->
                  </div>
                </div>
              </v-expand-transition>
            </v-card>
          </v-hover>
        </v-window-item>
      </v-window>

      <!-- penghitung, titik navigasi, tombol maju-mundur -->
      <div class="d-flex align-center justify-space-between mt-6 mt-md-8 ga-4">
        <p class="work-mono text-grey-darken-1">
          <span class="text-white text-h6 font-weight-medium">{{ pad(active) }}</span>
          <span class="mx-2 text-grey-darken-3">/</span>
          <span>{{ pad(projects.length - 1) }}</span>
        </p>

        <div v-if="$vuetify.display.mdAndUp" class="d-flex align-center ga-2">
          <button
            v-for="(project, index) in projects"
            :key="project.title"
            class="work-dot"
            :class="{ 'work-dot--active': index === active }"
            :aria-label="`Lihat ${project.title}`"
            @click="active = index"
          ></button>
        </div>

        <div class="d-flex align-center ga-2">
          <v-hover v-slot="{ isHovering, props }">
            <v-btn
              v-bind="props"
              icon="mdi-chevron-left"
              :variant="isHovering ? 'flat' : 'outlined'"
              color="white"            
              :size="$vuetify.display.xs ? 'small' : undefined"
              @click="step(-1)"
            ></v-btn>
          </v-hover>
          <v-hover v-slot="{ isHovering, props }">
            <v-btn
              v-bind="props"
              icon="mdi-chevron-right"
              :variant="isHovering ? 'flat' : 'outlined'"
              color="white"            
              :size="$vuetify.display.xs ? 'small' : undefined"
              @click="step(1)"
            ></v-btn>
          </v-hover>
        </div>
      </div>

      <!-- strip thumbnail: menggulung mendatar di HP, jadi grid di layar lebar -->
      <div class="work-thumbs mt-6 mt-md-8">
        <button
          v-for="(project, index) in projects"
          :key="project.title"
          class="work-thumb"
          :class="{ 'work-thumb--active': index === active }"
          :aria-label="`Lihat ${project.title}`"
          @click="active = index"
        >
          <v-img :src="project.image" cover height="100%"></v-img>
        </button>
      </div>
    </template>

    <!-- ---------- MODE GRID (2 kolom) ---------- -->
    <v-row v-else class="mt-5">
      <v-col
        v-for="(project, index) in projects"
        :key="project.title"
        cols="12"
        md="6"        
        lg="4"
      >
        <v-hover v-slot="{ isHovering, props }">
          <a
            v-bind="props"
            :href="projectUrl(project)"
            target="_blank"
            class="text-decoration-none d-block"
          >
            <div class="work-frame">
              <v-img
                :src="project.image"
                cover
                height="100%"
                class="work-frame-image"
                :class="{ 'work-frame-image--zoom': isHovering }"
              ></v-img>

              <v-btn
                icon="mdi-arrow-top-right"
                size="small"
                variant="flat"
                color="primary"
                class="work-frame-action"                
              ></v-btn>              
            </div>

            <div class="pt-3">
              <div class="d-flex align-start ga-2">
                <p class="text-white opacity-50">{{ pad(index) }}</p>
                <!-- flex-grow-1 wajib: tanpa ini pembungkusnya menyusut sepas isi
                     dan v-spacer di dalamnya tidak punya ruang untuk melebar -->
                <div class="d-flex align-center ga-2 flex-grow-1">
                  <div class="d-flex flex-column">
                    <p
                      class="font-weight-medium text-uppercase text-body-1 text-lg-h6"
                      :class="isHovering ? 'text-primary' : 'text-white'"
                    >
                      {{ project.title }}
                    </p>
                    <p
                      class="opacity-50 text-uppercase text-body-1 text-lg-h6 text-white"                    
                    >
                      {{ project.category }}
                    </p>
                    <p
                      class="opacity-50 text-uppercase text-body-1 text-lg-h6 text-white"                    
                    >
                      {{ project.tech }}
                    </p>
                  </div>
                  <v-spacer></v-spacer>
                  <div>
                    <v-fade-transition mode="out-in">
                      <v-btn
                        v-if="isHovering"
                        icon="mdi-arrow-top-right"
                        size="small"                        
                        variant="flat"
                        color="primary"
                      ></v-btn>
                    </v-fade-transition>
                  </div>
                </div>
                
              </div>
            </div>
          </a>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import ScrollTrigger from 'gsap/ScrollTrigger';

const projects = [
  {    
    title: "Mejaku",
    category: "SAAS / POINT OF SALE",
    tech: `Vue.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}MySQL${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Midtrans${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}AWS (S3)${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Resend${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}AI (Gemini)${"\u00A0"}${"\u00A0"}`,
    link: [
      { label: "Website", url: "https://mejaku.id" },
      { label: "Instagram", url: "https://www.instagram.com/mejakuid/" }
    ],
    image: "/projects/mejaku.png",
    introduction: "Mejaku is an AI-powered Software-as-a-Service (SaaS) Point of Sale platform designed to streamline F&B operations. It features an intelligent cashier module tailored for dine-in services and an integrated table management system that empowers customers to place direct orders via QR codes. Enhanced by AI capabilities (powered by Gemini), the platform goes beyond basic transactions to offer centralized multi-outlet management, comprehensive product and inventory control, visual analytics for business performance tracking, role-based staff authorization, and seamless hardware integration for thermal receipt printers and payment gateways.",
  },
  {    
    title: "Hello Crew",
    category: "PLATFORM",
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
    category: "SAAS / ERP",
    tech: `Vue.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}MySQL${"\u00A0"}${"\u00A0"}${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Webhook${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}AWS (S3)${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}AI (Gemini)${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Google Auth`,
    link: [
      { label: "Website", url: "https://hellocrew-sosm.sevenoceans.co.id" }
    ],
    image: "/projects/hellocrewenterprise.png",
    introduction: "\"The Crewing Agency Operation System\" - An AI-powered internal management platform tailored for shipping companies. While initial account registration occurs on the main Hello Crew hub, all core operational workflows—from job applications, sign-on/sign-off processes, and work record tracking, to performance evaluations—are fully managed within Hello Crew Enterprise. Enhanced by AI capabilities (powered by Gemini), the system streamlines complex crew management tasks and seamlessly transmits experience data and evaluations back to the main hub, ensuring seafarer reputations remain continuously and accurately updated.",
  },
  {
    title: "Plan Maintenance System",
    category: "SAAS / ERP / WEB APP",
    tech: `Vue.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Python${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}MySQL${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Leaflet${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}DeepL (Translation)${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}PWA${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Electron`,
    link: [
      { label: "Website", url: "https://pms.sevenoceans.co.id" }
    ],
    image: "/projects/pms.png",    
    introduction: "Plan Maintenance System (PMS) is an all-in-one platform designed to streamline maritime operations end to end—centralizing personnel onboard management, ship certificate tracking, real-time dashboards, and GPS-based visibility. It keeps crew duties, monitors every vessel certificate from issue to expiry with clear highlights for renewals, and provides live insights into ship condition, engine performance, and consumables through intuitive reporting. With GPS integration—augmented by ocean data such as weather and wave information—the PMS supports safer navigation, helping owners and operators boost compliance, efficiency, and decision-making across their fleets.",
  },
  {
    title: "SeaLinks",
    category: "MOBILE APP / LOGISTICS",
    tech: `Vue.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}MySQL${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Capacitor${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Firebase (Cloud Messaging)${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Pusher (Realtime Chat)`,
    link: null,
    image: "/projects/sealinks.webp",    
    introduction: "A mobile app (Android/IOS) for maritime industry. This app is offer and booking system between vessel owners and cargo owners. Features include vessel listing, booking management, chatting, and notifications. This app is designed to streamline the booking process and improve communication between vessel owners and cargo owners.",
  },
  {
    title: "PT Seven Oceans Technology Services",
    category: "COMPANY PROFILE / WEBGL",
    tech: `WebGL${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}GSAP${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Vue.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Vuetify${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel`,
    link: [
      { label: "Website", url: "https://sots.sevenoceans.co.id" }
    ],
    image: "/projects/sots.png",    
    introduction: "PT Seven Oceans Technology Services is a technology company focused on developing reliable and innovative digital solutions. We build and deliver custom-made software tailored to client needs or as ready-to-use products. With experience across multiple sectors from maritime and industrial to digital enterprise. We provide efficient, secure, and results oriented technology integration.",
  },  
  {
    title: "Seven Oceans Group",
    category: "COMPANY PROFILE",
    tech: `Vue.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Vuetify${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel`,
    link: [
      { label: "Website", url: "https://sevenoceans.co.id" }
    ],
    image: "/projects/sogcompro.png",    
    introduction: "Seven Oceans Group is a leading maritime company that provides comprehensive solutions for the maritime industry, including ship management, crew management, and vessel maintenance. The company is committed to providing innovative and efficient solutions to meet the needs of its clients and contribute to the growth of the maritime industry.",
  },
  {    
    title: "Roomar",
    category: "ECOMMERCE / WORDPRESS",
    tech: `Wordpress`,
    link: [
      { label: "Website", url: "https://roomarofficial.com" }
    ],
    image: "/projects/roomar.png",    
    introduction: "An e-commerce website for Roomar, a parfume and diffuser brand, to showcase and sell their products online.",
  },
  {    
    title: "Grha Pengharapan",
    category: "SAAS / ERP / ORGANIZATION",
    tech: `Vue.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}MySQL`,
    link: [
      { label: "Website", url: "https://grhapengharapan.org" }
    ],
    image: "/projects/grhapengharapan.png",    
    introduction: "A property management website for Grha Pengharapan Church to manage their organization data, events, and resources efficiently. Features include event scheduling, resource allocation, and member management.",
  },
];

const mode = ref('carousel');
const active = ref(0);

const modes = [
  { value: 'carousel', label: 'Carousel', icon: 'mdi-view-array' },
  { value: 'two', label: 'Compact', icon: 'mdi-view-comfy' },
];

const pad = (index) => String(index + 1).padStart(2, '0');
const projectUrl = (project) => project.link?.[0]?.url;

const step = (delta) => {
  const total = projects.length;
  active.value = (active.value + delta + total) % total;
};

const onKeydown = (e) => {
  if (mode.value !== 'carousel') return;
  if (e.key === 'ArrowLeft') step(-1);
  if (e.key === 'ArrowRight') step(1);
};

/* Berganti mode mengubah tinggi halaman drastis (carousel pendek, grid panjang),
   tapi Lenis dan ScrollTrigger menyimpan tinggi scroll lama sehingga halaman
   tidak bisa digulir sampai item terakhir. ScrollTrigger.refresh() menghitung
   ulang, dan layout default sudah menyambungkannya ke lenis.resize(). */
watch(mode, async () => {
  await nextTick();
  ScrollTrigger.refresh();
});

onMounted(() => window.addEventListener('keydown', onKeydown));
onUnmounted(() => window.removeEventListener('keydown', onKeydown));
</script>

<style scoped>
.work-mono {
  font-size: 0.7rem;  
  letter-spacing: 0.18em !important;
}

.work-heading {
  font-size: clamp(3rem, 8vw, 8rem);
  line-height: 0.85;
  letter-spacing: -0.05em !important;
}

/* ---------- carousel ---------- */

/* v-window tidak punya prop `height`; ukurannya harus lewat CSS. Tingginya
   diturunkan dari lebar lewat aspect-ratio, jadi panggung selalu 16:9. */
.work-stage {
  position: relative;
  aspect-ratio: 16 / 9;
  background: #0a0a0a;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* aspect-ratio hanya memberi tinggi USULAN — kotak `height: auto` tetap melar
   kalau isinya lebih tinggi. Container dijadikan absolut memenuhi kotak agar
   tingginya pasti, sekaligus jadi acuan supaya rantai `height: 100%` sampai ke
   v-img benar-benar terhitung dan gambar portrait tidak memanjangkan panggung. */
.work-stage :deep(.v-window__container) {
  position: absolute;
  inset: 0;
  height: auto;
}

.work-stage :deep(.v-window-item) {
  height: 100%;
}

.work-slide {
  position: relative;
  display: block;
  height: 100%;
}

/* panel detail yang menutupi seluruh gambar saat hover */
.work-slide-detail {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: rgba(0, 0, 0, 0.88);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: stretch;
}

.work-slide-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.2) 50%,
    transparent 100%
  );
  pointer-events: none;
}

.work-slide-caption {
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 24px;
}

@media (min-width: 960px) {
  .work-slide-caption {
    left: 40px;
    right: 40px;
    bottom: 40px;
  }
}

.work-dot {
  height: 4px;
  width: 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.5s ease;
  cursor: pointer;
}

.work-dot:hover {
  background: white;
}

.work-dot--active {
  width: 32px;
  background: white;
}

/* di HP menggulung mendatar dengan snap, di layar lebar jadi satu baris grid */
.work-thumbs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 16px;
}

.work-thumbs::-webkit-scrollbar {
  display: none;
}

.work-thumb {
  position: relative;
  flex: 0 0 auto;
  width: 96px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  scroll-snap-align: start;
  border: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0.5;
  transition: all 0.5s ease;
  cursor: pointer;
}

.work-thumb:hover {
  opacity: 1;
  border-color: rgba(255, 255, 255, 0.3);
}

.work-thumb--active {
  opacity: 1;
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 1px rgba(var(--v-theme-primary), 0.3);
}

/* Di layar lebar semua thumbnail masuk satu baris. grid-auto-flow: column +
   grid-auto-columns: 1fr membagi lebar rata berapa pun jumlah proyeknya, jadi
   tidak ada angka kolom yang perlu diubah saat menambah karya. Tingginya
   dipatok agar strip tetap jadi navigasi kecil, tidak ikut membesar
   mengikuti lebar layar. */
@media (min-width: 960px) {
  .work-thumbs {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    height: 72px;
    overflow: visible;
    padding-bottom: 0;
  }

  .work-thumb {
    width: auto;
    height: 100%;
    aspect-ratio: auto;
  }
}

@media (min-width: 1280px) {
  .work-thumbs {
    height: 84px;
  }
}

/* ---------- grid ---------- */

.work-frame {
  position: relative;
  overflow: hidden;
  aspect-ratio: 3 / 2;
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.work-frame-image {
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.work-frame-image--zoom {
  transform: scale(1.1);
}
</style>
