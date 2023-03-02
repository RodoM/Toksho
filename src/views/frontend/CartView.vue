<script setup>
import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
</script>

<template>
  <div class="flex items-center justify-center bg-comic">
    <content-block class="flex flex-col items-center justify-center !w-[500px]">
      <header-title class="text-5xl font-bold">PARA LOKITO</header-title>
      <span class="font-medium">Todavía no termine esta vista</span>
      <img src="https://pbs.twimg.com/media/Fp_hqYlWAAINLfR.jpg" alt="" class="border-2 border-tertiary-dark">
      <router-link
        :to="'/'"
        class="p-3 text-sm font-bold border-2 bg-primary-light border-tertiary-dark drop-shadow-items"
      >
        VOLVER AL INICIO
      </router-link>
    </content-block>
  </div>
</template>