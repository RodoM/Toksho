<script setup>
import { ref } from "vue";
import { supabase } from "@/supabase/supabase.js";
import { useRouter } from "vue-router";
import sbHelpers from "@/supabase/helpers.js";

import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import CustomButton from "@/lib/components/CustomButton.vue";

const router = useRouter();

const type = ref("manga");
const name = ref("");
const image = ref(null);
const imageURL = ref("");
const author = ref("");
const categories = ref("");
const price = ref("");
const discount = ref(null);
const description = ref("");
const stock = ref();

const getCategories = () => {
  return categories.value.split(/\s*,\s*/);
};

const getFile = () => {
  const selectedFile = event.target.files[0];
  image.value = selectedFile;
};

const addProduct = async (e) => {
  e.preventDefault();
  const results = await Promise.all([
    sbHelpers.uploadFile(name.value, image.value),
    sbHelpers.getFileURL(name.value),
  ]);
  imageURL.value = results[1];
  const { error } = await supabase.from("Products").insert([
    {
      name: name.value,
      type: type.value,
      categories: getCategories(),
      image: imageURL.value,
      price: price.value,
      discount: discount.value,
      stock: stock.value,
      author: author.value,
      description: description.value,
    },
  ]);
  if (error) console.log(error);
  else {
    // Disparar emit para mostrar un alert de que se creo correctamente el producto
    router.push({ name: "Stock" });
  }
};

const goBack = (e) => {
  e.preventDefault();
  router.push({ name: "Stock" });
};
</script>

<template>
  <div class="container py-5 mx-auto">
    <header-title class="mx-5 mb-5">
      <span class="text-2xl font-bold uppercase">AÑADIR PRODUCTO</span>
    </header-title>
    <form class="flex flex-col gap-4 mx-5">
      <div class="flex flex-col gap-4 md:flex-row">
        <div class="w-full">
          <label for="">Tipo de producto</label>
          <input
            v-model="type"
            type="text"
            placeholder="Tipo de producto"
            class="w-full p-2 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
          />
        </div>
        <div class="w-full">
          <label for="">Nombre del producto</label>
          <input
            v-model="name"
            type="text"
            placeholder="Nombre del producto"
            class="w-full p-2 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
          />
        </div>
      </div>
      <div class="flex flex-col gap-4 md:flex-row">
        <div class="w-full">
          <label for="">Imagen</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            class="block w-full bg-white border-2 cursor-pointer drop-shadow-items border-tertiary-dark focus:outline-none"
            @change="getFile"
          />
        </div>
        <div class="w-full">
          <label for="">Autor</label>
          <input
            v-model="author"
            type="text"
            placeholder="Autor"
            class="w-full p-2 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label for="">Categorías (separadas por comas)</label>
        <input
          v-model="categories"
          type="text"
          placeholder="Categorías"
          class="w-full p-2 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
        />
      </div>
      <div class="flex flex-col gap-4 md:flex-row">
        <div class="w-full">
          <label for="">Precio</label>
          <input
            v-model="price"
            type="number"
            placeholder="Precio"
            class="w-full p-2 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
          />
        </div>
        <div class="w-full">
          <label for="">Descuento (opcional)</label>
          <input
            v-model="discount"
            type="number"
            placeholder="Descuento"
            class="w-full p-2 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
          />
        </div>
        <div class="w-full">
          <label for="">Cantidad de stock</label>
          <input
            v-model="stock"
            type="number"
            placeholder="Cantidad de stock"
            class="w-full p-2 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label for="">Descripción</label>
        <textarea
          v-model="description"
          type="text"
          placeholder="Descripción"
          class="w-full p-2 border-2 border-tertiary-dark drop-shadow-items focus:outline-none h-80"
        />
      </div>
      <div class="flex flex-col justify-between gap-3 md:flex-row">
        <CustomButton class="px-36 md:order-2" primary @click="addProduct">
          AGREGAR
        </CustomButton>
        <CustomButton class="px-36 md:order-1" secondary @click="goBack">
          VOLVER
        </CustomButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
input[type="file"]::file-selector-button {
  cursor: pointer;
  background-color: #eeba5e;
  border: none;
  border-right: 2px solid #0f0f0f;
  padding: 8px;
}
</style>
