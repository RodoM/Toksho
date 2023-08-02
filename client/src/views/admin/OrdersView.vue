<script setup>
import { onMounted } from "vue";
import useOrderPagination from "@/lib/composables/orderPagination.js";

import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import SearchAndFilter from "../../components/orders/SearchAndFilter.vue";
import OrdersList from "@/components/shared/orders/OrdersList.vue";
import PaginationComponent from "@/components/shared/PaginationComponent.vue";

// Pagination
const { loading, ordersData, ordersFunctions, pagination, pagesFunctions } =
  useOrderPagination();

async function fetchOrders() {
  loading.value = true;
  await ordersFunctions.fetchOrders();
  loading.value = false;
}

onMounted(async () => {
  await fetchOrders();
});
</script>

<template>
  <div class="container py-5 mx-auto">
    <LoadingSpinner v-if="loading" />
    <SearchAndFilter
      v-show="!loading"
      :ordersPerPage="pagination.ordersPerPage"
      :totalOrders="ordersData.count.value"
      :ordersInPage="pagination.offset + pagination.ordersPerPage + 1"
      @fetchWithFilters="ordersFunctions.fetchOrders"
      @clearFilters="ordersFunctions.clearFilters"
    />
    <OrdersList
      v-if="!loading && ordersData.orders.value"
      :orders="ordersData.orders.value"
    />
    <PaginationComponent
      v-show="!loading && ordersData.count.value > 0"
      class="mt-10"
      :count="ordersData.count.value"
      :paginationData="pagination"
      @prevPage="pagesFunctions.prevPage"
      @nextPage="pagesFunctions.nextPage"
      @goToPage="pagesFunctions.goToPage"
    />
  </div>
</template>
