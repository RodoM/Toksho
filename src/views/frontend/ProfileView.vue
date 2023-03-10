<script setup>
import { ref } from "vue";
import { supabase } from "@/supabase/supabase.js";
import sbHelpers from "@/supabase/helpers.js";

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

const file = ref();

const getFile = () => {
  const selectedFile = event.target.files[0];
  console.log(selectedFile);
  file.value = selectedFile;
};

const uploadFile = async () => {
  const { error } = await supabase.storage
    .from("products")
    .upload("images/prueba.png", file.value, {
      cacheControl: "3600",
      upsert: false,
    });
  if (error) console.log(error);
};

const getURL = async () => {
  const res = await sbHelpers.getFileURL("prueba.png");
  console.log(res);
};
</script>

<template>
  <div class="container py-5 mx-auto">
    <button class="p-4 border-2 bg-primary-light border-tertiary-dark drop-shadow-items" @click="addProduct">añadir producto</button>
    <div v-if="noPermissionsErr" class="mt-5 text-4xl font-bold text-red-600">NO PODES AGREGAR PRODUCTOS, NO SOS AGUSTIN IBARRA BERNERI PELOTUDOOO</div>

    <div class="flex flex-col gap-3 m-5">
      <input id="fileInput" type="file" accept="image/png, image/jpeg" @change="getFile" />
      <button class="p-2 border-2 w-fit bg-primary-light border-tertiary-dark" @click="uploadFile">SUBIR ARCHIVO</button>
      <button class="p-2 border-2 w-fit bg-primary-light border-tertiary-dark" @click="getURL">URL</button>
    </div>
  </div>
</template>
