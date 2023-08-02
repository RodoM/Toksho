<script setup>
import { ref } from "vue";
import OrderSearch from "./OrderSearch.vue";
import OrderFilter from "./OrderFilter.vue";

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

const emit = defineEmits(["fetchWithFilters", "clearFilters"]);

const searchInput = ref("");

const filter = ref({
  state: undefined,
  order: "date_created",
  asc: false,
});

const fetchWithFilters = (value) => {
  if (typeof value === "string") searchInput.value = value;
  else filter.value = Object.assign(value);
  emit(
    "fetchWithFilters",
    searchInput.value,
    filter.value.state,
    filter.value.order,
    filter.value.asc
  );
};

const clearFilter = () => {
  searchInput.value = "";
  filter.value.state = "undefined";
  filter.value.order = "date_created";
  filter.value.asc = false;
  emit("clearFilters");
};
</script>

<template>
  <div class="relative z-20 flex flex-col gap-3 mb-5 px-5">
    <OrderSearch @search="fetchWithFilters" />
    <OrderFilter
      :ordersPerPage="props.ordersPerPage"
      :totalOrders="props.totalOrders"
      :ordersInPage="props.ordersInPage"
      @applyFilter="fetchWithFilters"
      @clearFilter="clearFilter"
    />
  </div>
</template>
