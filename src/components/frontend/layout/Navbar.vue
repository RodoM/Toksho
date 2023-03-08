<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, computed } from "vue";
import { userStore } from "@/stores/index.js";
import { supabase } from "@/supabase/supabase.js";

const store = userStore();
const user = computed(() => store.user);

//navbar
const isOpen = ref(false);

const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.log(error);
  }
};
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
      <router-link to="/" class="p-1"><span class="text-2xl font-bold">TOKSHO</span></router-link>
      <ul class="hidden gap-6 md:flex">
        <li
          class="p-1 transition-all duration-200 border-2 border-transparent hover:bg-secondary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
        >
          <router-link class="font-medium" to="/">
            INICIO
          </router-link>
        </li>
        <li
          class="p-1 transition-all duration-200 border-2 border-transparent hover:bg-secondary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
        >
          <router-link class="font-medium" to="/productos">
            PRODUCTOS
          </router-link>
        </li>
        <li
          class="p-1 transition-all duration-200 border-2 border-transparent hover:bg-secondary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
        >
          <router-link class="font-medium" to="/preguntas">
            PREGUNTAS
          </router-link>
        </li>
        <li
          class="p-1 transition-all duration-200 border-2 border-transparent hover:bg-secondary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
        >
          <router-link class="font-medium" to="/contacto">
            CONTACTO
          </router-link>
        </li>
      </ul>
      <div class="flex items-center gap-2">
        <router-link to="/perfil" class="material-icons-outlined">
          person
        </router-link>
        <router-link to="/carrito" class="material-icons-outlined">
          shopping_cart
        </router-link>
        <router-link v-if="!user" to="/ingresar" class="!hidden md:!block material-icons-outlined">
          login
        </router-link>
        <router-link v-else to="/" class="!hidden md:!block material-icons-outlined" @click="signOut()">
          logout
        </router-link>
      </div>
    </div>
    <div
      class="absolute w-1/2 h-screen transition-all duration-500 border-r-2 md:w-1/4 bg-background border-r-tertiary-dark md:hidden"
      :class="isOpen ? 'translate-x-0' : '-translate-x-96'"
    >
      <ul class="flex flex-col gap-4 p-5">
        <li
          class="p-1 transition-all duration-200 border-2 border-transparent hover:bg-secondary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
        >
          <router-link
            class="flex items-center gap-2 font-medium"
            to="/"
            @click="isOpen = !isOpen"
          >
            <span class="material-icons-outlined">home</span>
            INICIO
          </router-link>
        </li>
        <li
          class="p-1 transition-all duration-200 border-2 border-transparent hover:bg-secondary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
        >
          <router-link
            class="flex items-center gap-2 font-medium"
            to="/productos"
            @click="isOpen = !isOpen"
          >
            <span class="material-icons-outlined">shopping_bag</span>
            PRODUCTOS
          </router-link>
        </li>
        <li
          class="p-1 transition-all duration-200 border-2 border-transparent hover:bg-secondary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
        >
          <router-link
            class="flex items-center gap-2 font-medium"
            to="/preguntas"
            @click="isOpen = !isOpen"
          >
            <span class="material-icons-outlined">help_outline</span>
            PREGUNTAS
          </router-link>
        </li>
        <li
          class="p-1 transition-all duration-200 border-2 border-transparent hover:bg-secondary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
        >
          <router-link
            class="flex items-center gap-2 font-medium"
            to="/contacto"
            @click="isOpen = !isOpen"
          >
            <span class="material-icons-outlined">place</span>
            CONTACTO
          </router-link>
        </li>
        <li
          v-if="!user"
          class="p-1 transition-all duration-200 border-2 border-transparent hover:bg-secondary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
        >
          <router-link
            class="flex items-center gap-2 font-medium"
            to="/ingresar"
            @click="isOpen = !isOpen"
          >
            <span class="material-icons-outlined">login</span>
            INGRESAR
          </router-link>
        </li>
        <li
          v-if="user"
          class="p-1 transition-all duration-200 border-2 border-transparent hover:bg-secondary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
        >
          <router-link
            class="flex items-center gap-2 font-medium"
            to="/"
            @click="(isOpen = !isOpen), signOut()"
          >
            <span class="material-icons-outlined">logout</span>
            SALIR
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
