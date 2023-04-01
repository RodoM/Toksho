<script setup>
import { ref, onMounted } from "vue";
import { getAllAuthors, getAllCategories } from "@/supabase/helpers.js";

import CustomButton from "@/lib/components/CustomButton.vue";

const emit = defineEmits(["applyFilter", "clearFilter"]);

const props = defineProps({
  productsPerPage: {
    type: Number,
    required: true,
  },
  totalProducts: {
    type: Number,
    required: true,
  },
  productsInPage: {
    type: Number,
    required: true,
  },
});

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

// Filter
const openFilter = ref(false);

const filter = ref({
  option: undefined,
  author: undefined,
  categorie: undefined,
  order: "created_at",
  asc: true,
});

// Filter options

const filterOptions = [
  { label: "Mangas", value: "Manga" },
  { label: "Comics", value: "Comic" },
  { label: "Indumentaria", value: "Indumentaria" },
  { label: "Todos", value: "all" },
];

const orderOptions = [
  { label: "Alfabéticamente", value: "name" },
  { label: "Precio", value: "price" },
  { label: "Fecha de publicación", value: "created_at" },
];

const isAscending = [
  { label: "Ascendiente", value: true },
  { label: "Descendiente", value: false },
];

// Filter actions
const applyFilter = () => {
  event.preventDefault();
  emit("applyFilter", filter.value);
  openFilter.value = false;
};

const clearFilter = () => {
  event.preventDefault();
  emit("clearFilter");
  filter.value.option = "";
  filter.value.author = "";
  filter.value.categorie = "";
  filter.value.order = "created_at";
  filter.value.asc = true;
  openFilter.value = false;
};

onMounted(async () => {
  await fetchAuthors();
  await fetchCategories();
});
</script>

<template>
  <div
    class="flex justify-between p-3 border-2 bg-secondary-light border-tertiary-dark drop-shadow-items"
  >
    <span class="font-medium">
      {{ props.productsInPage - props.productsPerPage }} -
      {{
        props.productsInPage < props.totalProducts
          ? props.productsInPage
          : props.totalProducts
      }}
      de {{ props.totalProducts }}
    </span>
    <div class="ml-auto">
      <button class="flex items-center" @click="openFilter = !openFilter">
        <span class="font-medium">Filtrar</span>
        <span class="material-icons-outlined">sort</span>
      </button>
      <div
        v-if="openFilter"
        class="absolute p-3 border-2 -right-[2px] top-16 bg-background border-tertiary-dark min-w-[300px]"
      >
        <form class="flex flex-col gap-3">
          <div>
            <label for="">Filtrar por</label>
            <v-select
              v-model="filter.option"
              :options="filterOptions"
              :reduce="(opt) => opt.value"
              :clearSearchOnSelect="false"
              class="border-2 border-tertiary-dark"
            ></v-select>
          </div>
          <div v-if="filter.option == 'Manga' || filter.option == 'Comic'">
            <label for="">Autor</label>
            <v-select
              v-model="filter.author"
              :options="authors"
              :clearSearchOnSelect="false"
              class="border-2 border-tertiary-dark"
            ></v-select>
          </div>
          <div v-if="filter.option == 'Manga' || filter.option == 'Comic'">
            <label for="">Categoría</label>
            <v-select
              v-model="filter.categorie"
              :options="categories"
              :clearSearchOnSelect="false"
              class="border-2 border-tertiary-dark"
            ></v-select>
          </div>
          <div>
            <label for="">Ordenar por</label>
            <v-select
              v-model="filter.order"
              :options="orderOptions"
              :reduce="(opt) => opt.value"
              class="border-2 border-tertiary-dark"
            ></v-select>
          </div>
          <div>
            <label for="">Orden</label>
            <v-select
              v-model="filter.asc"
              :options="isAscending"
              :reduce="(opt) => opt.value"
              :clearSearchOnSelect="false"
              class="border-2 border-tertiary-dark"
            ></v-select>
          </div>
          <CustomButton primary @click="applyFilter()"> APLICAR </CustomButton>
          <CustomButton secondary @click="clearFilter()">
            LIMPIAR
          </CustomButton>
        </form>
      </div>
    </div>
  </div>
</template>
