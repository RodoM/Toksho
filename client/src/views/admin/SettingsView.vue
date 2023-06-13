<script setup>
import { ref, onMounted } from "vue";
import { getSlides } from "@/supabase/helpers.js";

import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";
import CommonSettings from "@/components/admin/CommonSettings.vue";
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
  <div class="container p-5 mx-auto">
    <LoadingSpinner v-if="loading" />
    <div v-else>
      <content-block class="px-5 gap-y-5">
        <header-title>
          <span class="text-2xl font-bold">CONFIGURACIONES</span>
        </header-title>
        <CommonSettings />
      </content-block>

      <content-block class="px-5 mt-5 gap-y-5">
        <header-title>
          <span class="text-2xl font-bold">DIAPOSITIVAS</span>
        </header-title>
        <CreateSlide @created="fetchSlides()" />
      </content-block>

      <SlidesTable v-if="slides" :slides="slides" @deleted="fetchSlides()" />
    </div>
  </div>
</template>
