<!-- eslint-disable vue/multi-word-component-names -->
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
  <nav class="fixed top-0 z-50 w-full">
    <div
      class="flex flex-wrap items-center justify-between px-2 py-3 border-b-2 bg-primary sm:px-4 border-b-tertiary-dark"
    >
      <div class="w-14 flex items-center justify-start md:!hidden">
        <button class="material-icons-outlined" @click="isOpen = !isOpen">
          menu
        </button>
      </div>
      <a class="p-1" href="#"><span class="text-2xl font-bold">TOKSHO</span></a>
      <ul class="hidden gap-6 md:flex">
        <li
          v-for="link in links.slice(0, 4)"
          :key="link.name"
          class="p-1 transition-all duration-200 border-2 border-transparent hover:bg-secondary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
        >
          <router-link class="font-medium" :to="link.path">
            {{ link.name }}
          </router-link>
        </li>
      </ul>
      <div class="flex items-center gap-2">
        <router-link to="/ingresar" class="material-icons-outlined">
          person
        </router-link>
        <router-link to="/carrito" class="material-icons-outlined">
          shopping_cart
        </router-link>
      </div>
    </div>
    <div
      class="absolute w-1/2 h-screen transition-all duration-500 border-r-2 md:w-1/4 bg-background border-r-tertiary-dark md:hidden"
      :class="isOpen ? 'translate-x-0' : '-translate-x-96'"
    >
      <ul class="flex flex-col gap-4 p-5">
        <li
          v-for="link in links"
          :key="link.name"
          class="p-1 transition-all duration-200 border-2 border-transparent hover:bg-secondary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
        >
          <router-link
            class="flex items-center gap-2 font-medium"
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
