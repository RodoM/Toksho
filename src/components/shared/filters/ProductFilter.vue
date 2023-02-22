<script setup>
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
</script>

<template>
  <div
    class="absolute top-0 z-50 flex flex-col w-full h-screen gap-8 p-5 bg-background"
  >
    <button @click="$emit('closeModal')" class="text-end">
      <span class="material-icons-outlined"> close </span>
    </button>
    <header-title>
      <span class="text-2xl font-bold">FILTRAR POR</span>
    </header-title>
    <div class="relative">
      <input
        v-model="searchInput"
        type="text"
        placeholder="Ordenar por..."
        class="w-full p-2 border-2 focus:outline-none border-tertiary-dark drop-shadow-items"
      />
      <span class="absolute top-2.5 right-3 material-icons-outlined">
        expand_more
      </span>
    </div>
  </div>
</template>
