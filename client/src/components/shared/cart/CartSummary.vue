<script setup>
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const getPrice = (item) => {
  const { price, discount, amount } = item;
  return (price - (discount / 100) * price) * amount;
};

const getTotal = () => {
  let totalPrice = 0;
  props.items.forEach((item) => {
    const { price, discount, amount } = item;
    if (item.discount) totalPrice += (price - (discount / 100) * price) * amount;
    else totalPrice += price * amount;
  });
  return totalPrice;
};
</script>

<template>
  <div
    class="flex flex-grow flex-col justify-between gap-5 border-2 border-tertiary-dark bg-secondary-light
    p-5 drop-shadow-items sm:min-w-[320px]"
  >
    <div class="flex flex-col gap-5">
      <header-title class="w-full">
        <span class="text-2xl font-bold">RESUMEN</span>
      </header-title>
      <ul class="flex flex-col gap-2 px-3">
        <li v-for="item in props.items" :key="item.id">
          <span class="font-bold">x{{ item.amount }}</span> - {{ item.name }} -
          <span class="font-bold">${{ getPrice(item) }}</span>
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
