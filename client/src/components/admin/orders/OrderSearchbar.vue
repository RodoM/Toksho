<script setup>
import { ref } from "vue";

const searchInput = ref("");
</script>
<template>
  <div class="flex w-full mb-5 border-2 border-tertiary-dark drop-shadow-items">
    <input
      v-model="searchInput"
      type="text"
      placeholder="ID de orden"
      class="w-full p-2 focus:outline-none"
      @keyup.enter="$emit('search', searchInput)"
    />
    <button
      class="p-2 border-l-2 material-icons-outlined border-tertiary-dark bg-primary-light"
      @click="$emit('search', searchInput)"
    >
      search
    </button>
  </div>
</template>
