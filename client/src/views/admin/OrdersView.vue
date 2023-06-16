<script setup>
import { onMounted, ref } from "vue";
import { getAllOrders, searchOrders } from "@/supabase/helpers.js";

import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import OrderSearchbar from "@/components/admin/orders/OrderSearchbar.vue";
import OrdersList from "@/components/shared/orders/OrdersList.vue";
// import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";

const loading = ref(false);
const orders = ref([]);

const searchOrder = async (searchInput) => {
  loading.value = true;
  orders.value = await searchOrders(searchInput);
  loading.value = false;
};

onMounted(async () => {
  loading.value = true;
  orders.value = await getAllOrders();
  loading.value = false;
});
</script>

<template>
  <div class="container p-5 mx-auto">
    <LoadingSpinner v-if="loading" />
    <OrderSearchbar v-show="!loading" @search="searchOrder" />
    <OrdersList v-if="!loading && orders.length > 0" :orders="orders" />
  </div>
</template>
