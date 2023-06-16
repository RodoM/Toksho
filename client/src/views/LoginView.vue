<script setup>
import { ref, reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import { supabase } from "@/supabase/supabase.js";
import { userStore } from "@/stores/index.js";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import { getSessionData } from "@/supabase/helpers.js";

import CustomButton from "@/lib/components/CustomButton.vue";

const store = userStore();
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

const loading = ref(false);

const signInWithPassword = async () => {
  if (!loading.value) {
    try {
      loading.value = true;
      const { error } = await supabase.auth.signInWithPassword({
        email: state.email,
        password: state.password,
      });
      if (error) throw error;
      else {
        const res = await getSessionData();
        await store.setUser(res.session);
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
      let errMessage = "";
      if (error.message.includes("Invalid"))
        errMessage = "Credenciales invalidas";
      else errMessage = "Error al inicar sesión";
      $toast.open({
        position: "top-right",
        message: errMessage,
        type: "error",
        duration: 5000,
        dismissible: true,
        pauseOnHover: true,
      });
      console.log(error);
    }
    loading.value = false;
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
        <router-link to="/olvide-contrasena" class="font-medium">
          Olvide mi contraseña
        </router-link>
        <CustomButton class="flex justify-center" primary @click="submitForm">
          <svg
            v-if="loading"
            aria-hidden="true"
            class="w-5 h-5 text-tertiary-light animate-spin fill-primary"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span v-else>INICIAR SESIÓN</span>
        </CustomButton>
      </form>
      <!-- <span class="text-sm font-bold text-center">O</span>
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
      </div> -->
      <span class="font-medium text-center">
        ¿Todavía no sos usuario?
        <router-link :to="'/registro'" class="font-bold">
          Registrate
        </router-link>
      </span>
    </div>
  </div>
</template>
