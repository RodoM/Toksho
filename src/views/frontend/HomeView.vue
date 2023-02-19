<script setup>
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import ProductList from "@/components/shared/products/ProductList.vue";
import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";

import { productStore } from "@/stores/db-test";

const store = productStore();
</script>

<template>
  <div>
    <div class="w-full bg-slate-400 h-96">slider</div>
    <div
      class="flex justify-center p-5 bg-secondary-light border-y-2 border-tertiary-dark"
    >
      <div
        class="flex items-center border-2 border-tertiary-dark drop-shadow-items"
      >
        <!-- Ver si se puede aislar en un componente el input, tener en cuenta el v-model -->
        <input
          type="text"
          placeholder="Busqueda..."
          class="p-2 focus:outline-none"
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
      <ProductList :products="store.news" />
      <content-block>
        <header-title class="self-center">
          <span class="text-2xl font-bold">PREVENTA</span>
        </header-title>
        <ProductList :products="store.preSale" class="mt-5" />
      </content-block>
      <header-title>
        <span class="text-2xl font-bold">NUESTRO LOCAL</span>
      </header-title>
      <div class="w-full px-5">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3355.85120910867!2d-60.73914318441111!3d-32.74314138098227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b65b5764fd94f3%3A0xf1c310865ef199a8!2sTOKSHO%20COMIC!5e0!3m2!1ses-419!2sar!4v1676674481705!5m2!1ses-419!2sar"
          allowfullscreen="false"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          class="w-full border-2 h-96 border-tertiary-dark drop-shadow-items"
        ></iframe>
      </div>
    </div>
  </div>
</template>
