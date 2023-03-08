<script setup>
import { ref } from "vue";
import { supabase } from "@/supabase/supabase.js";

const noPermissionsErr = ref(false);

const addProduct = async () => {
  const { error } = await supabase.from("Products").insert([
    {
      name: "prueba",
      image: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg",
      price: 5000,
      stock: 10,
      author: "yop",
      description: "loool",
      categories: ["prueba", "pruebon"],
    },
  ]);
  if (error) {
    console.log(error);
    noPermissionsErr.value = true;
  }
};
</script>

<template>
  <div class="container py-5 mx-auto">
    <button class="p-4 border-2 bg-primary-light border-tertiary-dark drop-shadow-items" @click="addProduct">añadir producto</button>
    <div v-if="noPermissionsErr" class="mt-5 text-4xl font-bold text-red-600">NO PODES AGREGAR PRODUCTOS, NO SOS AGUSTIN IBARRA BERNERI PELOTUDOOO</div>
  </div>
</template>
