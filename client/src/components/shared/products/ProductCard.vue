<script setup>
import { ref } from "vue";
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

function newPrice(price, discount) {
  return price - (discount / 100) * price;
}

const currentImage = ref("../../../src/assets/svgs/image-placeholder.svg");

function loadImage(image) {
  currentImage.value = image;
}
</script>

<template>
  <router-link
    :to="{
      name: 'Product',
      params: { id: props.product.id, name: props.product.name },
    }"
    class="flex flex-col items-center gap-3"
  >
    <div class="relative">
      <div class="border-2 border-tertiary-dark drop-shadow-items">
        <img
          :src="currentImage"
          @load="loadImage(props.product.image)"
          class="object-cover h-56 md:h-64"
          :alt="props.product.name"
          loading="lazy"
        />
      </div>
      <span
        v-if="props.product.discount"
        class="absolute p-2 font-medium border-2 rounded-full -top-3 -right-3 bg-primary-light border-tertiary-dark drop-shadow-navlink"
        >-{{ props.product.discount }}%</span
      >
      <span
        v-if="props.product.stock === 0"
        class="absolute p-2 font-medium border-2 rounded-full -top-3 -right-3 bg-primary-light border-tertiary-dark drop-shadow-navlink"
        >SIN STOCK</span
      >
    </div>
    <div class="flex flex-col items-center gap-1">
      <span class="font-bold max-w-[130px] text-center">{{
        props.product.name
      }}</span>
      <div>
        <span
          class="font-medium"
          :class="{ 'line-through': props.product.discount }"
        >
          ${{ props.product.price }}
        </span>
        <span v-if="props.product.discount" class="ml-2 font-medium">
          ${{ newPrice(props.product.price, props.product.discount) }}
        </span>
      </div>
    </div>
  </router-link>
</template>
