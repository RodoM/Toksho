<script setup>
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";

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
</script>

<template>
  <div
    class="flex flex-col flex-grow justify-between gap-5 p-5 border-2 bg-secondary-light border-tertiary-dark sm:min-w-[320px] drop-shadow-items"
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
    </div>
  </div>
</template>
