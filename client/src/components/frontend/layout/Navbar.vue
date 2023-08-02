<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, computed } from "vue";
import { userStore } from "@/stores/index.js";
import { supabase } from "@/supabase/supabase.js";
import { useToast } from "vue-toast-notification";
import { getSessionData } from "@/supabase/helpers.js";

const $toast = useToast();
const store = userStore();
const user = computed(() => store.user);

//navbar
const isOpen = ref(false);
const dropdown = ref(false);

const routes = ref([
  { id: 1, name: "INICIO", path: "/", icon: "home" },
  { id: 2, name: "PRODUCTOS", path: "/productos", icon: "shopping_bag" },
  { id: 3, name: "PREGUNTAS", path: "/preguntas", icon: "help_outline" },
  { id: 4, name: "CONTACTO", path: "/contacto", icon: "place" },
]);

const adminRoutes = ref([
  { id: 5, name: "PRODUCTOS", path: "/admin/productos" },
  { id: 6, name: "ORDENES", path: "/admin/ordenes" },
  { id: 7, name: "CONGIFURACIÓN", path: "/admin/configuraciones" },
]);

const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    else {
      const res = await getSessionData();
      await store.setUser(res.session);
      $toast.open({
        position: "top-right",
        message: "Cierre de sesión exitoso",
        type: "success",
        duration: 5000,
        dismissible: true,
        pauseOnHover: true,
      });
    }
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
      <div class="w-14 flex items-center justify-start lg:!hidden">
        <button class="material-icons-outlined" @click="isOpen = !isOpen">
          menu
        </button>
      </div>
      <router-link to="/" class="flex items-center gap-2">
        <img
          src="@/assets/images/toksho-logo-clear.png"
          alt=""
          loading="lazy"
          class="h-[37px]"
        />
        <span class="text-2xl font-bold">TOKSHO</span>
      </router-link>
      <ul class="items-center hidden gap-6 lg:flex">
        <li
          v-for="route in routes"
          :key="route.id"
          class="p-1 transition-all duration-200 border-2 border-transparent hover:bg-secondary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
        >
          <router-link class="font-medium" :to="route.path">
            {{ route.name }}
          </router-link>
        </li>
        <li v-if="user && user.isAdmin">
          <button
            class="flex items-center p-1 font-medium transition-all duration-200 border-2 border-transparent hover:bg-secondary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
            :class="[
              dropdown
                ? [
                    'bg-secondary-light',
                    '!border-tertiary-dark',
                    'drop-shadow-navlink',
                  ]
                : '',
            ]"
            @click="dropdown = !dropdown"
          >
            PANEL DE ADMIN
            <span class="material-icons-outlined"> arrow_drop_down </span>
          </button>
          <ul
            v-if="dropdown"
            class="p-2 flex flex-col gap-1 absolute w-[167.63px] bg-secondary-light border-2 border-tertiary-dark drop-shadow-navlink top-14"
          >
            <li
              v-for="route in adminRoutes"
              :key="route.id"
              class="p-1 transition-all duration-200 border-2 border-transparent hover:bg-primary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
              @click="dropdown = false"
            >
              <router-link :to="route.path" class="font-medium">
                {{ route.name }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
      <div class="flex items-center gap-2">
        <router-link to="/perfil" class="material-icons-outlined">
          person
        </router-link>
        <router-link to="/carrito" class="material-icons-outlined">
          shopping_cart
        </router-link>
        <router-link
          v-if="!user"
          to="/ingresar"
          class="items-center !hidden lg:!flex"
        >
          <span class="material-icons-outlined">login</span>
          <span class="font-medium">Ingresar</span>
        </router-link>
        <router-link
          v-else
          to="/"
          class="items-center !hidden lg:!flex"
          @click="signOut()"
        >
          <span class="material-icons-outlined">logout</span>
          <span class="font-medium">Salir</span>
        </router-link>
      </div>
    </div>
    <div
      class="absolute h-screen transition-all duration-500 border-r-2 bg-background border-r-tertiary-dark lg:hidden"
      :class="isOpen ? 'translate-x-0' : '-translate-x-[510px]'"
    >
      <ul class="flex flex-col gap-4 p-5">
        <li
          v-for="route in routes"
          :key="route.id"
          class="p-1 transition-all duration-200 border-2 border-transparent hover:bg-secondary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
        >
          <router-link
            class="flex items-center gap-2 font-medium"
            :to="route.path"
            @click="isOpen = !isOpen"
          >
            <span class="material-icons-outlined">{{ route.icon }}</span>
            {{ route.name }}
          </router-link>
        </li>
        <li v-if="user && user.isAdmin">
          <button
            class="flex items-center gap-2 p-1 font-medium transition-all duration-200 border-2 border-transparent text-start hover:bg-secondary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
            @click="dropdown = !dropdown"
          >
            <span class="material-icons-outlined">admin_panel_settings</span>
            PANEL DE ADMIN
            <span class="material-icons-outlined"> arrow_drop_down </span>
          </button>
          <ul v-if="dropdown" class="flex flex-col gap-2 pt-2 pl-8">
            <li
              v-for="route in adminRoutes"
              :key="route.id"
              class="p-1 transition-all duration-200 border-2 border-transparent hover:bg-secondary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
              @click="(isOpen = false), (dropdown = false)"
            >
              <router-link :to="route.path" class="font-medium">
                {{ route.name }}
              </router-link>
            </li>
          </ul>
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
