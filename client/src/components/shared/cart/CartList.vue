<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const lessAmount = (item) => {
  if (item.amount > 1) {
    item.amount -= 1;
  }
};

const moreAmount = (item) => {
  if (item.amount < item.stock) {
    item.amount += 1;
  }
};

const getPrice = (item) => {
  const { price, discount, amount } = item;
  return (price - (discount / 100) * price) * amount;
};
</script>

<template>
  <ul class="flex flex-col gap-5">
    <li
      v-for="item in props.items"
      :key="item"
      class="relative flex gap-3 border-2 border-tertiary-dark bg-secondary-light p-4 drop-shadow-items"
    >
      <img class="w-24 border-2 border-tertiary-dark" :src="item.image" :alt="item.name" loading="lazy" />
      <div class="flex flex-grow flex-col justify-between">
        <div class="flex flex-col gap-1">
          <span class="font-bold">{{ item.name }}</span>
          <span class="font-medium">{{ item.author }}</span>
          <span
            v-if="item.discount"
            class="w-fit rounded-full border-2 border-tertiary-dark bg-primary-light py-1 px-2 font-medium drop-shadow-navlink"
          >
            -{{ item.discount }}%
          </span>
        </div>
        <div class="flex flex-wrap justify-between border-2 border-tertiary-dark bg-primary-light px-2 py-1 drop-shadow-navlink">
          <div class="flex items-center gap-5">
            <button class="material-icons-outlined" @click="lessAmount(item)">arrow_drop_down</button>
            <span class="font-bold">{{ item.amount }}</span>
            <button class="material-icons-outlined" @click="moreAmount(item)">arrow_drop_up</button>
          </div>
          <span class="font-bold">${{ getPrice(item) }}</span>
        </div>
      </div>
      <button
        class="material-icons-outlined absolute -top-3 -right-3 rounded-full
        border-2 border-tertiary-dark bg-primary-light drop-shadow-navlink"
        @click="$emit('deleteItem', item.id)"
      >
        close
      </button>
    </li>
  </ul>
</template>
