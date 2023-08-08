<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { itemsStore } from "@/stores/shoppingCart.js";
import { getNovelties, getPresales, getSlides } from "@/supabase/helpers.js";

import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import SliderComponent from "../../components/shared/SliderComponent.vue";
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import ProductList from "@/components/shared/products/ProductList.vue";
import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";

const router = useRouter();
const itemStore = itemsStore();

const novelties = ref();
const presales = ref();
const slides = ref([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  novelties.value = await getNovelties();
  presales.value = await getPresales();
  slides.value = await getSlides();

  if (router.currentRoute.value.query.collection_status === "approved") {
    itemStore.clearItems();
  }

  loading.value = false;
});
</script>

<template>
  <div>
    <LoadingSpinner v-if="loading" />
    <div v-else>
      <SliderComponent :slides="slides" />
      <div class="container mx-auto my-5 flex flex-col items-center gap-y-20">
        <div v-if="novelties" class="flex w-full flex-col items-center gap-y-10">
          <header-title>
            <span class="text-2xl font-bold">NOVEDADES</span>
          </header-title>
          <ProductList :products="novelties" class="px-5" />
        </div>
        <content-block v-if="presales">
          <header-title class="self-center">
            <span class="text-2xl font-bold">PREVENTA</span>
          </header-title>
          <ProductList :products="presales" class="px-5" />
        </content-block>
        <div class="mx-5 grid grid-cols-2 place-items-center gap-3 md:grid-cols-4">
          <img src="@/assets/images/ivrea.png" alt="ivrea" class="grayscale" />
          <img src="@/assets/images/panini.png" alt="panini" class="grayscale" />
          <img src="@/assets/images/planeta-comic.png" alt="planeta-comic" class="grayscale" />
          <img src="@/assets/images/ovni.png" alt="ovni" class="grayscale" />
        </div>
        <div class="w-full px-5">
          <iframe
            title="google map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3355.85120910867!2d-60.73914318441111!3d-32.74314138098227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b65b5764fd94f3%3A0xf1c310865ef199a8!2sTOKSHO%20COMIC!5e0!3m2!1ses-419!2sar!4v1676674481705!5m2!1ses-419!2sar"
            allowfullscreen="false"
            referrerpolicy="no-referrer-when-downgrade"
            class="h-96 w-full border-2 border-tertiary-dark drop-shadow-items lg:h-[600px]"
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
