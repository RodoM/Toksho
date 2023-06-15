<script setup>
import { onMounted, ref } from "vue";
import { getAllOrders } from "@/supabase/helpers.js";

import OrdersList from "@/components/shared/orders/OrdersList.vue";
import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
// import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";

const loading = ref(false);
const orders = ref([]);

onMounted(async () => {
  loading.value = true;
  orders.value = await getAllOrders();
  loading.value = false;
});
</script>

<template>
  <LoadingSpinner v-if="loading" />
  <div v-else-if="!loading && orders.length > 0" class="container p-5 mx-auto">
    <OrdersList :orders="orders" />
  </div>
</template>
