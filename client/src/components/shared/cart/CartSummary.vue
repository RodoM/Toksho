<script setup>
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  shipment: {
    type: Boolean,
  },
  shipmentPrice: {
    type: Number,
  },
});

const getTotal = () => {
  let totalPrice = 0;
  if (props.shipment) {
    totalPrice += props.shipmentPrice;
  }
  props.items.forEach((item) => {
    totalPrice += item.price * item.amount;
  });
  return totalPrice;
};
</script>

<template>
  <div
    class="flex flex-grow flex-col justify-between gap-5 border-2 border-tertiary-dark bg-secondary-light p-5 drop-shadow-items sm:min-w-[320px]"
  >
    <div class="flex flex-col gap-5">
      <header-title class="w-full">
        <span class="text-2xl font-bold">RESUMEN</span>
      </header-title>
      <ul class="flex flex-col gap-2 px-3">
        <li v-for="item in props.items" :key="item.id">
          <span class="font-bold">x{{ item.amount }}</span> - {{ item.name }} -
          <span class="font-bold">${{ item.price }}</span>
        </li>
        <li v-if="props.shipment">
          <span class="font-bold">x1</span> - Envio -
          <span class="font-bold">${{ props.shipmentPrice }}</span>
        </li>
      </ul>
    </div>
    <div class="flex flex-col gap-5">
      <header-title class="w-full">
        <span class="text-2xl font-bold">TOTAL: ${{ getTotal() }}</span>
      </header-title>
    </div>
  </div>
</template>
