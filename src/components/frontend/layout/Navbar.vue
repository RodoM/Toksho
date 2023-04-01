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
          class="p-1 transition-all duration-200 border-2 border-transparent hover:bg-secondary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
        >
          <router-link class="font-medium" to="/"> INICIO </router-link>
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
              class="p-1 transition-all duration-200 border-2 border-transparent hover:bg-primary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
              @click="dropdown = false"
            >
              <router-link to="/admin/listado" class="font-medium">
                LISTADO
              </router-link>
            </li>
            <li
              class="p-1 transition-all duration-200 border-2 border-transparent hover:bg-primary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
              @click="dropdown = false"
            >
              <router-link to="/admin/listado" class="font-medium">
                PEDIDOS
              </router-link>
            </li>
            <li
              class="p-1 transition-all duration-200 border-2 border-transparent hover:bg-primary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
              @click="dropdown = false"
            >
              <router-link to="/admin/listado" class="font-medium">
                CONFIGURACIÓN
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
          class="!hidden lg:!block material-icons-outlined"
        >
          login
        </router-link>
        <router-link
          v-else
          to="/"
          class="!hidden lg:!block material-icons-outlined"
          @click="signOut()"
        >
          logout
        </router-link>
      </div>
    </div>
    <div
      class="absolute h-screen transition-all duration-500 border-r-2 bg-background border-r-tertiary-dark lg:hidden"
      :class="isOpen ? 'translate-x-0' : '-translate-x-[510px]'"
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
              class="p-1 transition-all duration-200 border-2 border-transparent hover:bg-secondary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
              @click="(isOpen = false), (dropdown = false)"
            >
              <router-link to="/admin/listado" class="font-medium">
                LISTADO
              </router-link>
            </li>
            <li
              class="p-1 transition-all duration-200 border-2 border-transparent hover:bg-secondary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
              @click="(isOpen = false), (dropdown = false)"
            >
              <router-link to="/admin/listado" class="font-medium">
                PEDIDOS
              </router-link>
            </li>
            <li
              class="p-1 transition-all duration-200 border-2 border-transparent hover:bg-secondary-light hover:border-tertiary-dark hover:drop-shadow-navlink"
              @click="(isOpen = false), (dropdown = false)"
            >
              <router-link to="/admin/listado" class="font-medium">
                CONFIGURACIÓN
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
