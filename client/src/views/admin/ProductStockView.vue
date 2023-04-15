<script setup>
import { onMounted, ref } from "vue";
import { useToast } from "vue-toast-notification";
import {
  deleteFile,
  deleteProduct,
  setAsNovelty,
  setAsPresale,
} from "@/supabase/helpers.js";
import useProductPagination from "@/lib/composables/paginationHelper.js";

import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import SearchAndFilter from "@/components/shared/filters/SearchAndFilter.vue";
import PaginationComponent from "@/components/shared/PaginationComponent.vue";
import CustomButton from "@/lib/components/CustomButton.vue";
import CustomModal from "../../lib/components/CustomModal.vue";

const $toast = useToast();

// Pagination
const { loading, productsData, productsFunctions, pagination, pagesFunctions } =
  useProductPagination(true);

// product actions
const showModal = ref(false);
const currentProduct = ref();

const deleteImageFile = async (image) => {
  await deleteFile(image.substring(image.lastIndexOf("/") + 1, image.length));
};

const deleteProductFile = async () => {
  try {
    deleteImageFile(currentProduct.value.image);
    const error = await deleteProduct(currentProduct.value.id);
    if (error) throw error;
    else {
      showModal.value = false;
      $toast.open({
        position: "top-right",
        message: "Se eliminó correctamente el producto",
        type: "success",
        duration: 5000,
        dismissible: true,
      });
      loading.value = true;
      productsFunctions.fetchProducts();
      loading.value = false;
    }
  } catch (error) {
    $toast.open({
      position: "top-right",
      message: "Error al borrar el producto",
      type: "error",
      duration: 5000,
      dismissible: true,
    });
  }
};

// Novelties and Presales setters
const setProductAsNovelty = async (id, value) => {
  await setAsNovelty(id, !value);
};

const setProductAsPresale = async (id, value) => {
  await setAsPresale(id, !value);
};

onMounted(async () => {
  loading.value = true;
  await productsFunctions.fetchProducts();
  loading.value = false;
});
</script>

<template>
  <div class="container py-5 mx-auto">
    <SearchAndFilter
      v-show="!loading"
      class="px-5"
      :productsPerPage="pagination.productsPerPage"
      :totalProducts="productsData.count.value"
      :productsInPage="pagination.offset + pagination.productsPerPage + 1"
      @fetchWithFilters="productsFunctions.fetchProducts"
      @clearFilters="productsFunctions.clearFilters"
    >
      <CustomButton
        primary
        class="h-auto md:px-10 md:w-fit"
        @click="$router.push('/admin/agregar-producto')"
      >
        AGREGAR
      </CustomButton>
    </SearchAndFilter>
    <LoadingSpinner v-if="loading" />
    <div class="px-5 overflow-x-auto whitespace-nowrap drop-shadow-items">
      <!-- Aislar tabla en componente -->
      <table
        v-if="!loading && productsData.products.value"
        class="w-full table-auto"
      >
        <thead class="border-2 bg-primary border-tertiary-dark">
          <tr>
            <th class="px-5 text-start">NOMBRE</th>
            <th class="px-5 text-center">UNIDADES</th>
            <th class="px-5 text-center">PRECIO</th>
            <th class="px-5 text-center">DESCUENTO</th>
            <th class="px-5 text-center">NOVEDAD</th>
            <th class="px-5 text-center">PREVENTA</th>
            <th class="px-5 text-center">ACCIONES</th>
          </tr>
        </thead>
        <tbody class="border-2 border-tertiary-dark">
          <tr
            v-for="(product, i) in productsData.products.value"
            :key="product.id"
            :class="[i % 2 === 0 ? 'bg-secondary-light' : 'bg-secondary']"
          >
            <td class="px-5 font-medium">
              <span class="flex items-center gap-2">
                {{ product.name }}
                <span
                  v-if="product.stock === 0"
                  class="border-2 rounded-full material-icons-outlined bg-primary border-tertiary-dark px-1 !text-base"
                  title="SIN STOCK"
                >
                  priority_high
                </span>
              </span>
            </td>
            <td class="px-5 font-medium text-center">{{ product.stock }}</td>
            <td class="px-5 font-medium text-center">${{ product.price }}</td>
            <td class="px-5 font-medium text-center">
              {{ product.discount ? product.discount : "0" }}%
            </td>
            <td class="px-5 font-medium text-center">
              <input
                v-model="product.isNovelty"
                type="checkbox"
                class="w-6 h-6"
                :name="product.name"
                :id="product.id"
                @click="setProductAsNovelty(product.id, product.isNovelty)"
              />
            </td>
            <td class="px-5 font-medium text-center">
              <input
                v-model="product.isPresale"
                type="checkbox"
                class="w-6 h-6"
                :name="product.name"
                :id="product.id"
                @click="setProductAsPresale(product.id, product.isPresale)"
              />
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
                @click="(showModal = true), (currentProduct = product)"
              >
                delete
              </button>
              <router-link
                :to="{
                  name: 'SeeProduct',
                  params: { id: product.id },
                }"
                class="p-1 border-2 material-icons-outlined bg-primary-light border-tertiary-dark drop-shadow-navlink"
                >visibility</router-link
              >
            </td>
          </tr>
        </tbody>
      </table>
      <PaginationComponent
        v-show="!loading"
        class="mt-10"
        :count="productsData.count.value"
        :paginationData="pagination"
        @prevPage="pagesFunctions.prevPage"
        @nextPage="pagesFunctions.nextPage"
        @goToPage="pagesFunctions.goToPage"
      />
    </div>
    <CustomModal :show="showModal">
      <div
        class="relative border-2 drop-shadow-items border-tertiary-dark bg-background"
      >
        <button
          type="button"
          class="absolute top-3 right-2.5"
          @click="showModal = false"
        >
          <span class="material-icons-outlined text-tertiary-dark">
            close
          </span>
        </button>
        <div class="p-6 text-center">
          <span class="material-icons-outlined text-primary !text-7xl">
            warning_amber
          </span>
          <h3 class="mb-5 font-medium">
            ¿Está seguro que desea eliminar este producto?
          </h3>
          <div class="flex justify-between">
            <CustomButton secondary @click="showModal = false">
              CANCELAR
            </CustomButton>
            <CustomButton primary @click="deleteProductFile()">
              ELIMINAR
            </CustomButton>
          </div>
        </div>
      </div>
    </CustomModal>
  </div>
</template>
