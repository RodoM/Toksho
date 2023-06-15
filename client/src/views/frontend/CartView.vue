<script setup>
import { ref, onBeforeMount } from "vue";
import { itemsStore } from "@/stores/shoppingCart.js";
import { userStore } from "@/stores/index.js";
import { useToast } from "vue-toast-notification";
import {
  getUserCart,
  addToUserCart,
  getCartItems,
  getMaintenance,
  getShippingPrice,
} from "@/supabase/helpers.js";
import mpService from "@/lib/services/mpService.js";
import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import CartList from "@/components/shared/cart/CartList.vue";
import BuyerInfo from "@/components/shared/cart/BuyerInfo.vue";
import CartSummary from "@/components/shared/cart/CartSummary.vue";
import CustomButton from "@/lib/components/CustomButton.vue";

const itemStore = itemsStore();
const usersStore = userStore();
const $toast = useToast();

const loading = ref(false);
const maintenance = ref();
const shipmentPrice = ref();
const items = ref();

const step1 = ref(true);

const deleteItem = async (id) => {
  try {
    if (usersStore.user?.id) {
      items.value.pop(items.value.find((x) => x.id === id));
      const error = await addToUserCart(
        items.value.map((x) => ({ id: x.id, amount: x.amount })),
        usersStore.user.id
      );
      if (error) throw error;
    } else {
      itemStore.deleteItem(id);
      items.value = await getCartItems(itemStore.items);
    }
    $toast.open({
      position: "top-right",
      message: "Se eliminó correctamente el producto al carrito",
      type: "success",
      duration: 5000,
      dismissible: true,
      pauseOnHover: true,
    });
  } catch (error) {
    console.log(error);
    $toast.open({
      position: "top-right",
      message: "Error al eliminar el producto del carrito",
      type: "error",
      duration: 5000,
      dismissible: true,
      pauseOnHover: true,
    });
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
  <div class="container p-5 mx-auto">
    <LoadingSpinner v-if="loading" />
    <div v-else-if="!loading && items.length > 0" class="flex flex-col h-full">
      <header-title>
        <span class="text-2xl font-bold">CARRITO</span>
      </header-title>
      <div class="flex flex-col flex-grow gap-6 my-5 lg:gap-40 lg:flex-row">
        <div class="w-full">
          <CartList v-if="step1" :items="items" @deleteItem="deleteItem" />
          <BuyerInfo
            v-else
            ref="state"
            :shipmentPrice="shipmentPrice"
            @validate="isValidated = true"
          />
        </div>
        <div class="flex flex-col gap-5">
          <CartSummary
            :items="items"
            :shipment="state?.state?.shipment"
            :shipmentPrice="shipmentPrice"
          />
          <div v-if="preferenceId" id="wallet_container"></div>
          <CustomButton
            v-else-if="!maintenance && step1"
            primary
            @click="step1 = false"
          >
            CONTINUAR CON EL PEDIDO
          </CustomButton>
          <CustomButton
            v-else-if="!maintenance"
            primary
            class="flex justify-center"
            @click="sendPreference"
          >
            <svg
              v-if="loadingBtn"
              aria-hidden="true"
              class="w-5 h-5 text-tertiary-light animate-spin fill-primary"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span v-else> CONTINUAR CON EL PAGO </span>
          </CustomButton>
          <CustomButton v-if="!step1" secondary @click="stepBack()">
            VOLVER AL PASO ANTERIOR
          </CustomButton>
        </div>
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
