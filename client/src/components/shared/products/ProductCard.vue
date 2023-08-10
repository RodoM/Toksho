<script setup>
import { ref, computed } from "vue";
import placeholderImage from "@/assets/svgs/image-placeholder.svg";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const newPrice = computed(() => {
  const { price, discount } = props.product;
  return price - (discount / 100) * price;
});

const currentImage = ref(placeholderImage);

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
          class="h-56 object-cover md:h-64"
          :alt="props.product.name"
          loading="lazy"
        />
      </div>
      <span
        v-if="props.product.discount"
        class="absolute -top-3 -right-3 rounded-full border-2 border-tertiary-dark bg-primary-light p-2 font-medium drop-shadow-navlink"
        >-{{ props.product.discount }}%</span
      >
      <span
        v-if="props.product.stock === 0"
        class="absolute -top-3 -right-3 rounded-full border-2 border-tertiary-dark bg-primary-light p-2 font-medium drop-shadow-navlink"
        >SIN STOCK</span
      >
    </div>
    <div class="flex flex-col items-center gap-1">
      <span class="max-w-[130px] text-center font-bold">{{ props.product.name }}</span>
      <div>
        <span class="font-medium" :class="{ 'line-through': props.product.discount }"> ${{ props.product.price }} </span>
        <span v-if="props.product.discount" class="ml-2 font-medium"> ${{ newPrice }} </span>
      </div>
    </div>
  </router-link>
</template>
