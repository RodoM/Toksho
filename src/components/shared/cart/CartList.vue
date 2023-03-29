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
  return item.price * item.amount;
};
</script>

<template>
  <ul class="flex flex-col gap-5">
    <li
      v-for="item in props.items"
      :key="item"
      class="relative flex gap-3 p-4 border-2 bg-secondary-light border-tertiary-dark drop-shadow-items"
    >
      <img
        class="w-24 border-2 border-tertiary-dark"
        :src="item.image"
        :alt="item.name"
      />
      <div class="flex flex-col justify-between flex-grow">
        <div class="flex flex-col gap-1">
          <span class="font-bold">{{ item.name }}</span>
          <span class="font-medium">{{ item.author }}</span>
        </div>
        <div
          class="flex justify-between px-2 py-1 border-2 bg-primary-light border-tertiary-dark drop-shadow-navlink"
        >
          <div class="flex items-center gap-5">
            <button class="material-icons-outlined" @click="lessAmount(item)">arrow_drop_down</button>
            <span class="font-bold">{{ item.amount }}</span>
            <button class="material-icons-outlined" @click="moreAmount(item)">arrow_drop_up</button>
          </div>
          <span class="font-bold">${{ getPrice(item) }}</span>
        </div>
      </div>
      <button
        class="absolute border-2 rounded-full -top-3 -right-3 bg-primary-light border-tertiary-dark drop-shadow-navlink material-icons-outlined"
        @click="$emit('deleteItem', item.id)"
      >
        close
      </button>
    </li>
  </ul>
</template>
