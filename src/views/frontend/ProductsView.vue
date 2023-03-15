<script setup>
import { onMounted, ref } from "vue";
import { supabase } from "@/supabase/supabase.js";

import sbHelpers from "@/supabase/helpers.js";

import ProductList from "@/components/shared/products/ProductList.vue";
import ProductSearchOptions from "@/components/shared/filters/ProductSearchOptions.vue";
import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";

const products = ref([]);
const loading = ref(false);

const count = ref(0);

async function fetchProducts() {
  loading.value = true;
  products.value = await sbHelpers.getAllProducts();
  count.value = products.value.length;
  loading.value = false;
}

const categories = ref();

const getAllCategories = async () => {
  let categoriesArr = [];
  const { data: Categories, error } = await supabase
    .from("Products")
    .select("categories");
  if (error) console.log(error);
  else {
    Categories.forEach((cat) => {
      cat.categories.forEach((c) => {
        categoriesArr.push(c);
      });
    });
    categories.value = [...new Set(categoriesArr)];
  }
};

const authors = ref();

const getAllAuthors = async () => {
  let authorsArr = [];
  const { data: Authors, error } = await supabase
    .from("Products")
    .select("author");
  if (error) console.log(error);
  else {
    Authors.forEach((author) => {
      authorsArr.push(author.author);
    });
    authors.value = [...new Set(authorsArr)];
  }
};

onMounted(async () => {
  loading.value = true;
  fetchProducts();
  getAllCategories();
  getAllAuthors();
  setTimeout(() => {
    loading.value = false;
  }, 500);
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

const applyFilters = async (type, author, categorie, order, asc) => {
  loading.value = true;
  let query = supabase
    .from("Products")
    .select("id, name, image, price, discount, stock, updated_at");
  if (type) query = query.eq("type", type);
  if (author) query = query.eq("author", author);
  if (categorie) query = query.overlaps("categories", [categorie]);
  if (order) query = query.order(order, { ascending: asc });
  const { data: Products, error } = await query;
  if (error) console.log(error);
  else {
    products.value = Products;
    loading.value = false;
  }
};

const clearFilters = async () => {
  loading.value = true;
  await fetchProducts();
  loading.value = false;
};
</script>

<template>
  <div class="container py-5 mx-auto">
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
    <div class="relative z-10 m-5">
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
    <ProductList v-if="!loading && products" :products="products" />
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
