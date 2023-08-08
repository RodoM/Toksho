<script setup>
import { ref, onMounted } from "vue";
import { getUserOrders } from "@/supabase/helpers.js";
import { userStore } from "@/stores/index.js";

import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import UserForm from "@/components/frontend/user/UserForm.vue";
import OrderCard from "../../components/orders/OrderCard.vue";
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";

const store = userStore();
const loading = ref(false);
const orders = ref([]);

onMounted(async () => {
  loading.value = true;
  orders.value = await getUserOrders(store.user.id);
  loading.value = false;
});
</script>

<template>
  <LoadingSpinner v-if="loading" />
  <div v-else-if="!loading" class="container mx-auto flex flex-col gap-10 py-5 lg:flex-row">
    <div class="w-full px-5 xl:w-1/3">
      <header-title class="mb-5">
        <span class="text-2xl font-bold">DATOS PERSONALES</span>
      </header-title>
      <UserForm :userId="store.user.id" />
    </div>

    <div class="relative w-full px-5 xl:w-2/3">
      <header-title class="mb-5">
        <span class="text-2xl font-bold">ULTIMAS COMPRAS</span>
      </header-title>
      <div v-if="orders.length > 0" class="flex flex-col gap-5">
        <OrderCard v-for="order in orders" :key="order.id" :order="order" />
      </div>
      <div v-else class="top-1/2 left-1/2 mt-5 flex flex-col items-center gap-3 lg:absolute lg:-translate-x-1/2 lg:-translate-y-1/2">
        <span class="material-icons-outlined !text-9xl text-primary"> receipt_long </span>
        <span class="text-xl font-medium">Sin compras</span>
        <span class="min-w-[335px] text-center font-medium"> No se encontraron anteriores compras </span>
        <router-link to="/productos" class="border-2 border-tertiary-dark bg-primary-light p-2 font-medium drop-shadow-items">
          VISITAR CATÁLOGO
        </router-link>
      </div>
    </div>
  </div>
</template>
