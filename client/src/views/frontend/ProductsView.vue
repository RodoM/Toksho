<script setup>
import { onMounted } from "vue";
import useProductPagination from "@/lib/composables/paginationHelper.js";

import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import SearchAndFilter from "@/components/shared/filters/SearchAndFilter.vue";
import ProductList from "@/components/shared/products/ProductList.vue";
import PaginationComponent from "@/components/shared/PaginationComponent.vue";

// Pagination
const { loading, productsData, productsFunctions, pagination, pagesFunctions } =
  useProductPagination();

onMounted(async () => {
  loading.value = true;
  productsFunctions.fetchProducts();
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>

<template>
  <div class="container py-5 mx-auto">
    <div class="mx-5">
      <SearchAndFilter
        v-show="!loading"
        :productsPerPage="pagination.productsPerPage"
        :totalProducts="productsData.count.value"
        :productsInPage="pagination.offset + pagination.productsPerPage + 1"
        @fetchWithFilters="productsFunctions.fetchProducts"
        @clearFilters="productsFunctions.clearFilters"
      />
      <LoadingSpinner v-if="loading" />
      <div v-else-if="!loading && productsData.count.value > 0">
        <ProductList :products="productsData.products.value" />
        <PaginationComponent
          v-show="!loading"
          class="mt-10"
          :count="productsData.count.value"
          :paginationData="pagination"
          @prevPage="pagesFunctions.prevPage"
          @nextPage="pagesFunctions.nextPage"
          @goToPage="pagesFunctions.goToPage"
        />
      </div>
      <div
        v-else
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
  </div>
</template>
