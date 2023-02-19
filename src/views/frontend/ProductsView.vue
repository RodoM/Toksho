<script setup>
import ProductList from "@/components/shared/products/ProductList.vue";
import ProductFilter from "@/components/shared/filters/ProductFilter.vue";

import { productStore } from "@/stores/db-test";

const store = productStore();
</script>

<template>
  <div class="container mx-auto my-5">
    <div class="flex mx-5 border-2 border-tertiary-dark drop-shadow-items">
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
    <ProductFilter />
    <ProductList :products="store.products" />
  </div>
</template>
