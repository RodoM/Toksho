<script setup>
import ProductCard from "@/components/shared/products/ProductCard.vue";

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div
    class="grid w-full grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
  >
    <ProductCard
      v-for="product in props.products"
      :key="product.id"
      :product="product"
    />
  </div>
</template>
