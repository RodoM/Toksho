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
        <div
          class="absolute z-50 flex flex-col w-3/4 text-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
        >
          <span
            class="text-2xl font-extrabold uppercase text-stroke-2 text-secondary-light drop-shadow-navlink md:drop-shadow-items md:text-4xl"
          >
            {{ slide.text.smallText }}
          </span>
          <span
            class="text-4xl font-extrabold uppercase sm:text-6xl text-stroke-2 text-primary-light drop-shadow-items md:text-8xl"
          >
            {{ slide.text.bigText }}
          </span>
        </div>
        <img
          :src="slide.image"
          alt="noticia"
          class="z-40 object-cover w-full h-full"
          loading="lazy"
        />
      </div>
    </SwiperSlide>
  </Swiper>
</template>
