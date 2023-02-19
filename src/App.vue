<script setup>
import { RouterView } from "vue-router";
import NavBar from "./components/frontend/layout/Navbar.vue";
import Footer from "./components/frontend/layout/Footer.vue";
</script>

<template>
  <div class="flex flex-col justify-between h-screen">
    <div>
      <NavBar />
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component"></component>
        </transition>
      </router-view>
    </div>
    <Footer />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
