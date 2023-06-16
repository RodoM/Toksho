<script setup>
import { ref, onMounted } from "vue";
import { getUserOrders } from "@/supabase/helpers.js";
import { userStore } from "@/stores/index.js";

import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import UserForm from "@/components/frontend/user/UserForm.vue";
import OrdersList from "@/components/shared/orders/OrdersList.vue";
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
  <div
    v-else-if="!loading"
    class="container flex flex-col gap-10 py-5 mx-auto lg:flex-row"
  >
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
      <div v-if="orders.length > 0">
        <OrdersList :orders="orders" />
      </div>
      <div
        v-else
        class="flex flex-col items-center gap-3 mt-5 lg:absolute lg:-translate-x-1/2 lg:-translate-y-1/2 top-1/2 left-1/2"
      >
        <span class="material-icons-outlined !text-9xl text-primary">
          receipt_long
        </span>
        <span class="text-xl font-medium">Sin compras</span>
        <span class="font-medium text-center min-w-[335px]">
          No se encontraron anteriores compras
        </span>
        <router-link
          to="/productos"
          class="p-2 font-medium border-2 border-tertiary-dark bg-primary-light drop-shadow-items"
        >
          VISITAR CATÁLOGO
        </router-link>
      </div>
    </div>
  </div>
</template>
