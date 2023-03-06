<script setup>
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import CartList from "@/components/shared/cart/CartList.vue";
</script>

<template>
  <div class="container py-5 mx-auto">
    <header-title>
      <span class="text-2xl font-bold">CARRITO</span>
    </header-title>
    <div class="flex flex-col gap-6 my-5 lg:gap-60 lg:flex-row">
      <div class="w-full">
        <CartList />
      </div>
      <div class="p-4 border-2 bg-secondary-light border-tertiary-dark">
        <header-title>
          <span class="text-2xl font-bold">RESUMEN</span>
        </header-title>
      </div>
    </div>
  </div>
</template>
