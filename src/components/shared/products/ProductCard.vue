<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
    required: false,
  },
  stock: {
    type: Number,
    required: true,
  },
});

function newPrice(price, discount) {
  return price - (discount / 100) * price;
}
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <div class="relative">
      <img
        src="@/assets/images/portada.jpg"
        class="border-2 w-36 border-tertiary-dark drop-shadow-items"
        alt="asd"
      />
      <span
        v-if="props.discount"
        class="absolute p-2 font-medium border-2 rounded-full -top-3 -right-3 bg-primary-light border-tertiary-dark drop-shadow-navlink"
        >-{{ props.discount }}%</span
      >
      <span
        v-if="props.stock === 0"
        class="absolute p-2 font-medium border-2 rounded-full -top-3 -right-3 bg-primary-light border-tertiary-dark drop-shadow-navlink"
        >SIN STOCK</span
      >
    </div>
    <div class="flex flex-col items-center gap-1">
      <span class="font-bold">{{ props.title }}</span>
      <div>
        <span class="font-medium" :class="{ 'line-through': props.discount }">
          ${{ props.price }}
        </span>
        <span v-if="props.discount" class="ml-2 font-medium">
          ${{ newPrice(props.price, props.discount) }}
        </span>
      </div>
    </div>
  </div>
</template>
