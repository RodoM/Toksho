<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { uploadFile, createProduct } from "@/supabase/helpers";
import { initialState, resetForm, v$ } from "@/lib/composables/productHelper";
import { getFile } from "@/lib/composables/imageHelper";

import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import CustomButton from "@/lib/components/CustomButton.vue";

const router = useRouter();

const getCategories = () => {
  return initialState.categories.split(/\s*,\s*/);
};

const getInputFile = (event) => {
  getFile(event, initialState);
};

const loading = ref(false);

const addProduct = async () => {
  if (!loading.value) {
    loading.value = true;
    const { author, name, image, type, size, editorial, price, discount, stock, description } = initialState;

    const imageURL = await uploadFile(author, name, image.image);
    await createProduct(type, name, imageURL, size, author, editorial, getCategories(), price, discount, stock, description);
    resetForm();
  }
};

const goBack = (e) => {
  e.preventDefault();
  resetForm();
  router.push({ name: "Stock" });
};

const submitForm = async (e) => {
  e.preventDefault();
  const result = await v$.value.$validate();
  if (result) addProduct();
};
</script>

<template>
  <div class="container mx-auto py-5">
    <header-title class="mx-5 mb-5">
      <span class="text-2xl font-bold uppercase">AÑADIR PRODUCTO</span>
    </header-title>
    <form class="mx-5 flex flex-col gap-4">
      <div class="flex flex-col gap-4 lg:flex-row">
        <img
          :src="initialState.image.imageReader"
          alt="placeholder de imagen"
          loading="lazy"
          class="border-2 border-tertiary-dark bg-slate-400 drop-shadow-items lg:h-[656px] lg:min-w-[468px] lg:max-w-[468px]"
        />
        <div class="flex w-full flex-col justify-between gap-4 lg:gap-0">
          <div class="w-full">
            <div>
              <label :for="initialState.type">Tipo de producto</label>
              <span v-if="v$.type.$error" class="pl-2 text-red-500">
                {{ v$.type.$errors[0].$message }}
              </span>
            </div>
            <v-select
              v-model="initialState.type"
              :placeholder="'Tipo de producto'"
              :options="['Manga', 'Comic', 'Indumentaria']"
              :clearSearchOnSelect="false"
              class="w-full border-2 border-tertiary-dark bg-background p-1 drop-shadow-items focus:outline-none"
            ></v-select>
          </div>
          <div class="w-full">
            <div>
              <label :for="initialState.name">Nombre del producto</label>
              <span v-if="v$.name.$error" class="pl-2 text-red-500">
                {{ v$.name.$errors[0].$message }}
              </span>
            </div>
            <input
              v-model="initialState.name"
              type="text"
              placeholder="Nombre del producto"
              class="w-full border-2 border-tertiary-dark p-2 drop-shadow-items focus:outline-none"
            />
          </div>
          <div class="flex flex-col gap-4 md:flex-row">
            <div class="w-full">
              <div>
                <label :for="initialState.image.image">Imágen</label>
                <span v-if="v$.image.image.$error" class="pl-2 text-red-500">
                  {{ v$.image.image.$errors[0].$message }}
                </span>
              </div>
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                class="block w-full cursor-pointer border-2 border-tertiary-dark bg-white drop-shadow-items focus:outline-none"
                @change="getInputFile"
              />
            </div>
            <div class="w-full">
              <div>
                <label :for="initialState.size">Tamaño</label>
                <span v-if="v$.size.$error" class="pl-2 text-red-500">
                  {{ v$.size.$errors[0].$message }}
                </span>
              </div>
              <input
                v-model="initialState.size"
                type="text"
                placeholder="Tamaño del producto"
                class="w-full border-2 border-tertiary-dark p-2 drop-shadow-items focus:outline-none"
              />
            </div>
          </div>
          <div class="w-full">
            <div>
              <label :for="initialState.author">Autor</label>
              <span v-if="v$.author.$error" class="pl-2 text-red-500">
                {{ v$.author.$errors[0].$message }}
              </span>
            </div>
            <input
              v-model="initialState.author"
              type="text"
              placeholder="Autor"
              class="w-full border-2 border-tertiary-dark p-2 drop-shadow-items focus:outline-none"
            />
          </div>
          <div class="w-full">
            <div>
              <label :for="initialState.editorial">Editorial</label>
              <span v-if="v$.editorial.$error" class="pl-2 text-red-500">
                {{ v$.editorial.$errors[0].$message }}
              </span>
            </div>
            <input
              v-model="initialState.editorial"
              type="text"
              placeholder="Editorial"
              class="w-full border-2 border-tertiary-dark p-2 drop-shadow-items focus:outline-none"
            />
          </div>
          <div>
            <div>
              <label :for="initialState.categories"> Categorías (separadas por comas) </label>
              <span v-if="v$.categories.$error" class="pl-2 text-red-500">
                {{ v$.categories.$errors[0].$message }}
              </span>
            </div>
            <input
              v-model="initialState.categories"
              type="text"
              placeholder="Categorías"
              class="w-full border-2 border-tertiary-dark p-2 drop-shadow-items focus:outline-none"
            />
          </div>
          <div class="flex flex-col gap-4 lg:flex-row">
            <div class="w-full">
              <div>
                <label :for="initialState.price">Precio</label>
                <span v-if="v$.price.$error" class="pl-2 text-red-500">
                  {{ v$.price.$errors[0].$message }}
                </span>
              </div>
              <input
                v-model="initialState.price"
                type="number"
                placeholder="Precio"
                class="w-full border-2 border-tertiary-dark p-2 drop-shadow-items focus:outline-none"
              />
            </div>
            <div class="w-full">
              <div>
                <label :for="initialState.discount">Descuento (opcional)</label>
              </div>
              <input
                v-model="initialState.discount"
                type="number"
                placeholder="Descuento"
                class="w-full border-2 border-tertiary-dark p-2 drop-shadow-items focus:outline-none"
              />
            </div>
          </div>
          <div class="w-full">
            <div>
              <label :for="initialState.stock">Cantidad de stock</label>
              <span v-if="v$.stock.$error" class="pl-2 text-red-500">
                {{ v$.stock.$errors[0].$message }}
              </span>
            </div>
            <input
              v-model="initialState.stock"
              type="number"
              placeholder="Cantidad de stock"
              class="w-full border-2 border-tertiary-dark p-2 drop-shadow-items focus:outline-none"
            />
          </div>
        </div>
      </div>
      <div>
        <div>
          <label :for="initialState.description">Descripción</label>
          <span v-if="v$.description.$error" class="pl-2 text-red-500">
            {{ v$.description.$errors[0].$message }}
          </span>
        </div>
        <textarea
          v-model="initialState.description"
          type="text"
          placeholder="Descripción"
          class="h-80 w-full border-2 border-tertiary-dark p-2 drop-shadow-items focus:outline-none"
        />
      </div>
      <div class="flex flex-col justify-between gap-3 md:flex-row">
        <CustomButton class="md:order-2 md:px-36" primary :loading="loading" @click="submitForm"> AGREGAR </CustomButton>
        <CustomButton class="md:order-1 md:px-36" secondary @click="goBack"> VOLVER </CustomButton>
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

.v-select {
  z-index: 10 !important;
}
</style>
