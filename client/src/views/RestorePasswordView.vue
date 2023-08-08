<script setup>
import { ref } from "vue";
import { updatePassword } from "@/supabase/helpers";

import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";
import CustomButton from "@/lib/components/CustomButton.vue";

const newPassword = ref("");

const resetPassword = async (event) => {
  event.preventDefault();
  await updatePassword(newPassword.value);
};
</script>

<template>
  <div class="flex items-center justify-center bg-comic">
    <content-block class="flex max-w-md flex-col items-center justify-center px-5">
      <span>Ingrese tu nueva contraseña contraseña</span>
      <form class="flex w-full flex-col gap-4">
        <input
          v-model="newPassword"
          type="password"
          placeholder="Nueva contraseña"
          class="w-full border-2 border-tertiary-dark p-3 drop-shadow-items focus:outline-none"
        />
        <CustomButton primary class="w-full" @click="resetPassword"> RESTABLECER CONTRASEÑA </CustomButton>
      </form>
    </content-block>
  </div>
</template>
