<script setup>
import sbHelpers from "@/supabase/helpers.js";
import { userStore } from "@/stores/index.js";

const store = userStore();

const isAdmin = async () => {
  const admin = await sbHelpers.userIsAdmin(store.user.id);
  console.log(admin);
};
</script>

<template>
  <div class="container py-5 mx-auto">
    <button @click="isAdmin">Soy admin?</button>
  </div>
</template>
