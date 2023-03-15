<script setup>
import { onMounted, ref } from "vue";

import sbHelpers from "@/supabase/helpers.js";

import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

import { Autoplay, Navigation, Pagination } from "swiper";
import "swiper/css/navigation";
import "swiper/css/pagination";

import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import ProductList from "@/components/shared/products/ProductList.vue";
import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";

const products = ref([]);
const novelties = ref([]);
const presales = ref([]);
const loading = ref(false);
const photos = [
  "https://images.unsplash.com/photo-1588497859490-85d1c17db96d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1620336655052-b57986f5a26a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1628426912206-d88e22da5c76?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
];

onMounted(async () => {
  loading.value = true;
  const results = await Promise.all([
    sbHelpers.getAllProducts(),
    sbHelpers.getNovelties(),
    sbHelpers.getPresales(),
  ]);
  products.value = results[0];

  results[1].forEach((product) => {
    novelties.value.push(product.Products);
  });

  results[2].forEach((product) => {
    presales.value.push(product.Products);
  });

  loading.value = false;
});
</script>

<template>
  <div>
    <Swiper
      :centeredslides="true"
      :autoplay="{ delay: 4000, disableOnInteraction: false }"
      :navigation="true"
      :pagination="{
        clickable: true,
      }"
      :loop="true"
      :modules="[Autoplay, Navigation, Pagination]"
    >
      <SwiperSlide v-for="(photo, i) in photos" :key="i">
        <div class="relative h-[600px] lg:h-[700px]">
          <span
            class="absolute p-5 text-5xl font-bold -translate-x-1/2 -translate-y-1/2 border-2 border-tertiary-dark drop-shadow-items bg-primary top-1/2 left-1/2"
            >Slide {{ i + 1 }}</span
          >
          <img :src="photo" alt="" class="z-40 object-cover w-full h-full" />
        </div>
      </SwiperSlide>
    </Swiper>
    <div
      class="flex justify-center p-5 bg-secondary-light border-y-2 border-tertiary-dark"
    >
      <div
        class="flex items-center w-full border-2 border-tertiary-dark drop-shadow-items"
      >
        <input
          type="text"
          placeholder="Busqueda..."
          class="w-full p-2 focus:outline-none"
        />
        <button
          class="p-2 border-l-2 material-icons-outlined border-tertiary-dark bg-primary-light"
        >
          search
        </button>
      </div>
    </div>
    <div class="container flex flex-col items-center mx-auto my-5 gap-y-5">
      <header-title>
        <span class="text-2xl font-bold">NOVEDADES</span>
      </header-title>
      <ProductList :products="novelties" />
      <content-block>
        <header-title class="self-center">
          <span class="text-2xl font-bold">PREVENTA</span>
        </header-title>
        <ProductList :products="presales" class="mt-5" />
      </content-block>
      <header-title>
        <span class="text-2xl font-bold">NUESTRO LOCAL</span>
      </header-title>
      <div class="w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3355.85120910867!2d-60.73914318441111!3d-32.74314138098227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b65b5764fd94f3%3A0xf1c310865ef199a8!2sTOKSHO%20COMIC!5e0!3m2!1ses-419!2sar!4v1676674481705!5m2!1ses-419!2sar"
          allowfullscreen="false"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          class="w-full border-2 h-96 lg:h-[600px] border-tertiary-dark drop-shadow-items"
        ></iframe>
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
</style>
