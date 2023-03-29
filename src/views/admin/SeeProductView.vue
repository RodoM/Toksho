<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getProductDetails } from "@/supabase/helpers.js";

import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import CustomButton from "@/lib/components/CustomButton.vue";

const router = useRouter();
const route = useRoute();

const product = ref();

onMounted(async () => {
  product.value = await getProductDetails(route.params.id);
});

const goBack = (e) => {
  e.preventDefault();
  router.push({ name: "Stock" });
};
</script>

<template>
  <div class="container py-5 mx-auto">
    <header-title class="mx-5 mb-5">
      <span class="text-2xl font-bold uppercase">EDITAR PRODUCTO</span>
    </header-title>
    <form v-if="product" class="flex flex-col gap-4 mx-5">
      <div class="flex flex-col gap-4 md:flex-row">
        <img
          :src="product.image"
          alt=""
          class="md:h-[596px] md:w-[503px] lg:h-[572px] lg:min-w-[468px] border-2 border-tertiary-dark drop-shadow-items"
        />
        <div class="flex flex-col w-full gap-4">
          <div class="w-full">
            <label for="">Tipo de producto</label>
            <input
              v-model="product.type"
              disabled
              type="text"
              placeholder="Tipo de producto"
              class="w-full p-2 border-2 bg-tertiary-light border-tertiary-dark drop-shadow-items focus:outline-none"
            />
          </div>
          <div class="w-full">
            <label for="">Nombre del producto</label>
            <input
              v-model="product.name"
              disabled
              type="text"
              placeholder="Nombre del producto"
              class="w-full p-2 border-2 bg-tertiary-light border-tertiary-dark drop-shadow-items focus:outline-none"
            />
          </div>
          <div class="w-full">
            <label for="">Autor</label>
            <input
              v-model="product.author"
              disabled
              type="text"
              placeholder="Autor"
              class="w-full p-2 border-2 bg-tertiary-light border-tertiary-dark drop-shadow-items focus:outline-none"
            />
          </div>
          <div>
            <label for="">Categorías (separadas por comas)</label>
            <input
              v-model="product.categories"
              disabled
              type="text"
              placeholder="Categorías"
              class="w-full p-2 border-2 bg-tertiary-light border-tertiary-dark drop-shadow-items focus:outline-none"
            />
          </div>
          <div class="w-full">
            <label for="">Precio</label>
            <input
              v-model="product.price"
              disabled
              type="number"
              placeholder="Precio"
              class="w-full p-2 border-2 bg-tertiary-light border-tertiary-dark drop-shadow-items focus:outline-none"
            />
          </div>
          <div class="w-full">
            <label for="">Descuento (opcional)</label>
            <input
              v-model="product.discount"
              disabled
              type="number"
              placeholder="Descuento"
              class="w-full p-2 border-2 bg-tertiary-light border-tertiary-dark drop-shadow-items focus:outline-none"
            />
          </div>
          <div class="w-full">
            <label for="">Cantidad de stock</label>
            <input
              v-model="product.stock"
              disabled
              type="number"
              placeholder="Cantidad de stock"
              class="w-full p-2 border-2 bg-tertiary-light border-tertiary-dark drop-shadow-items focus:outline-none"
            />
          </div>
        </div>
      </div>
      <div>
        <label for="">Descripción</label>
        <textarea
          v-model="product.description"
          disabled
          type="text"
          placeholder="Descripción"
          class="w-full p-2 border-2 bg-tertiary-light border-tertiary-dark drop-shadow-items focus:outline-none h-80"
        />
      </div>
      <div class="flex flex-col justify-between gap-3 md:flex-row">
        <router-link
          :to="{
            name: 'EditProduct',
            params: { id: product.id },
          }"
          class="md:order-2"
        >
          <CustomButton class="md:px-36" primary> EDITAR </CustomButton>
        </router-link>
        <CustomButton class="md:px-36 md:order-1" secondary @click="goBack">
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
