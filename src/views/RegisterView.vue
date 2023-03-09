<script setup>
import { ref } from "vue";
import { supabase } from "@/supabase/supabase.js";

import CustomButton from "@/lib/components/CustomButton.vue";

const email = ref("");
const password = ref("");
// const confirmPassword = ref("");

const successfulRegister = ref(false);

const signUp = async (e) => {
  e.preventDefault();
  try {
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;
    successfulRegister.value = true;
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <div class="flex items-center bg-comic">
    <div
      class="container flex flex-col max-w-3xl gap-6 px-5 py-10 mx-auto my-5 bg-white border-2 border-tertiary-dark drop-shadow-items"
    >
      <div
        v-if="successfulRegister"
        class="flex justify-between p-5 mx-5 transition-all bg-green-300 border-2 border-tertiary-dark"
      >
        <span class="font-medium">
          Registro exitoso, revisa tu mail para continuar.
        </span>
        <button class="mb-auto material-icons-outlined">close</button>
      </div>
      <form action="" class="flex flex-col px-5 gap-9">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full p-3 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
          class="w-full p-3 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
        />
        <!-- <input
          v-model="confirmPassword"
          type="password"
          placeholder="Contraseña"
          class="w-full p-3 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
        /> -->
        <CustomButton primary @click="signUp">REGISTRARSE</CustomButton>
      </form>
      <span class="text-sm font-bold text-center">O</span>
      <div class="flex flex-col gap-6 px-5 lg:flex-row">
        <CustomButton facebook>
          <img src="@/assets/svgs/facebook-icon.svg" alt="" />
          <span class="text-sm font-bold text-white">
            REGISTRARSE CON FACEBOOK
          </span>
        </CustomButton>
        <CustomButton google>
          <img src="@/assets/svgs/google-icon.svg" alt="" />
          <span class="text-sm font-bold text-slate-500">
            REGISTRARSE CON GOOGLE
          </span>
        </CustomButton>
      </div>
      <span class="font-medium text-center">
        ¿Ya sos usuario?
        <router-link :to="'/ingresar'" class="font-bold">
          Iniciar sesión
        </router-link>
      </span>
    </div>
  </div>
</template>
