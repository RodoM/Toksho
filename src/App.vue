<script setup>
import { RouterView } from "vue-router";
import { supabase } from "@/supabase/supabase.js";
import { userStore } from "@/stores/index.js";

import NavBar from "./components/frontend/layout/Navbar.vue";

const store = userStore();

supabase.auth.onAuthStateChange((_, session) => {
  store.setUser(session);
});
</script>

<template>
  <main class="flex flex-col h-screen">
    <NavBar />
    <router-view v-slot="{ Component }" class="flex-1 mt-[63px]">
      <transition name="fade" mode="out-in">
        <component :key="$route.path" :is="Component"></component>
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
