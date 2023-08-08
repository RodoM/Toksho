<script setup>
import { ref, onBeforeMount } from "vue";
import { itemsStore } from "@/stores/shoppingCart.js";
import { userStore } from "@/stores/index.js";
import { showToast } from "@/lib/composables/toastHelper";
import { getUserCart, updateUserCart, getCartItems, getMaintenance, getShippingPrice } from "@/supabase/helpers.js";
import mpService from "@/lib/services/mpService.js";
import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import CartList from "@/components/shared/cart/CartList.vue";
import BuyerInfo from "@/components/shared/cart/BuyerInfo.vue";
import CartSummary from "@/components/shared/cart/CartSummary.vue";
import CustomButton from "@/lib/components/CustomButton.vue";

const itemStore = itemsStore();
const usersStore = userStore();

const loading = ref(false);
const maintenance = ref();
const shipmentPrice = ref();
const items = ref();

const step1 = ref(true);

const deleteItem = async (id) => {
  if (usersStore.user?.id) {
    items.value.pop(items.value.find((x) => x.id === id));
    const newItems = items.value.map((x) => ({ id: x.id, amount: x.amount }));
    await updateUserCart(newItems, usersStore.user.id, true);
  } else {
    itemStore.deleteItem(id);
    items.value = await getCartItems(itemStore.items);
    showToast("Se eliminó el producto del carrito", "success");
  }
};

const loadingBtn = ref(false);
const preferenceId = ref();

// eslint-disable-next-line no-undef
const mp = new MercadoPago("TEST-cab18a95-856f-4543-9a06-6b58364829a9", {
  locale: "es-AR",
});
// eslint-disable-next-line no-unused-vars
const bricksBuilder = mp.bricks();

const receivePreference = async () => {
  const res = await mpService.getPreference();
  preferenceId.value = res.id;
  mp.bricks().create("wallet", "wallet_container", {
    initialization: {
      preferenceId: preferenceId.value,
      redirectMode: "modal",
    },
  });
  loadingBtn.value = false;
};

// Agregar datos del comprador y si tiene envio
const formatPreference = () => {
  let preferenceItems = [];
  items.value.forEach((item) => {
    preferenceItems.push({
      id: item.id,
      title: item.name,
      picture_url: item.image,
      quantity: item.amount,
      unit_price: item.price - (item.discount / 100) * item.price,
    });
  });
  if (!state.value.state.shipment) {
    state.value.state.payer.address = {};
  }
  return {
    items: preferenceItems,
    payer: state.value.state.payer,
    shipment: state.value.state.shipment ? shipmentPrice.value : 0,
  };
};

const state = ref();
const isValidated = ref(false);

const sendPreference = () => {
  state.value.validateInfo();
  setTimeout(async () => {
    if (isValidated.value) {
      loadingBtn.value = true;
      await mpService.createPreference(formatPreference());
      setTimeout(() => {
        receivePreference();
      }, 1000);
    }
  }, 100);
};

const stepBack = () => {
  preferenceId.value = undefined;
  isValidated.value = false;
  step1.value = true;
};

const userCart = ref([]);

onBeforeMount(async () => {
  loading.value = true;
  maintenance.value = await getMaintenance();
  shipmentPrice.value = await getShippingPrice();
  if (usersStore.user?.id) {
    userCart.value = await getUserCart(usersStore.user.id);
    items.value = await getCartItems(userCart.value);
  } else {
    items.value = await getCartItems(itemStore.items);
  }
  loading.value = false;
});
</script>

<template>
  <div class="container mx-auto p-5">
    <LoadingSpinner v-if="loading" />
    <div v-else-if="!loading && items.length > 0" class="flex h-full flex-col">
      <header-title>
        <span class="text-2xl font-bold">CARRITO</span>
      </header-title>
      <div class="my-5 flex flex-grow flex-col gap-6 lg:flex-row lg:gap-40">
        <div class="w-full">
          <CartList v-if="step1" :items="items" @deleteItem="deleteItem" />
          <BuyerInfo v-else ref="state" :shipmentPrice="shipmentPrice" @validate="isValidated = true" />
        </div>
        <div class="flex flex-col gap-5">
          <CartSummary :items="items" :shipment="state?.state?.shipment" :shipmentPrice="shipmentPrice" />
          <div v-if="preferenceId" id="wallet_container"></div>
          <CustomButton v-else-if="!maintenance && step1" primary @click="step1 = false"> CONTINUAR CON EL PEDIDO </CustomButton>
          <CustomButton v-else-if="!maintenance" primary class="flex justify-center" :loading="loadingBtn" @click="sendPreference">
            CONTINUAR CON EL PAGO
          </CustomButton>
          <CustomButton v-if="!step1" secondary @click="stepBack()"> VOLVER AL PASO ANTERIOR </CustomButton>
        </div>
      </div>
    </div>
    <div v-else class="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
      <span class="material-icons-outlined !text-9xl text-primary"> production_quantity_limits </span>
      <span class="text-xl font-medium">Carrito vacío</span>
      <span class="min-w-[335px] text-center font-medium">
        No se encontraron productos en tu carrito, puedes revisar nuestro catálogo y añadir productos al mismo.
      </span>
      <router-link to="/productos" class="border-2 border-tertiary-dark bg-primary-light p-2 font-medium drop-shadow-items">
        VISITAR CATÁLOGO
      </router-link>
    </div>
  </div>
</template>
