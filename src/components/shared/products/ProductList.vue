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
  <div class="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-y-5">
    <ProductCard
      v-for="(comic, i) in props.products"
      :key="i"
      :title="comic.title"
      :price="comic.price"
      :image="comic.image"
      :discount="comic.discount"
      :stock="comic.stock"
    />
  </div>
</template>
