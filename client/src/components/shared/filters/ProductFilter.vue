<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { getAllAuthors, getAllPublishedAuthors, getAllCategories, getAllPublishedCategories } from "@/supabase/helpers";

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

const route = useRoute();

// Filter
const openFilter = ref(false);

const filter = ref({
  type: undefined,
  author: undefined,
  categorie: undefined,
  order: "created_at",
  asc: true,
});

const authors = ref();
const categories = ref();

const alreadyFetched = ref(false);

const authorsQuery = () => {
  if (route.path.includes("/admin")) return getAllAuthors();
  else return getAllPublishedAuthors();
};

const categoriesQuery = () => {
  if (route.path.includes("/admin")) return getAllCategories();
  else return getAllPublishedCategories();
};

watch(openFilter, async () => {
  if (!alreadyFetched.value) {
    authors.value = await authorsQuery();
    categories.value = await categoriesQuery();
    alreadyFetched.value = true;
  }
});

// Filter options
const filterOptions = [
  { label: "Mangas", value: "Manga" },
  { label: "Comics", value: "Comic" },
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
  filter.value.type = "";
  filter.value.author = "";
  filter.value.categorie = "";
  filter.value.order = "created_at";
  filter.value.asc = true;
  openFilter.value = false;
};
</script>

<template>
  <div class="flex justify-between border-2 border-tertiary-dark bg-secondary-light p-3 drop-shadow-items">
    <span class="font-medium">
      {{ props.productsInPage - props.productsPerPage }} -
      {{ props.productsInPage < props.totalProducts ? props.productsInPage : props.totalProducts }}
      de {{ props.totalProducts }}
    </span>
    <div class="ml-auto">
      <button class="flex items-center" @click="openFilter = !openFilter">
        <span class="font-medium">Filtrar</span>
        <span class="material-icons-outlined">sort</span>
      </button>
      <div v-if="openFilter" class="absolute -right-[2px] top-16 min-w-[300px] border-2 border-tertiary-dark bg-background p-3">
        <form class="flex flex-col gap-3">
          <div>
            <label for="">Filtrar por</label>
            <v-select
              v-model="filter.type"
              :placeholder="'Tipo de producto'"
              :options="filterOptions"
              :reduce="(opt) => opt.value"
              :clearable="false"
              class="border-2 border-tertiary-dark"
            ></v-select>
          </div>
          <div>
            <label for="">Autor</label>
            <v-select
              v-model="filter.author"
              :placeholder="'Autor'"
              :options="authors?.sort()"
              :clearable="false"
              class="border-2 border-tertiary-dark"
            ></v-select>
          </div>
          <div>
            <label for="">Categoría</label>
            <v-select
              v-model="filter.categorie"
              :placeholder="'Categoría'"
              :options="categories?.sort()"
              :clearable="false"
              class="border-2 border-tertiary-dark"
            ></v-select>
          </div>
          <div>
            <label for="">Ordenar por</label>
            <v-select
              v-model="filter.order"
              :options="orderOptions"
              :reduce="(opt) => opt.value"
              :clearable="false"
              class="border-2 border-tertiary-dark"
            ></v-select>
          </div>
          <div>
            <label for="">Orden</label>
            <v-select
              v-model="filter.asc"
              :options="isAscending"
              :reduce="(opt) => opt.value"
              :clearable="false"
              class="border-2 border-tertiary-dark"
            ></v-select>
          </div>
          <CustomButton primary @click="applyFilter()"> APLICAR </CustomButton>
          <CustomButton secondary @click="clearFilter()"> LIMPIAR </CustomButton>
        </form>
      </div>
    </div>
  </div>
</template>
