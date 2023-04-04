<script setup>
import { ref, onMounted } from "vue";
import { getNews } from "@/supabase/helpers.js";

import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";

const news = ref();

const fetchNews = async () => {
  news.value = await getNews();
};

onMounted(async () => {
  fetchNews();
});
</script>

<template>
  <div class="container p-5 mx-auto">
    <header-title>
      <span class="text-2xl font-bold uppercase">{{ $route.meta.label }}</span>
    </header-title>
  </div>
</template>
