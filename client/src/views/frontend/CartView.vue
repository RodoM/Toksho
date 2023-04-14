<script setup>
import { ref, onBeforeMount } from "vue";
import { itemsStore } from "@/stores/shoppingCart.js";
import { useToast } from "vue-toast-notification";
import { getCartItems } from "@/supabase/helpers.js";
import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import CartList from "@/components/shared/cart/CartList.vue";
import CartSummary from "@/components/shared/cart/CartSummary.vue";

const store = itemsStore();
const $toast = useToast();

const loading = ref(false);
const items = ref();

const deleteItem = async (id) => {
  store.deleteItem(id);
  items.value = await getCartItems(store.items);
  $toast.open({
    position: "top-right",
    message: "Se eliminó correctamente el producto al carrito",
    type: "success",
    duration: 5000,
    dismissible: true,
    pauseOnHover: true,
  });
};

onBeforeMount(async () => {
  loading.value = true;
  items.value = await getCartItems(store.items);
  loading.value = false;
});
</script>

<template>
  <div class="container p-5 mx-auto">
    <LoadingSpinner v-if="loading" />
    <div v-else-if="!loading && items.length > 0" class="flex flex-col h-full">
      <header-title>
        <span class="text-2xl font-bold">CARRITO</span>
      </header-title>
      <div class="flex flex-col flex-grow gap-6 my-5 lg:gap-40 lg:flex-row">
        <div class="w-full">
          <CartList :items="items" @deleteItem="deleteItem" />
        </div>
        <CartSummary :items="items" />
      </div>
    </div>
    <div
      v-else
      class="absolute flex flex-col items-center gap-3 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
    >
      <span class="material-icons-outlined !text-9xl text-primary">
        production_quantity_limits
      </span>
      <span class="text-xl font-medium">Carrito vacío</span>
      <span class="font-medium text-center min-w-[335px]">
        No se encontraron productos en tu carrito, puedes revisar nuestro
        catálogo y añadir productos al mismo.
      </span>
      <router-link
        to="/productos"
        class="p-2 font-medium border-2 border-tertiary-dark bg-primary-light drop-shadow-items"
      >
        VISITAR CATÁLOGO
      </router-link>
    </div>
  </div>
</template>
