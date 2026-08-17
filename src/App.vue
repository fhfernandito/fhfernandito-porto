<template>
  <v-app>
    <!-- <ParticleBackground /> -->
    <!-- <OilFluidCursor v-if="mdAndUp" /> -->
    <CircleCursor v-if="mdAndUp" />
    <router-view />
    <RouteTransition />
  </v-app>
</template>

<script setup>
import { useDisplay } from "vuetify";
import RouteTransition from "@/components/RouteTransition.vue";
import OilFluidCursor from "@/components/feature/OilFluidCursor.vue";
import CircleCursor from "@/components/feature/CircleCursor.vue";
import ParticleBackground from "@/components/feature/ParticleBackground.vue";

const { mdAndUp } = useDisplay();
</script>
