<script setup>
import { ref } from "vue";

import CustomButton from "@/lib/components/CustomButton.vue";

const props = defineProps({
  totalProducts: Number,
  productsInView: Number,
  categories: {
    type: Array,
    required: true,
  },
  authors: {
    type: Array,
    required: true,
  },
});

const filterMenu = ref(false);

const filterOptions = [
  { label: "Mangas", value: "Manga" },
  { label: "Comics", value: "Comic" },
  { label: "Indumentaria", value: "Indumentaria" },
  { label: "Todos", value: "all" },
];

const selectedFilterOpt = ref("");
const selectedAuthor = ref("");
const selectedCategorie = ref("");

const orderOptions = [
  { label: "Alfabéticamente", value: "name" },
  { label: "Precio", value: "price" },
  { label: "Fecha de publicación", value: "created_at" },
];

const isAscending = [
  { label: "Ascendiente", value: true },
  { label: "Descendiente", value: false },
];

const selectedOrder = ref("");
const selectedAsc = ref(true);

const emit = defineEmits(["applyFilter", "clearFilter"]);

const applyFilter = (type, author, categorie, order, asc) => {
  event.preventDefault();
  emit("applyFilter", type, author, categorie, order, asc);
};

const clearFilter = () => {
  event.preventDefault();
  emit("clearFilter");
  selectedFilterOpt.value = "";
  selectedAuthor.value = "";
  selectedCategorie.value = "";
  selectedOrder.value = "";
  selectedAsc.value = true;
};
</script>

<template>
  <div
    class="flex justify-between p-3 border-2 bg-secondary-light border-tertiary-dark drop-shadow-items"
  >
    <span
      v-if="props.productsInView && props.totalProducts"
      class="font-medium"
    >
      {{ props.productsInView }} de {{ props.totalProducts }}
    </span>
    <div class="ml-auto">
      <button class="flex items-center" @click="filterMenu = !filterMenu">
        <span class="font-medium">Filtrar</span>
        <span class="material-icons-outlined">sort</span>
      </button>
      <div
        v-if="filterMenu"
        class="absolute p-3 border-2 -right-[2px] top-16 bg-background border-tertiary-dark min-w-[300px]"
      >
        <form class="flex flex-col gap-3">
          <div>
            <label for="">Filtrar por</label>
            <v-select
              v-model="selectedFilterOpt"
              :options="filterOptions"
              :reduce="(opt) => opt.value"
              :clearSearchOnSelect="false"
              class="border-2 border-tertiary-dark"
            ></v-select>
          </div>
          <div
            v-if="selectedFilterOpt == 'Manga' || selectedFilterOpt == 'Comic'"
          >
            <label for="">Autor</label>
            <v-select
              v-model="selectedAuthor"
              :options="authors"
              :clearSearchOnSelect="false"
              class="border-2 border-tertiary-dark"
            ></v-select>
          </div>
          <div
            v-if="selectedFilterOpt == 'Manga' || selectedFilterOpt == 'Comic'"
          >
            <label for="">Categoría</label>
            <v-select
              v-model="selectedCategorie"
              :options="props.categories"
              :clearSearchOnSelect="false"
              class="border-2 border-tertiary-dark"
            ></v-select>
          </div>
          <div>
            <label for="">Ordenar por</label>
            <v-select
              v-model="selectedOrder"
              :options="orderOptions"
              :reduce="(opt) => opt.value"
              class="border-2 border-tertiary-dark"
            ></v-select>
          </div>
          <div>
            <label for="">Orden</label>
            <v-select
              v-model="selectedAsc"
              :options="isAscending"
              :reduce="(opt) => opt.value"
              :clearSearchOnSelect="false"
              class="border-2 border-tertiary-dark"
            ></v-select>
          </div>
          <CustomButton
            primary
            @click="
              applyFilter(
                selectedFilterOpt,
                selectedAuthor,
                selectedCategorie,
                selectedOrder,
                selectedAsc
              ),
                (filterMenu = false)
            "
          >
            APLICAR
          </CustomButton>
          <CustomButton secondary @click="clearFilter(), (filterMenu = false)">
            LIMPIAR
          </CustomButton>
        </form>
      </div>
    </div>
  </div>
</template>
