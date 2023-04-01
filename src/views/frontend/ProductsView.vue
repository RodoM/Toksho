<script setup>
import { onMounted, ref } from "vue";
import { getAllProducts } from "@/supabase/helpers.js";

import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import SearchAndFilter from "@/components/shared/filters/SearchAndFilter.vue";
import ProductList from "@/components/shared/products/ProductList.vue";
import PaginationComponent from "@/components/shared/PaginationComponent.vue";

// Fetching products
const products = ref([]);
const filter = ref({
  name: undefined,
  type: undefined,
  author: undefined,
  categorie: undefined,
  order: "created_at",
  asc: true,
});
const count = ref(0);
const loading = ref(false);

// Guardar filtro para cuando haya paginacion en filtrado se mantenga al cambiar de pagina.

async function fetchProducts(name, type, author, categorie, order, asc) {
  if (name != undefined) filter.value.name = name;
  if (type) filter.value.type = type;
  if (author) filter.value.author = author;
  if (categorie) filter.value.categorie = categorie;
  if (order) filter.value.order = order;
  if (asc) filter.value.asc = asc;
  loading.value = true;
  const res = await getAllProducts(
    offset.value,
    limit.value,
    filter.value.name,
    filter.value.type,
    filter.value.author,
    filter.value.categorie,
    filter.value.order,
    filter.value.asc
  );
  products.value = res.data;
  count.value = res.count;
  loading.value = false;
}

const clearFilters = async () => {
  filter.value.type = undefined;
  filter.value.author = undefined;
  filter.value.categorie = undefined;
  filter.value.order = "created_at";
  filter.value.asc = true;
  await fetchProducts();
};

// Pagination
const productsPerPage = ref(23);
const offset = ref(0);
const limit = ref(productsPerPage.value);

const prevPage = async () => {
  limit.value = offset.value - 1;
  if (offset.value - productsPerPage.value > 0) {
    offset.value -= productsPerPage.value + 1;
  } else {
    offset.value = 0;
  }
  await fetchProducts();
};

const nextPage = async () => {
  offset.value = limit.value + 1;
  if (limit.value + productsPerPage.value < count.value) {
    limit.value += productsPerPage.value + 1;
  } else {
    limit.value = count.value;
  }
  await fetchProducts();
};

const goToPage = async (page) => {
  if (page == 1) {
    limit.value = productsPerPage.value;
    offset.value = 0;
  } else {
    offset.value = productsPerPage.value * (page - 1) + 1;
    if (productsPerPage.value * page > count.value) {
      limit.value = count.value;
    } else {
      limit.value = productsPerPage.value * page + 1;
    }
  }
  await fetchProducts();
};

onMounted(async () => {
  loading.value = true;
  fetchProducts();
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>

<template>
  <div class="container py-5 mx-auto">
    <div class="mx-5">
      <SearchAndFilter
        :productsPerPage="productsPerPage"
        :totalProducts="count"
        :productsInPage="offset + productsPerPage + 1"
        @fetchWithFilters="fetchProducts"
        @clearFilters="clearFilters"
      />
      <LoadingSpinner v-if="loading" />
      <div v-if="!loading && products.length">
        <ProductList :products="products" />
        <PaginationComponent
          class="mt-10"
          :productsPerPage="productsPerPage"
          :count="count"
          :offset="offset"
          :limit="limit"
          @prevPage="prevPage"
          @nextPage="nextPage"
          @goToPage="goToPage"
        />
      </div>
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
  </div>
</template>
