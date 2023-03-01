<script setup>
import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
</script>

<template>
  <div class="flex items-center justify-center bg-comic">
    <content-block class="flex flex-col items-center justify-center !w-80">
      <header-title class="text-5xl font-bold">404</header-title>
      <span class="font-medium">Página no encontrada</span>
      <router-link
        :to="'/'"
        class="p-3 text-sm font-bold border-2 bg-primary-light border-tertiary-dark drop-shadow-items"
      >
        VOLVER AL INICIO
      </router-link>
    </content-block>
  </div>
</template>
