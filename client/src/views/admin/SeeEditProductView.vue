<script setup>
import { ref, computed, onMounted } from "vue";
import { uploadFile, deleteFile } from "@/supabase/helpers";
import { initialState, formatName, formatAuthors, resetForm, v$ } from "@/lib/composables/productHelper";
import { getFile, getImagePath } from "@/lib/composables/imageHelper";
import { useRouter, useRoute } from "vue-router";
import { getProductDetails, updateProduct } from "@/supabase/helpers";

import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import CustomButton from "@/lib/components/CustomButton.vue";

const router = useRouter();
const route = useRoute();

const isEditing = computed(() => {
  return route.query.edit === "true";
});

const goToEdit = () => {
  router.push({ name: "SeeEditProduct", params: { id: initialState.id }, query: { edit: true } });
};

const previousData = ref();

const loadData = (product) => {
  Object.assign(initialState, product);
};

onMounted(async () => {
  const product = await getProductDetails(route.params.id);
  loadData(product);
  previousData.value = {
    name: product.name,
    author: product.author,
    image: product.image,
  };
});

const getCategories = () => {
  const { categories } = initialState;
  if (typeof categories === "object") {
    return categories;
  }
  return categories.split(/\s*,\s*/);
};

const getInputFile = (event) => {
  getFile(event, initialState, 400, 550);
};

const loading = ref(false);

const editProduct = async () => {
  if (!loading.value) {
    loading.value = true;
    let { id, author, name, image, type, size, editorial, price, discount, stock, description } = initialState;
    if (image.image) {
      await deleteFile(getImagePath(previousData.value.image));
      image.imageURL = await uploadFile(author, name, image.image);
    }
    await updateProduct(
      id,
      type,
      formatName(name),
      image.imageURL,
      size,
      formatAuthors(author),
      formatName(editorial),
      getCategories(),
      price,
      discount,
      stock,
      description
    );
    resetForm();
  }
};

const goBack = (e) => {
  e.preventDefault();
  router.push({ name: "Stock" });
};

const submitForm = async (event) => {
  event.preventDefault();
  const result = await v$.value.$validate();
  if (result) editProduct();
};
</script>

<template>
  <div class="container mx-auto py-5">
    <header-title class="mx-5 mb-5">
      <span class="text-2xl font-bold uppercase">EDITAR PRODUCTO</span>
    </header-title>
    <form v-if="initialState.id" class="mx-5 flex flex-col gap-4">
      <div class="flex flex-col gap-4 lg:flex-row">
        <img
          :src="initialState.image.imageReader ? initialState.image.imageReader : previousData?.image"
          alt="imagen del producto"
          loading="lazy"
          class="border-2 border-tertiary-dark drop-shadow-items lg:h-[656px] lg:min-w-[468px] lg:max-w-[468px]"
        />
        <div class="flex w-full flex-col gap-4">
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
              :disabled="!isEditing"
              :options="['Manga', 'Comic', 'Indumentaria']"
              :clearSearchOnSelect="false"
              :class="{ 'bg-disabled': !isEditing }"
              class="w-full border-2 border-tertiary-dark bg-background p-1 drop-shadow-items focus:outline-none"
            ></v-select>
          </div>
          <div class="w-full">
            <label :for="initialState.name">Nombre del producto</label>
            <span v-if="v$.name.$error" class="pl-2 text-red-500">
              {{ v$.name.$errors[0].$message }}
            </span>
            <input
              v-model="initialState.name"
              :disabled="!isEditing"
              type="text"
              placeholder="Nombre del producto"
              :class="{ 'bg-disabled': !isEditing }"
              class="w-full border-2 border-tertiary-dark p-2 drop-shadow-items focus:outline-none"
            />
          </div>
          <div class="flex flex-col gap-4 md:flex-row">
            <div class="w-full">
              <div>
                <label :for="initialState.image.image"> Imágen (Solo si se actualiza) </label>
                <span v-if="v$.image.image.$error" class="pl-2 text-red-500">
                  {{ v$.image.image.$errors[0].$message }}
                </span>
              </div>
              <input
                type="file"
                :disabled="!isEditing"
                accept="image/png, image/jpeg, image/webp"
                :class="[!isEditing ? 'bg-disabled' : 'bg-white']"
                class="block w-full cursor-pointer border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
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
                :disabled="!isEditing"
                type="text"
                placeholder="Tamaño del producto"
                :class="[!isEditing ? 'bg-disabled' : 'bg-white']"
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
              :disabled="!isEditing"
              type="text"
              placeholder="Autor"
              :class="{ 'bg-disabled': !isEditing }"
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
              :disabled="!isEditing"
              type="text"
              placeholder="Editorial"
              :class="[!isEditing ? 'bg-disabled' : 'bg-white']"
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
              :disabled="!isEditing"
              type="text"
              placeholder="Categorías"
              :class="{ 'bg-disabled': !isEditing }"
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
                :disabled="!isEditing"
                type="number"
                placeholder="Precio"
                :class="{ 'bg-disabled': !isEditing }"
                class="w-full border-2 border-tertiary-dark p-2 drop-shadow-items focus:outline-none"
              />
            </div>
            <div class="w-full">
              <div>
                <label :for="initialState.discount">Descuento (opcional)</label>
                <span v-if="v$.discount.$error" class="pl-2 text-red-500">
                  {{ v$.discount.$errors[0].$message }}
                </span>
              </div>
              <input
                v-model="initialState.discount"
                :disabled="!isEditing"
                type="number"
                placeholder="Descuento"
                :class="{ 'bg-disabled': !isEditing }"
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
              :disabled="!isEditing"
              type="number"
              placeholder="Cantidad de stock"
              :class="{ 'bg-disabled': !isEditing }"
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
          :disabled="!isEditing"
          type="text"
          placeholder="Descripción"
          :class="{ 'bg-disabled': !isEditing }"
          class="h-80 w-full border-2 border-tertiary-dark p-2 drop-shadow-items focus:outline-none"
        />
      </div>
      <div class="flex flex-col justify-between gap-3 md:flex-row">
        <CustomButton v-if="isEditing" class="md:order-2 md:px-36" primary :loading="loading" @click="submitForm"> CONFIRMAR </CustomButton>
        <CustomButton v-else class="md:order-2 md:px-36" primary @click="goToEdit"> EDITAR </CustomButton>
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
