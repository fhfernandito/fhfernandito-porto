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
                <p class="work-mono text-grey mt-1">{{ project.category }}</p>
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
                        <p class="work-mono text-primary mb-1">{{ pad(index) }}</p>
                        <p
                          class="text-h6 text-sm-h4 text-lg-h3 font-weight-medium text-primary"
                          style="line-height: normal;"
                        >
                          {{ project.title }}
                        </p>
                        <p class="work-mono text-grey mt-1">{{ project.category }}</p>
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
              :variant="isHovering ? 'outlined' : 'text'"
              color="white"            
              border
              :size="$vuetify.display.xs ? 'small' : undefined"
              @click="step(-1)"
            ></v-btn>
          </v-hover>
          <v-hover v-slot="{ isHovering, props }">
            <v-btn
              v-bind="props"
              icon="mdi-chevron-right"
              :variant="isHovering ? 'outlined' : 'text'"
              color="white"
              border
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
    title: "Fleety",
    category: "SAAS / FLEET TRACKING / GEOSPATIAL",
    tech: `Nuxt.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Pinia${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Python (FastAPI)${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}PostgreSQL${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}PostGIS${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}MapLibre GL${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Vector Tiles${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}NOAA Data`,
    link: null,
    image: "/projects/fleety.png",
    introduction: "An AIS-based tracking platform that follows commercial fleets across open sea. Live vessel positions and historical tracks render on an interactive 3D globe and on vector-tile sea charts, so operators can watch a shipment move from port to port. The hard part is routing. A straight line between two ports runs aground, so the water itself is modelled as a graph in PostGIS and a dedicated Python service runs Dijkstra across it, weighing bathymetry data so the shortest path returned is one the vessel can actually sail.",
  },
  {
    title: "Mejaku",
    category: "SAAS / POINT OF SALE",
    tech: `Vue.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Vuetify${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Pinia${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}MySQL${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}PWA${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Midtrans${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}AWS (S3)${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Resend${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}AI (Gemini)${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}QR Code${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Chart.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}ExcelJS${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}WebBluetooth / WebUSB (Receipt Printer)`,
    link: [
      { label: "Website", url: "https://mejaku.id" },
      { label: "Instagram", url: "https://www.instagram.com/mejakuid/" },
    ],
    image: "/projects/mejaku.png",
    introduction: "An AI-assisted point-of-sale platform for F&B businesses. Diners order straight from their table by scanning a QR code while staff run the floor through a cashier and table-management module built for dine-in service. Behind it sits multi-outlet management, product and inventory control, role-based staff access, sales analytics, and spreadsheet exports. Receipts print over Web Bluetooth and WebUSB, so a thermal printer works directly from the browser with no driver to install.",
  },
  {
    title: "Hello Crew",
    category: "PLATFORM / IDENTITY PROVIDER / OAUTH",
    tech: `Nuxt.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Pinia${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel Passport${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}MySQL${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Webhook${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}AWS (S3)${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Resend${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Chart.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Google Auth`,
    link: [
      { label: "Website", url: "https://hellocrew.id" },
      { label: "TikTok 1", url: "https://vt.tiktok.com/ZS9hDrjFY/" },
      { label: "TikTok 2", url: "https://vt.tiktok.com/ZS9YxbDPL/" },
    ],
    image: "/projects/hellocrew.png",
    introduction: "The global seafarer hub — a career portal, a central crew database, and the identity layer every other product in the ecosystem is built on. More than 1,000 seafarers have registered so far, each building a profile and uploading the documents and certificates their career depends on; from there they see every vacancy posted by shipping companies across the network. The account itself is the product: Hello Crew runs as an OAuth 2.0 provider on Laravel Passport, so one seafarer login becomes \"Sign in with Hello Crew\" across the workspace of every shipping company on the platform — one identity, many employers, no profile rebuilt from scratch each time someone changes ship. Automated email keeps applicants informed at each stage, and analytics dashboards show recruiters where their pipeline actually stands.",
  },
  {
    title: "Hello Crew Enterprise",
    category: "SAAS / ERP",
    tech: `Vue.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Vuetify${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Vue I18n${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}MySQL${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}OAuth 2.0 (Hello Crew SSO)${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Webhook${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}AWS (S3)${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}AI (Gemini)${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Google Auth${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Resend${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Leaflet${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Quill${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}PDFMake${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}PDF Parser${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}ExcelJS`,
    link: [
      { label: "Website", url: "https://hellocrew-sosm.sevenoceans.co.id" },
    ],
    image: "/projects/hellocrewenterprise.png",
    introduction: "The operating system for crewing agencies, running as an OAuth client of the Hello Crew hub. Crew sign in with the Hello Crew account they already have — no new credentials for each shipping company they work for — and every workflow after that lives here: job applications, sign-on and sign-off, sea-service records, and performance evaluations. Gemini reads crew data straight out of uploaded PDF documents so nobody retypes a certificate by hand, the interface serves crews of mixed nationalities in their own language, and operational reports export to PDF and Excel. Completed contracts and evaluations sync back to the hub, so a seafarer's record follows them from one company to the next instead of dying inside a single employer's database.",
  },
  {
    title: "Plan Maintenance System",
    category: "SAAS / ERP / WEB APP",
    tech: `Vue.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Vuetify${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Express.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Python${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}MySQL${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}PWA${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}MapLibre GL${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}PMTiles${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Leaflet${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}PixiJS${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Turf.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}AWS SDK${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}DeepL (Translation)`,
    link: [
      { label: "Website", url: "https://pms.sevenoceans.co.id" },
    ],
    image: "/projects/pms.png",
    introduction: "A planned maintenance system running in production across a 20-vessel fleet, handling operations from one place: crew onboard, ship certificates, engine performance, and consumables. Every certificate is tracked from issue to expiry and flagged before renewal falls due — the difference between a compliant vessel and a detained one. Positions are drawn on offline-capable vector maps built from PMTiles so the map still works at sea, a dedicated service ingests ocean data such as weather and wave conditions, and any screen translates on the fly for multinational crews.",
  },
  {
    title: "SeaLinks",
    category: "MOBILE APP / LOGISTICS",
    tech: `Vue.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Vuetify${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}MySQL${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Capacitor${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Biometric Auth${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Secure Storage${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Firebase (Cloud Messaging)${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Pusher${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel Echo${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}PDFMake`,
    link: null,
    image: "/projects/sealinks.webp",
    introduction: "A cross-platform mobile app for Android and iOS that connects vessel owners with cargo owners. Owners list available vessels, cargo owners send offers, and both sides negotiate through realtime chat backed by Pusher and Laravel Echo, with push notifications delivered over Firebase Cloud Messaging. Sign-in runs on fingerprint or Face ID with credentials held in encrypted device storage, so crews get back into the app in seconds without weakening the account behind it.",
  },  
  {
    title: "SOERP",
    category: "ERP / INTERNAL SYSTEM",
    tech: `Vue.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}PrimeVue${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Tailwind CSS${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Pinia${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}MySQL${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Quill${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}ExcelJS${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}PDFMake`,
    link: [
      { label: "Website", url: "https://soerp.sevenoceans.co.id" },
    ],
    image: "/projects/soerp.png",
    introduction: "An internal ERP that runs a company's day-to-day back office in a single system: employee records, an issue ticketing workflow, work-in-progress tracking, purchasing, and finance reporting. Every module exports to Excel and PDF, so each department keeps working in the format it already uses instead of bending its process around the software.",
  },
  {
    title: "PT Seven Oceans Technology Services",
    category: "COMPANY PROFILE / WEBGL",
    tech: `Three.js (WebGL)${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Postprocessing${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Simplex Noise${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}PixiJS${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}GSAP${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Lenis${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Vue.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Vuetify${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel`,
    link: [
      { label: "Website", url: "https://sots.sevenoceans.co.id" },
    ],
    image: "/projects/sots.png",
    introduction: "A company profile built as a real-time WebGL scene rather than a page. Three.js renders the visuals through custom postprocessing passes and simplex-noise driven motion, GSAP choreographs the storytelling, and Lenis smooths the scroll so the whole thing reads as one continuous shot. The result presents a maritime technology company as something you move through instead of something you read.",
  },
  {
    title: "Seven Oceans Group",
    category: "COMPANY PROFILE",
    tech: `Vue.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Vuetify${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Pinia${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}GSAP${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Lenis${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Swiper${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel`,
    link: [
      { label: "Website", url: "https://sevenoceans.co.id" },
    ],
    image: "/projects/sogcompro.png",
    introduction: "A company profile for a maritime group working across ship management, crew management, and vessel maintenance. Each subsidiary and service line is presented through scroll-driven sequences and image galleries, with every piece of content served from a Laravel backend so the marketing team can keep the site current without touching code.",
  },
  {
    title: "Roomar",
    category: "ECOMMERCE / WORDPRESS",
    tech: `Wordpress`,
    link: [
      { label: "Website", url: "https://roomarofficial.com" },
    ],
    image: "/projects/roomar.png",
    introduction: "An online store for Roomar, a perfume and diffuser brand moving its catalogue from social media to a storefront it owns. Built on WordPress so the owner can add products, adjust pricing, and run promotions without a developer in the loop — the right call for a small catalogue that changes far more often than it grows.",
  },
  {
    title: "Grha Pengharapan",
    category: "SAAS / ERP / ORGANIZATION",
    tech: `Vue.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Vuetify${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Pinia${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Laravel Passport${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}MySQL${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Twilio${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}Chart.js${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}ExcelJS${"\u00A0"}${"\u00A0"}•${"\u00A0"}${"\u00A0"}jsPDF`,
    link: [
      { label: "Website", url: "https://grhapengharapan.org" },
    ],
    image: "/projects/grhapengharapan.png",
    introduction: "A management system for a church in Pati, Central Java, covering everything that keeps a congregation running. It schedules worship services and assigns the teams behind them — worship leaders, singers, musicians — publishes weekly bulletins and daily devotionals, opens event registration to members, and keeps the treasury accountable with income and expense records. Automated messaging reaches members the moment a schedule changes, and reports export to Excel or PDF, replacing the spreadsheets and group chats the office used to run on.",
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
