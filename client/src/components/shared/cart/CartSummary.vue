<script setup>
import { ref } from "vue";
import mpService from "@/lib/services/mpService.js";

import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import CustomButton from "@/lib/components/CustomButton.vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const getTotal = () => {
  let totalPrice = 0;
  props.items.forEach((item) => {
    totalPrice += item.price * item.amount;
  });
  return totalPrice;
};

const preferenceId = ref();

// eslint-disable-next-line no-undef
const mp = new MercadoPago("TEST-cab18a95-856f-4543-9a06-6b58364829a9");
// eslint-disable-next-line no-unused-vars
const bricksBuilder = mp.bricks();

const receivePreference = async () => {
  const res = await mpService.getPreference();
  preferenceId.value = res.id;
  mp.bricks().create("wallet", "wallet_container", {
    initialization: {
      preferenceId: preferenceId.value,
    },
  });
};

const formatPreference = () => {
  let items = [];
  props.items.forEach((item) => {
    items.push({
      id: item.id,
      title: item.name,
      picture_url: item.image,
      quantity: item.amount,
      unit_price: item.price - (item.discount / 100) * item.price,
    });
  });
  return items;
};

const sendPreference = async () => {
  await mpService.createPreference(formatPreference());
  setTimeout(() => {
    receivePreference();
  }, 1000);
};
</script>

<template>
  <div
    class="flex flex-col justify-between gap-5 p-4 border-2 bg-secondary-light border-tertiary-dark sm:min-w-[320px] drop-shadow-items"
  >
    <div class="flex flex-col gap-5">
      <header-title class="w-full">
        <span class="text-2xl font-bold">SUBTOTAL</span>
      </header-title>
      <ul class="flex flex-col gap-2 px-3">
        <li v-for="item in props.items" :key="item.id">
          <span class="font-bold">x{{ item.amount }}</span> - {{ item.name }} - <span class="font-bold">${{ item.price }}</span>
        </li>
      </ul>
    </div>
    <div class="flex flex-col gap-5">
      <header-title class="w-full">
        <span class="text-2xl font-bold">TOTAL: ${{ getTotal() }}</span>
      </header-title>
      <!-- Agregar loading cuando carga el id -->
      <!-- Crear 2do paso para escribir los datos del usuario -->
      <div v-if="preferenceId" id="wallet_container"></div>
      <CustomButton v-else primary @click="sendPreference">
        CONTINUAR CON EL PAGO
      </CustomButton>
    </div>
  </div>
</template>
