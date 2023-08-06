<script setup>
import { ref, onMounted } from "vue";
import { getSlides } from "@/supabase/helpers.js";

import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import CommonSettings from "@/components/admin/CommonSettings.vue";
import PriceChanger from "@/components/admin/PriceChanger.vue";
import CreateSlide from "@/components/admin/CreateSlide.vue";
import SlidesTable from "@/components/admin/SlidesTable.vue";

const loading = ref(false);

const slides = ref();

async function fetchSlides() {
  loading.value = true;
  slides.value = await getSlides();
  loading.value = false;
}

onMounted(() => {
  fetchSlides();
});
</script>

<template>
  <div class="container mx-auto p-5">
    <LoadingSpinner v-if="loading" />
    <div v-else class="flex flex-col gap-5">
      <CommonSettings />
      <PriceChanger />
      <CreateSlide @created="fetchSlides()" />
      <SlidesTable v-if="slides" :slides="slides" @deleted="fetchSlides()" />
    </div>
  </div>
</template>
