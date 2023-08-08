<script setup>
import { ref } from "vue";
import CustomButton from "@/lib/components/CustomButton.vue";

const props = defineProps({
  ordersPerPage: {
    type: Number,
    required: true,
  },
  totalOrders: {
    type: Number,
    required: true,
  },
  ordersInPage: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["applyFilter", "clearFilter"]);

// Filter
const openFilter = ref(false);

const filter = ref({
  state: "all",
  order: "date_created",
  asc: false,
});

// Filter options
const filterOptions = [
  { label: "Aprobadas", value: "approved" },
  { label: "Pendientes", value: "pending" },
  { label: "Rechazadas", value: "rejected" },
  { label: "Todas", value: "all" },
];

const orderOptions = [
  { label: "Fecha de compra", value: "date_created" },
  { label: "Apellido", value: "surname" },
  { label: "Monto", value: "transaction_amount" },
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
  filter.value.state = "all";
  filter.value.order = "date_created";
  filter.value.asc = false;
  openFilter.value = false;
};
</script>
<template>
  <div class="flex justify-between border-2 border-tertiary-dark bg-secondary-light p-3 drop-shadow-items">
    <span class="font-medium">
      {{ props.ordersInPage - props.ordersPerPage }} -
      {{ props.ordersInPage < props.totalOrders ? props.ordersInPage : props.totalOrders }}
      de {{ props.totalOrders }}
    </span>
    <div class="ml-auto">
      <button class="flex items-center" @click="openFilter = !openFilter">
        <span class="font-medium">Ordenar</span>
        <span class="material-icons-outlined">sort</span>
      </button>
      <div v-if="openFilter" class="absolute -right-[2px] top-16 min-w-[300px] border-2 border-tertiary-dark bg-background p-3">
        <form class="flex flex-col gap-3">
          <div>
            <label for="">Estado</label>
            <v-select
              v-model="filter.state"
              :options="filterOptions"
              :reduce="(opt) => opt.value"
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
          <CustomButton secondary @click="clearFilter()"> LIMPIAR </CustomButton>
        </form>
      </div>
    </div>
  </div>
</template>
