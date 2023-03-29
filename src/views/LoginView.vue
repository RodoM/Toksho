<script setup>
import { reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import { supabase } from "@/supabase/supabase.js";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

import CustomButton from "@/lib/components/CustomButton.vue";

const router = useRouter();
const $toast = useToast();

const state = reactive({
  email: "",
  password: "",
  confirmPassword: "",
});

const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage("Ingresa un correo electronico", required),
      email: helpers.withMessage("Ingresa un correo electronico valido", email),
    },
    password: {
      required: helpers.withMessage("Ingresa una contraseña", required),
    },
  };
});

const v$ = useVuelidate(rules, state);

const signInWithPassword = async () => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: state.email,
      password: state.password,
    });
    if (error) throw error;
    else {
      router.push({ name: "Home" });
      $toast.open({
        position: "top-right",
        message: "Inicio de sesión exitoso",
        type: "success",
        duration: 5000,
        dismissible: true,
        pauseOnHover: true,
      });
    }
  } catch (error) {
    $toast.open({
      position: "top-right",
      message: "Error al iniciar sesión",
      type: "error",
      duration: 5000,
      dismissible: true,
      pauseOnHover: true,
    });
    console.log(error);
  }
};

const submitForm = async (e) => {
  e.preventDefault();
  const result = await v$.value.$validate();
  if (result) signInWithPassword();
};
</script>

<template>
  <div class="flex items-center bg-comic">
    <div
      class="container flex flex-col max-w-3xl gap-6 px-5 py-10 mx-auto my-5 bg-white border-2 border-tertiary-dark drop-shadow-items"
    >
      <img
        src="@/assets/images/toksho-logo.png"
        alt=""
        class="h-[200px] mx-auto"
        loading="lazy"
      />
      <form action="" class="flex flex-col gap-5 px-5">
        <div>
          <div>
            <label :for="state.email">Email</label>
            <span v-if="v$.email.$error" class="pl-2 text-red-500">
              {{ v$.email.$errors[0].$message }}
            </span>
          </div>
          <input
            v-model="state.email"
            type="email"
            placeholder="Email"
            class="w-full p-3 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
          />
        </div>
        <div>
          <div>
            <label :for="state.password">Contraseña</label>
            <span v-if="v$.password.$error" class="pl-2 text-red-500">
              {{ v$.password.$errors[0].$message }}
            </span>
          </div>
          <input
            v-model="state.password"
            type="password"
            placeholder="Contraseña"
            class="w-full p-3 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
          />
        </div>
        <div class="flex justify-between">
          <span class="font-medium">Recordarme</span>
          <router-link to="/olvide-contrasena" class="font-medium">
            Olvide mi contraseña
          </router-link>
        </div>
        <CustomButton primary @click="submitForm">
          INICIAR SESIÓN
        </CustomButton>
      </form>
      <span class="text-sm font-bold text-center">O</span>
      <div class="flex flex-col gap-6 px-5 lg:flex-row">
        <CustomButton facebook>
          <img
            src="@/assets/svgs/facebook-icon.svg"
            alt="facebook logo"
            loading="lazy"
          />
          <span class="text-sm font-bold text-white">
            INGRESAR CON FACEBOOK
          </span>
        </CustomButton>
        <CustomButton google>
          <img
            src="@/assets/svgs/google-icon.svg"
            alt="google logo"
            loading="lazy"
          />
          <span class="text-sm font-bold text-slate-500">
            INGRESAR CON GOOGLE
          </span>
        </CustomButton>
      </div>
      <span class="font-medium text-center">
        ¿Todavía no sos usuario?
        <router-link :to="'/registro'" class="font-bold">
          Registrate
        </router-link>
      </span>
    </div>
  </div>
</template>
