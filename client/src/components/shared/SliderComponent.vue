<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation, Pagination } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const props = defineProps({
  slides: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <Swiper
    v-if="props.slides.length"
    :centeredslides="true"
    :autoplay="{ delay: 4000, disableOnInteraction: false }"
    :navigation="true"
    :pagination="{ clickable: true }"
    :loop="true"
    :modules="[Autoplay, Navigation, Pagination]"
    class="border-b-2 border-tertiary-dark"
  >
    <SwiperSlide v-for="slide in props.slides" :key="slide.id">
      <div class="relative h-[350px] lg:h-[700px]">
        <div class="absolute top-1/2 left-1/2 z-50 flex w-3/4 -translate-x-1/2 -translate-y-1/2 flex-col text-center">
          <span
            class="text-stroke-2 text-3xl font-extrabold uppercase text-secondary-light drop-shadow-navlink md:text-4xl md:drop-shadow-items"
          >
            {{ slide.secondary_text }}
          </span>
          <span class="text-stroke-2 text-4xl font-extrabold uppercase text-primary-light drop-shadow-items sm:text-6xl md:text-8xl">
            {{ slide.primary_text }}
          </span>
        </div>
        <img :src="slide.image" alt="noticia" class="z-40 h-full w-full object-cover" loading="lazy" />
      </div>
    </SwiperSlide>
  </Swiper>
</template>
