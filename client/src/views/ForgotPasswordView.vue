<script setup>
import { ref } from "vue";
import { sendForgotPassword } from "@/supabase/helpers";

import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";
import CustomButton from "@/lib/components/CustomButton.vue";

const email = ref();
const loading = ref(false);

const forgotPassword = async () => {
  if (!loading.value) {
    loading.value = true;
    await sendForgotPassword(email.value);
  }
  loading.value = false;
};
</script>

<template>
  <div class="flex items-center justify-center bg-comic">
    <content-block class="flex max-w-lg flex-col items-center justify-center gap-y-5 px-5">
      <span class="font-medium"> Ingrese el mail de tu cuenta para cambiar tu contraseña </span>
      <div class="flex w-full flex-col gap-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full border-2 border-tertiary-dark p-3 drop-shadow-items focus:outline-none"
        />
        <CustomButton primary class="w-full" :loading="loading" @click="forgotPassword"> CONTINUAR </CustomButton>
      </div>
    </content-block>
  </div>
</template>
