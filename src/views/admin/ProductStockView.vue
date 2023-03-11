<script setup>
import { onMounted, ref } from "vue";
import { supabase } from "@/supabase/supabase.js";
import sbHelpers from "@/supabase/helpers.js";

import ProductSearchOptions from "@/components/shared/filters/ProductSearchOptions.vue";
import CustomButton from "@/lib/components/CustomButton.vue";
import CustomModal from "../../lib/components/CustomModal.vue";
import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";

const products = ref([]);
const loading = ref(false);
const showModal = ref(false);

const getProducts = async () => {
  products.value = await sbHelpers.getAllProducts();
};

onMounted(async () => {
  loading.value = true;
  await getProducts();
  loading.value = false;
});

const deleteImageFile = async (name) => {
  await sbHelpers.deleteFile(name);
};

const currentProduct = ref();

const deleteProduct = async () => {
  deleteImageFile(currentProduct.value.name);
  const { error } = await supabase
    .from("Products")
    .delete()
    .eq("id", currentProduct.value.id);
  if (error) console.log(error);
  else {
    showModal.value = false;
    loading.value = true;
    getProducts();
    loading.value = false;
  }
};
</script>

<template>
  <div class="container py-5 mx-auto">
    <div class="flex mx-5 border-2 border-tertiary-dark drop-shadow-items">
      <input
        type="text"
        placeholder="Busqueda..."
        class="w-full p-2 focus:outline-none"
      />
      <button
        class="p-2 border-l-2 material-icons-outlined border-tertiary-dark bg-primary-light"
      >
        search
      </button>
    </div>
    <div class="flex justify-between gap-3 p-5">
      <router-link to="/admin/agregar-producto">
        <CustomButton primary class="w-full md:px-10 md:w-fit">
          AGREGAR
        </CustomButton>
      </router-link>
      <ProductSearchOptions />
    </div>
    <LoadingSpinner v-if="loading" />
    <div class="px-5 overflow-x-auto whitespace-nowrap drop-shadow-items">
      <table v-if="!loading && products" class="w-full table-auto">
        <thead class="border-2 bg-primary border-tertiary-dark">
          <tr>
            <th class="px-5 text-start">NOMBRE</th>
            <th class="px-5 text-center">UNIDADES</th>
            <th class="px-5 text-center">PRECIO</th>
            <th class="px-5 text-center">DESCUENTO</th>
            <th class="px-5 text-center">ACCIONES</th>
          </tr>
        </thead>
        <tbody class="border-2 border-tertiary-dark">
          <tr
            v-for="product in products"
            :key="product.id"
            class="bg-secondary-light"
          >
            <td class="flex items-center gap-3 px-5 font-medium">
              {{ product.name }}
              <span v-if="product.stock === 0" class="border-2 rounded-full material-icons-outlined bg-primary border-tertiary-dark px-1 !text-base"> priority_high </span>
            </td>
            <td class="px-5 font-medium text-center">{{ product.stock }}</td>
            <td class="px-5 font-medium text-center">${{ product.price }}</td>
            <td class="px-5 font-medium text-center">
              {{ product.discount ? product.discount : "0" }}%
            </td>
            <td class="flex justify-center gap-3 px-5 py-2">
              <router-link
                :to="{
                  name: 'EditProduct',
                  params: { id: product.id },
                }"
                class="p-1 border-2 material-icons-outlined bg-primary-light border-tertiary-dark drop-shadow-navlink"
                >edit</router-link
              >
              <button
                class="p-1 border-2 material-icons-outlined bg-primary-light border-tertiary-dark drop-shadow-navlink"
                @click="showModal = true, currentProduct = product"
              >
                delete
              </button>
              <button
                class="p-1 border-2 material-icons-outlined bg-primary-light border-tertiary-dark drop-shadow-navlink"
              >
                visibility
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <CustomModal :show="showModal">
      <div class="relative border-2 drop-shadow-items border-tertiary-dark bg-background">
        <button type="button" class="absolute top-3 right-2.5" @click="showModal = false">
          <span class="material-icons-outlined text-tertiary-dark">
            close
          </span>
        </button>
        <div class="p-6 text-center">
          <span class="material-icons-outlined text-primary !text-7xl"> warning_amber </span>
          <h3 class="mb-5 font-medium">¿Está seguro que desea eliminar este producto?</h3>
          <div class="flex justify-between">
            <CustomButton secondary @click="showModal = false">CANCELAR</CustomButton>
            <CustomButton primary @click="deleteProduct()">ELIMINAR</CustomButton>
          </div>
        </div>
      </div>
    </CustomModal>
  </div>
</template>
