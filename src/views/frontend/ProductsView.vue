<script setup>
import { onMounted, ref } from "vue";

import sbHelpers from "@/supabase/helpers.js";

import ProductList from "@/components/shared/products/ProductList.vue";
import ProductSearchOptions from "@/components/shared/filters/ProductSearchOptions.vue";
import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";

const products = ref([]);
const loading = ref(false);

async function fetchProducts() {
  loading.value = true;
  products.value = await sbHelpers.getAllProducts();
  loading.value = false;
}

onMounted(async () => {
  loading.value = true;
  fetchProducts();
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

const initialOrder = ref({
  orderOption: { name: "Ordernar por...", value: "id" },
  ascOption: { name: "Descendiente", value: false },
});

async function orderProducts(order, isAscending) {
  loading.value = true;
  initialOrder.value.orderOption = order;
  initialOrder.value.ascOption = isAscending;
  products.value = await sbHelpers.orderProductsBy(
    initialOrder.value.orderOption.value,
    initialOrder.value.ascOption.value
  );
  loading.value = false;
}
</script>

<template>
  <div class="container mx-auto my-5 overflow-y-hidden">
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
    <ProductSearchOptions
      :order="initialOrder"
      @orderOptions="orderProducts"
      @clearOrderOptio="fetchProducts"
    />
    <LoadingSpinner v-if="loading" />
    <ProductList
      v-if="!loading && products"
      :products="products"
      class="h-full"
    />
    <div
      v-if="!loading && products.length == 0"
      class="absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
    >
      <span class="material-icons-outlined !text-9xl text-primary">
        search_off
      </span>
      <span class="text-xl font-medium">Sin resultados</span>
      <span class="font-medium text-center min-w-[335px]"
        >No se encontraron resultados con los datos especificados.</span
      >
    </div>
  </div>
</template>
