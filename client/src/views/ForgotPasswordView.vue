<script setup>
import { ref } from "vue";
import { supabase } from "@/supabase/supabase.js";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";
import CustomButton from "@/lib/components/CustomButton.vue";

const router = useRouter();
const $toast = useToast();

const email = ref("");

const forgotPassword = async (e) => {
  e.preventDefault();
  let { error } = await supabase.auth.resetPasswordForEmail(email.value);
  if (error) {
    $toast.open({
      position: "top-right",
      message: "Error recuperar contraseña",
      type: "error",
      duration: 5000,
      dismissible: true,
      pauseOnHover: true,
    });
    console.log(error);
  } else {
    $toast.open({
      position: "top-right",
      message: "Se te envió un correo para recuperar tu contraseña",
      type: "success",
      duration: 5000,
      dismissible: true,
      pauseOnHover: true,
    });
    router.push({ name: "Home" });
  }
};
</script>

<template>
  <div class="flex items-center justify-center bg-comic">
    <content-block
      class="flex flex-col items-center justify-center max-w-lg px-5 gap-y-5"
    >
      <span class="font-medium">
        Ingrese el mail de tu cuenta para cambiar tu contraseña
      </span>
      <form class="flex flex-col w-full gap-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full p-3 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
        />
        <CustomButton primary class="w-full" @click="forgotPassword">
          CONTINUAR
        </CustomButton>
      </form>
    </content-block>
  </div>
</template>
