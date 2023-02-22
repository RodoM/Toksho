<script setup>
import { ref } from "vue";

import ProductOrder from "./ProductOrder.vue";
import ProductFilter from "./ProductFilter.vue";

const openOrderModal = ref(false);
const openFilterModal = ref(false);

function openModal(modal) {
  const app = document.getElementById("app");
  app.classList.add("overflow-y-hidden");

  if (modal == "order") {
    openOrderModal.value = true;
  } else {
    openFilterModal.value = true;
  }
}

function closeModal(modal) {
  const app = document.getElementById("app");
  app.classList.remove("overflow-y-hidden");

  if (modal == "order") {
    openOrderModal.value = false;
  } else {
    openFilterModal.value = false;
  }
}

const emit = defineEmits(["orderOptions", "clearOrderOptio"]);

const props = defineProps({
  order: Object,
  filter: Object,
});

function emitOrderOptions(order, isAscending) {
  emit("orderOptions", order, isAscending);
}

function clearOrderOption() {
  emit("clearOrderOptio");
}
</script>

<template>
  <div
    class="flex justify-between p-3 m-5 border-2 bg-secondary-light border-tertiary-dark drop-shadow-items"
  >
    <span class="font-medium">20 de 320</span>
    <div class="flex gap-2">
      <div class="flex items-center" @click="openModal('order')">
        <span class="font-medium">Ordenar</span>
        <span class="material-icons-outlined">swap_vert</span>
      </div>
      <div class="flex items-center" @click="openModal('filter')">
        <span class="font-medium">Filtrar</span>
        <span class="material-icons-outlined">sort</span>
      </div>
    </div>
  </div>

  <ProductOrder
    v-if="openOrderModal"
    :order="props.order"
    @closeModal="closeModal('order')"
    @applyOrder="emitOrderOptions"
    @clearOrderOptions="clearOrderOption"
  />
  <ProductFilter v-if="openFilterModal" @closeModal="closeModal('filter')" />
</template>
