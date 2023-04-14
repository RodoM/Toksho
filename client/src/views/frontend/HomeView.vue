<script setup>
import { onMounted, ref } from "vue";

import { getNovelties, getPresales, getNews } from "@/supabase/helpers.js";

import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

import { Autoplay, Navigation, Pagination } from "swiper";
import "swiper/css/navigation";
import "swiper/css/pagination";

import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import ProductList from "@/components/shared/products/ProductList.vue";
import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";

const novelties = ref();
const presales = ref();
const loading = ref(false);
const news = ref();

onMounted(async () => {
  loading.value = true;
  news.value = await getNews();
  novelties.value = await getNovelties();
  presales.value = await getPresales();
  loading.value = false;
});
</script>

<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <div v-else>
      <Swiper
        :centeredslides="true"
        :autoplay="{ delay: 4000, disableOnInteraction: false }"
        :navigation="true"
        :pagination="{
          clickable: true,
        }"
        :loop="true"
        :modules="[Autoplay, Navigation, Pagination]"
        class="border-b-2 border-tertiary-dark"
      >
        <SwiperSlide v-for="n in news" :key="n.id">
          <div class="relative h-[600px] lg:h-[700px]">
            <div
              class="absolute z-50 flex flex-col w-3/4 text-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            >
              <span
                class="text-2xl font-extrabold uppercase text-stroke-2 text-secondary-light drop-shadow-navlink md:drop-shadow-items md:text-4xl"
              >
                {{ n.text.smallText }}
              </span>
              <span
                class="text-4xl font-extrabold uppercase sm:text-6xl text-stroke-2 text-primary-light drop-shadow-items md:text-8xl"
              >
                {{ n.text.bigText }}
              </span>
            </div>
            <img
              :src="n.image"
              alt="noticia"
              class="z-40 object-cover w-full h-full blur-sm"
              loading="lazy"
            />
          </div>
        </SwiperSlide>
      </Swiper>
      <div class="container flex flex-col items-center mx-auto my-5 gap-y-20">
        <div class="flex flex-col items-center w-full gap-y-10">
          <header-title>
            <span class="text-2xl font-bold">NOVEDADES</span>
          </header-title>
          <ProductList v-if="novelties" :products="novelties" class="px-5" />
        </div>
        <content-block>
          <header-title class="self-center">
            <span class="text-2xl font-bold">PREVENTA</span>
          </header-title>
          <ProductList v-if="presales" :products="presales" class="px-5" />
        </content-block>
        <div
          class="grid grid-cols-2 gap-3 mx-5 place-items-center md:grid-cols-4"
        >
          <img src="@/assets/images/ivrea.png" alt="ivrea" class="grayscale" />
          <img
            src="@/assets/images/panini.png"
            alt="panini"
            class="grayscale"
          />
          <img
            src="@/assets/images/planeta-comic.png"
            alt="planeta-comic"
            class="grayscale"
          />
          <img src="@/assets/images/ovni.png" alt="ovni" class="grayscale" />
        </div>
        <div class="w-full px-5">
          <iframe
            title="google map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3355.85120910867!2d-60.73914318441111!3d-32.74314138098227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b65b5764fd94f3%3A0xf1c310865ef199a8!2sTOKSHO%20COMIC!5e0!3m2!1ses-419!2sar!4v1676674481705!5m2!1ses-419!2sar"
            allowfullscreen="false"
            referrerpolicy="no-referrer-when-downgrade"
            class="w-full border-2 h-96 lg:h-[600px] border-tertiary-dark drop-shadow-items"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.swiper-button-prev,
.swiper-button-next {
  color: #0f0f0f;
}
.swiper-button-prev::after,
.swiper-button-next::after {
  background-color: #eeba5e;
  padding: 4px 10px;
  border: 2px solid #0f0f0f;
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 1);

  font-size: 24px;
  font-weight: 800;
}

.swiper-pagination-bullet {
  background: #eeba5e;
  border: 2px solid #0f0f0f;
  width: 12px;
  height: 12px;
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 1);
}

.text-stroke-1 {
  -webkit-text-stroke: 1px white;
}

.text-stroke-2 {
  -webkit-text-stroke: 2px white;
}
</style>
