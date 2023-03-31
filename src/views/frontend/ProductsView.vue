<script setup>
import { onMounted, ref } from "vue";

import {
  getAllProducts,
  getAllAuthors,
  getAllCategories,
  searchProducts,
  filterProducts,
} from "@/supabase/helpers.js";

import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import ProductSearchOptions from "@/components/shared/filters/ProductSearchOptions.vue";
import ProductList from "@/components/shared/products/ProductList.vue";
import PaginationComponent from "@/components/shared/PaginationComponent.vue";

// Fetching products
const products = ref([]);
const count = ref(0);
const loading = ref(false);

async function fetchProducts() {
  loading.value = true;
  const res = await getAllProducts(offset.value, limit.value);
  products.value = res.data;
  count.value = res.count;
  loading.value = false;
}

// Fetching authors
const authors = ref();

const fetchAuthors = async () => {
  authors.value = await getAllAuthors();
};

// Fetching categories
const categories = ref();

const fetchCategories = async () => {
  categories.value = await getAllCategories();
};

// Fetching with input
const searchInput = ref("");

async function inputSearchProducts() {
  loading.value = true;
  if (searchInput.value.length > 0) {
    const res = await searchProducts(searchInput.value);
    products.value = res.data;
    count.value = res.count;
  } else {
    await fetchProducts();
  }
  loading.value = false;
}

// Filtering
const applyFilters = async (type, author, categorie, order, asc) => {
  loading.value = true;
  const res = await filterProducts(type, author, categorie, order, asc);
  products.value = res.data;
  count.value = res.count;
  loading.value = false;
};

const clearFilters = async () => {
  loading.value = true;
  await fetchProducts();
  loading.value = false;
};

// Pagination
const productsPerPage = ref(23);
const offset = ref(0);
const limit = ref(productsPerPage.value);

const prevPage = async () => {
  limit.value = offset.value;
  if (offset.value - productsPerPage.value > 0) {
    offset.value -= productsPerPage.value;
  } else {
    offset.value = 0;
  }
  await fetchProducts();
};

const nextPage = async () => {
  offset.value = limit.value;
  if (limit.value + productsPerPage.value < count.value) {
    limit.value += productsPerPage.value;
  } else {
    limit.value = count.value;
  }
  await fetchProducts();
};

const goToPage = async (page) => {
  if (productsPerPage.value * page > count.value) {
    limit.value = count.value;
  } else {
    limit.value = productsPerPage.value * page;
  }
  offset.value = productsPerPage.value * (page - 1);
  await fetchProducts();
};

onMounted(async () => {
  loading.value = true;
  fetchProducts();
  fetchCategories();
  fetchAuthors();
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>

<template>
  <div class="container py-5 mx-auto">
    <div class="mx-5">
      <div class="flex border-2 border-tertiary-dark drop-shadow-items">
        <input
          v-model="searchInput"
          type="text"
          placeholder="Busqueda..."
          class="w-full p-2 focus:outline-none"
          @keyup.enter="inputSearchProducts()"
        />
        <button
          class="p-2 border-l-2 material-icons-outlined border-tertiary-dark bg-primary-light"
          @click="inputSearchProducts()"
        >
          search
        </button>
      </div>
      <div class="relative z-10 my-5">
        <ProductSearchOptions
          v-if="categories && authors"
          :productsInView="products.length"
          :totalProducts="count"
          :categories="categories"
          :authors="authors"
          @applyFilter="applyFilters"
          @clearFilter="clearFilters"
        />
      </div>
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
