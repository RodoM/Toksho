<script setup>
import { onMounted, ref } from "vue";

import sbHelpers from "@/supabase/helpers.js";

import ProductList from "@/components/shared/products/ProductList.vue";
import ProductFilter from "@/components/shared/filters/ProductFilter.vue";
import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";

const products = ref([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  products.value = await sbHelpers.getAllProducts();
  loading.value = false;
});

const searchInput = ref("");

async function searchProducts() {
  loading.value = true;
  if (searchInput.value.length > 0) {
    products.value = await sbHelpers.searchProducts(searchInput.value);
  } else {
    products.value = await sbHelpers.getAllProducts();
  }
  loading.value = false;
}
</script>

<template>
  <div class="container mx-auto my-5">
    <div class="flex mx-5 border-2 border-tertiary-dark drop-shadow-items">
      <input
        v-model="searchInput"
        type="text"
        placeholder="Busqueda..."
        class="w-full p-2 focus:outline-none"
        @keyup.enter="searchProducts()"
      />
      <button
        class="p-2 border-l-2 material-icons-outlined border-tertiary-dark bg-primary-light"
        @click="searchProducts()"
      >
        search
      </button>
    </div>
    <ProductFilter />
    <LoadingSpinner v-if="loading" />
    <ProductList
      v-if="!loading && products"
      :products="products"
      class="h-full"
    />
  </div>
</template>
