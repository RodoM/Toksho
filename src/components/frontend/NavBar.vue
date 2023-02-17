<script setup>
import { ref, reactive } from "vue";

//navbar
const isOpen = ref(false);
const links = reactive([
  { name: "INICIO", path: "/", icon: "home" },
  { name: "PRODUCTOS", path: "/productos", icon: "shopping_bag" },
  { name: "PREGUNTAS", path: "/preguntas", icon: "help_outline" },
  { name: "CONTACTO", path: "/contacto", icon: "place" },
  { name: "INGRESAR", path: "/ingresar", icon: "login" },
]);
</script>

<template>
  <nav>
    <div
      class="bg-primary flex flex-wrap items-center justify-between py-3 px-2 sm:px-4 border-b-2 border-b-tertiary-dark"
    >
      <div class="w-14 flex items-center justify-start md:!hidden">
        <button class="material-icons-outlined" @click="isOpen = !isOpen">
          menu
        </button>
      </div>
      <a class="p-1" href="#"><span class="font-bold text-2xl">TOKSHO</span></a>
      <ul class="hidden md:flex gap-6">
        <li
          v-for="(link, index) in links"
          :key="link.name"
          class="hover:bg-secondary-light p-1 border-2 border-transparent hover:border-tertiary-dark transition-all duration-200 hover:drop-shadow-navlink"
        >
          <router-link v-if="index < 4" class="font-medium" :to="link.path">{{
            link.name
          }}</router-link>
        </li>
      </ul>
      <div class="flex items-center gap-2">
        <button class="material-icons-outlined">person</button>
        <button class="material-icons-outlined">shopping_cart</button>
      </div>
    </div>
    <div
      class="w-1/2 md:w-1/4 h-screen absolute bg-background border-r-2 border-r-tertiary-dark transition-all duration-700 md:hidden"
      :class="isOpen ? 'translate-x-0' : '-translate-x-96'"
    >
      <ul class="flex flex-col gap-4 p-5">
        <li
          v-for="link in links"
          :key="link.name"
          class="hover:bg-secondary-light p-1 border-2 border-transparent hover:border-tertiary-dark transition-all duration-200 hover:drop-shadow-navlink"
        >
          <router-link
            class="flex items-center gap-2 text-sm font-medium"
            :to="link.path"
            @click="isOpen = !isOpen"
          >
            <span class="material-icons-outlined">{{ link.icon }}</span>
            {{ link.name }}
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
