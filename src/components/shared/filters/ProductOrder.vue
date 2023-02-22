<script setup>
import { ref, reactive } from "vue";

import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";

const props = defineProps({
  order: Object,
});

// Order
const select1 = ref(false);

const orderOptions = reactive([
  { name: "Alfabéticamente", value: "name" },
  { name: "Precio", value: "price" },
  { name: "Fecha de publicación", value: "created_at" },
]);

const initialOrder = ref(props.order.orderOption);

function selectOrderOption(option) {
  initialOrder.value = option;
}

// Ascending
const select2 = ref(false);

const isAscending = reactive([
  { name: "Ascendiente", value: true },
  { name: "Descendiente", value: false },
]);

const initialAsc = ref(props.order.ascOption);

function selectAscOption(option) {
  initialAsc.value = option;
}

const emit = defineEmits(["applyOrder", "closeModal", "clearOrderOptions"]);

function applyOrder(order, isAscending) {
  if (
    initialOrder.value.value !== props.order.orderOption.value ||
    initialAsc.value.value !== props.order.ascOption.value
  ) {
    emit("applyOrder", order, isAscending);
  }
  emit("closeModal");
}

function clearOptions() {
  if (initialOrder.value.value !== "id" || initialAsc.value.value !== false) {
    emit("clearOrderOptions");
  }
}
</script>

<template>
  <div
    class="absolute top-0 z-50 flex flex-col w-full h-screen gap-8 p-5 bg-background"
  >
    <button @click="$emit('closeModal')" class="text-end">
      <span class="material-icons-outlined"> close </span>
    </button>
    <header-title>
      <span class="text-2xl font-bold">ORDENAR POR</span>
    </header-title>
    <div class="relative flex flex-col gap-4">
      <div
        type="text"
        class="z-40 w-full p-2 border-2 bg-background focus:outline-none border-tertiary-dark drop-shadow-items"
      >
        <span>{{ initialOrder.name }}</span>
        <div
          class="absolute left-0 flex flex-col w-full p-2 transition-all duration-500 border-2 top-14 border-tertiary-dark bg-background"
          :class="{ hidden: !select1 }"
        >
          <span
            v-for="(option, i) in orderOptions"
            :key="i"
            class="p-1 transition-all border-2 hover:bg-secondary-light hover:border-tertiary-dark border-background"
            :class="{
              'bg-secondary-light border-tertiary-dark':
                option.name === initialOrder.name,
            }"
            @click="selectOrderOption(option)"
            >{{ option.name }}</span
          >
        </div>
      </div>
      <span
        class="absolute top-2.5 z-40 right-3 material-icons-outlined"
        @click="select1 = !select1"
      >
        expand_more
      </span>
    </div>

    <div class="relative flex flex-col gap-4">
      <div
        type="text"
        class="z-30 w-full p-2 border-2 bg-background focus:outline-none border-tertiary-dark drop-shadow-items"
      >
        <span>{{ initialAsc.name }}</span>
        <div
          class="absolute left-0 flex flex-col w-full p-2 transition-all duration-500 border-2 top-14 border-tertiary-dark bg-background"
          :class="{ hidden: !select2 }"
        >
          <span
            v-for="(option, i) in isAscending"
            :key="i"
            class="p-1 transition-all border-2 hover:bg-secondary-light hover:border-tertiary-dark border-background"
            :class="{
              'bg-secondary-light border-tertiary-dark':
                option.name === initialAsc.name,
            }"
            @click="selectAscOption(option)"
            >{{ option.name }}</span
          >
        </div>
      </div>
      <span
        class="absolute top-2.5 z-30 right-3 material-icons-outlined"
        @click="select2 = !select2"
      >
        expand_more
      </span>
    </div>
    <div class="flex flex-col gap-4 mt-auto mb-5">
      <button
        class="w-full p-4 font-bold border-2 bg-primary-light border-tertiary-dark drop-shadow-items"
        @click="applyOrder(initialOrder, initialAsc)"
      >
        APLICAR
      </button>
      <button
        class="w-full p-4 font-bold border-2 bg-secondary-light border-tertiary-dark drop-shadow-items"
        @click="clearOptions(), $emit('closeModal')"
      >
        LIMPIAR
      </button>
    </div>
  </div>
</template>
