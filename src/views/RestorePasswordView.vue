<script setup>
import { ref } from "vue";
import { supabase } from "@/supabase/supabase.js";
import { useRouter } from "vue-router";

import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";
import CustomButton from "@/lib/components/CustomButton.vue";

const router = useRouter();

const newPassword = ref("");

const resetPassword = async (e) => {
  e.preventDefault();
  const { error } = await supabase.auth.updateUser({
    password: newPassword.value,
  });
  if (error) console.log(error);
  // Disparar alerta diciendo que se restableció la contraseña correctamente
  else router.push({ name: "Home" });
};
</script>

<template>
  <div class="flex items-center justify-center bg-comic">
    <content-block class="flex flex-col items-center justify-center max-w-md px-5">
      <span>Ingrese tu nueva contraseña contraseña</span>
      <form class="flex flex-col w-full gap-4">
        <input v-model="newPassword" type="password" placeholder="Nueva contraseña"
          class="w-full p-3 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
        />
        <CustomButton primary class="w-full" @click="resetPassword">
          RESTABLECER CONTRASEÑA
        </CustomButton>
      </form>
    </content-block>
  </div>
</template>
