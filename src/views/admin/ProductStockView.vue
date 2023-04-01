<script setup>
import { onMounted, ref } from "vue";
import { supabase } from "@/supabase/supabase.js";
import { useToast } from "vue-toast-notification";
import {
  getAllProducts,
  deleteFile,
  setAsNovelty,
  setAsPresale,
} from "@/supabase/helpers.js";

import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import SearchAndFilter from "@/components/shared/filters/SearchAndFilter.vue";
import PaginationComponent from "@/components/shared/PaginationComponent.vue";
import CustomButton from "@/lib/components/CustomButton.vue";
import CustomModal from "../../lib/components/CustomModal.vue";

const $toast = useToast();

// Fetching products
const products = ref([]);
const filter = ref({
  name: undefined,
  type: undefined,
  author: undefined,
  categorie: undefined,
  order: "created_at",
  asc: true,
});
const count = ref(0);
const loading = ref(false);

async function fetchProducts(name, type, author, categorie, order, asc) {
  loading.value = true;
  if (name != undefined) filter.value.name = name;
  if (type) filter.value.type = type;
  if (author) filter.value.author = author;
  if (categorie) filter.value.categorie = categorie;
  if (order) filter.value.order = order;
  if (asc) filter.value.asc = asc;
  const res = await getAllProducts(
    offset.value,
    limit.value,
    filter.value.name,
    filter.value.type,
    filter.value.author,
    filter.value.categorie,
    filter.value.order,
    filter.value.asc
  );
  products.value = res.data;
  count.value = res.count;
  loading.value = false;
}

const clearFilters = async () => {
  filter.value.type = undefined;
  filter.value.author = undefined;
  filter.value.categorie = undefined;
  filter.value.order = "created_at";
  filter.value.asc = true;
  await fetchProducts();
};

// product actions (aislar)
const showModal = ref(false);

const deleteImageFile = async (image) => {
  await deleteFile(image.substring(image.lastIndexOf("/") + 1, image.length));
};

const currentProduct = ref();

const deleteProduct = async () => {
  deleteImageFile(currentProduct.value.image);
  const { error } = await supabase
    .from("Products")
    .delete()
    .eq("id", currentProduct.value.id);
  if (error) {
    $toast.open({
      position: "top-right",
      message: "Error al borrar el producto",
      type: "error",
      duration: 5000,
      dismissible: true,
    });
    console.log(error);
  } else {
    showModal.value = false;
    $toast.open({
      position: "top-right",
      message: "Se eliminó correctamente el producto",
      type: "success",
      duration: 5000,
      dismissible: true,
    });
    loading.value = true;
    fetchProducts();
    loading.value = false;
  }
};

const isEven = (n) => {
  if (n % 2 === 0) {
    return true;
  }
  return false;
};

// Novelties and Presales setters
const setProductAsNovelty = async (id, value) => {
  await setAsNovelty(id, !value);
};

const setProductAsPresale = async (id, value) => {
  await setAsPresale(id, !value);
};

// Pagination
const productsPerPage = ref(23);
const offset = ref(0);
const limit = ref(productsPerPage.value);

const prevPage = async () => {
  limit.value = offset.value - 1;
  if (offset.value - productsPerPage.value > 0) {
    offset.value -= productsPerPage.value + 1;
  } else {
    offset.value = 0;
  }
  await fetchProducts();
};

const nextPage = async () => {
  offset.value = limit.value + 1;
  if (limit.value + productsPerPage.value < count.value) {
    limit.value += productsPerPage.value + 1;
  } else {
    limit.value = count.value;
  }
  await fetchProducts();
};

const goToPage = async (page) => {
  if (page == 1) {
    limit.value = productsPerPage.value;
    offset.value = 0;
  } else {
    offset.value = productsPerPage.value * (page - 1) + 1;
    if (productsPerPage.value * page > count.value) {
      limit.value = count.value;
    } else {
      limit.value = productsPerPage.value * page + 1;
    }
  }
  await fetchProducts();
};

onMounted(async () => {
  loading.value = true;
  await fetchProducts();
  loading.value = false;
});
</script>

<template>
  <div class="container py-5 mx-auto">
    <SearchAndFilter
      class="px-5"
      :productsPerPage="productsPerPage"
      :totalProducts="count"
      :productsInPage="offset + productsPerPage + 1"
      @fetchWithFilters="fetchProducts"
      @clearFilters="clearFilters"
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
      <table v-if="!loading && products" class="w-full table-auto">
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
            v-for="(product, i) in products"
            :key="product.id"
            :class="[isEven(i) ? 'bg-secondary-light' : 'bg-secondary']"
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
        class="mt-10"
        :productsPerPage="productsPerPage"
        :count="count"
        :offset="offset"
        :limit="limit"
        @prevPage="prevPage"
        @nextPage="nextPage"
        @goToPage="goToPage"
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
            <CustomButton primary @click="deleteProduct()">
              ELIMINAR
            </CustomButton>
          </div>
        </div>
      </div>
    </CustomModal>
  </div>
</template>
