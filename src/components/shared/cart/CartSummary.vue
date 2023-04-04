<script setup>
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
          <span class="font-bold">x{{ item.amount }}</span> - {{ item.name }} - <span class="font-bold">${{ item.price }} c/u</span>
        </li>
      </ul>
    </div>
    <div class="flex flex-col gap-5">
      <header-title class="w-full">
        <span class="text-2xl font-bold">TOTAL: ${{ getTotal() }}</span>
      </header-title>
      <CustomButton primary>CONTINUAR CON EL PAGO</CustomButton>
    </div>
  </div>
</template>
