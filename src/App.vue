<script setup>
import { RouterView } from "vue-router";
import NavBar from "./components/frontend/layout/Navbar.vue";
</script>

<template>
  <main class="flex flex-col h-screen">
    <NavBar />
    <router-view
      v-slot="{ Component }"
      :key="$route.path"
      class="flex-1 mt-[66px]"
    >
      <transition name="fade" mode="out-in">
        <component :is="Component"></component>
      </transition>
    </router-view>
  </main>
</template>

<style>
body {
  background-color: #f8f9fa;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
