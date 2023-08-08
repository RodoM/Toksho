<script setup>
import { ref } from "vue";

import SearchBar from "@/components/shared/filters/SearchBar.vue";
import ProductFilter from "@/components/shared/filters/ProductFilter.vue";

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

const searchInput = ref("");

const filter = ref({
  type: undefined,
  author: undefined,
  categorie: undefined,
  order: "created_at",
  asc: true,
});

const emit = defineEmits(["fetchWithFilters", "clearFilters"]);

const fetchWithFilters = (value) => {
  if (typeof value === "string") searchInput.value = value;
  else filter.value = Object.assign(value);
  emit(
    "fetchWithFilters",
    searchInput.value,
    filter.value.type,
    filter.value.author,
    filter.value.categorie,
    filter.value.order,
    filter.value.asc
  );
};

const clearFilter = () => {
  searchInput.value = "";
  filter.value.type = undefined;
  filter.value.author = undefined;
  filter.value.categorie = undefined;
  filter.value.order = "created_at";
  filter.value.asc = true;
  emit("clearFilters");
};
</script>
<template>
  <div class="relative z-20 mb-5 flex flex-col gap-3">
    <SearchBar @search="fetchWithFilters" />
    <div class="flex justify-between gap-3">
      <slot></slot>
      <ProductFilter
        class="w-full"
        :productsPerPage="props.productsPerPage"
        :totalProducts="props.totalProducts"
        :productsInPage="props.productsInPage"
        @applyFilter="fetchWithFilters"
        @clearFilter="clearFilter"
      />
    </div>
  </div>
</template>
