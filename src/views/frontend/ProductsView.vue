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

async function fetchProducts(name, type, author, categorie, order, asc) {
  if (name != filter.value.name) {
    filter.value.name = name;
    currentPage.value = 0;
    limitOfPages.value = 5;
    offsetPages.value = 0;
    limit.value = productsPerPage.value;
    offset.value = 0;
  }
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
  pages();
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
const currentPage = ref(1);
const limitOfPages = ref(5);
const offsetPages = ref(0);

const productsPerPage = ref(23);
const offset = ref(0);
const limit = ref(productsPerPage.value);

const pages = () => {
  const totalPages = Math.ceil(count.value / productsPerPage.value);
  if (totalPages < 5) {
    limitOfPages.value = totalPages;
  } else if (currentPage.value === limitOfPages.value) {
    if (limitOfPages.value + 2 < totalPages) {
      limitOfPages.value += 2;
      offsetPages.value += 2;
    } else if (limitOfPages.value + 1 < totalPages) {
      limitOfPages.value += 1;
      offsetPages.value += 1;
    }
  }
};

const prevPage = async () => {
  limit.value = offset.value - 1;
  if (offset.value - productsPerPage.value > 0) {
    offset.value -= productsPerPage.value + 1;
  } else {
    offset.value = 0;
  }
  currentPage.value -= 1;
  await fetchProducts(filter.value.name);
};

const nextPage = async () => {
  offset.value = limit.value + 1;
  if (limit.value + productsPerPage.value < count.value) {
    limit.value += productsPerPage.value + 1;
  } else {
    limit.value = count.value;
  }
  currentPage.value += 1;
  await fetchProducts(filter.value.name);
};

const goToPage = async (page) => {
  if (page == 1) {
    limit.value = productsPerPage.value;
    offset.value = 0;
  } else {
    offset.value = (productsPerPage.value + 1) * (page - 1);
    if (productsPerPage.value * (page - 1) > count.value) {
      limit.value = count.value;
    } else {
      limit.value =
        productsPerPage.value + (productsPerPage.value + 1) * (page - 1);
    }
  }
  currentPage.value = page;
  await fetchProducts(filter.value.name);
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
        v-if="!loading"
        :productsPerPage="productsPerPage"
        :totalProducts="count"
        :productsInPage="offset + productsPerPage + 1"
        @fetchWithFilters="fetchProducts"
        @clearFilters="clearFilters"
      />
      <LoadingSpinner v-if="loading" />
      <div v-else-if="!loading && products.length">
        <ProductList :products="products" />
        <PaginationComponent
          class="mt-10"
          :currentPage="currentPage"
          :productsPerPage="productsPerPage"
          :count="count"
          :offset="offset"
          :limit="limit"
          :pages="limitOfPages"
          :pageOffset="offsetPages"
          @prevPage="prevPage"
          @nextPage="nextPage"
          @goToPage="goToPage"
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
