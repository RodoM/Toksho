<script setup>
import { ref } from "vue";

const searchInput = ref("");
</script>
<template>
  <div class="flex border-2 border-tertiary-dark drop-shadow-items">
    <input
      v-model="searchInput"
      type="text"
      placeholder="Buscar ID..."
      class="w-full p-2 focus:outline-none"
      @keyup.enter="$emit('search', searchInput)"
    />
    <button class="material-icons-outlined border-l-2 border-tertiary-dark bg-primary-light p-2" @click="$emit('search', searchInput)">
      search
    </button>
  </div>
</template>
