<script setup>
import { onMounted, ref } from "vue";
import { useToast } from "vue-toast-notification";
import {
  getAllProductsAdmin,
  deleteFile,
  deleteProduct,
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
  if (name != filter.value.name) {
    filter.value.name = name;
    currentPage.value = 0;
    limitOfPages.value = 5;
    offsetPages.value = 0;
    limit.value = productsPerPage.value;
    offset.value = 0;
  }
  if (type) filter.value.type = type;
  if (author) filter.value.author = author;
  if (categorie) filter.value.categorie = categorie;
  if (order) filter.value.order = order;
  if (asc) filter.value.asc = asc;
  loading.value = true;
  const res = await getAllProductsAdmin(
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
  pages();
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
      fetchProducts();
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

// Pagination
const currentPage = ref(1);
const limitOfPages = ref(5);
const offsetPages = ref(0);

const productsPerPage = ref(23);
const offset = ref(0);
const limit = ref(productsPerPage.value);

const pages = () => {
  const totalPages = Math.ceil(count.value / productsPerPage.value);
  if (totalPages < 5) {
    limitOfPages.value = totalPages;
  } else if (currentPage.value === limitOfPages.value) {
    if (limitOfPages.value + 2 < totalPages) {
      limitOfPages.value += 2;
      offsetPages.value += 2;
    } else if (limitOfPages.value + 1 < totalPages) {
      limitOfPages.value += 1;
      offsetPages.value += 1;
    }
  }
};

const prevPage = async () => {
  limit.value = offset.value - 1;
  if (offset.value - productsPerPage.value > 0) {
    offset.value -= productsPerPage.value + 1;
  } else {
    offset.value = 0;
  }
  currentPage.value -= 1;
  await fetchProducts(filter.value.name);
};

const nextPage = async () => {
  offset.value = limit.value + 1;
  if (limit.value + productsPerPage.value < count.value) {
    limit.value += productsPerPage.value + 1;
  } else {
    limit.value = count.value;
  }
  currentPage.value += 1;
  await fetchProducts(filter.value.name);
};

const goToPage = async (page) => {
  if (page == 1) {
    limit.value = productsPerPage.value;
    offset.value = 0;
  } else {
    offset.value = (productsPerPage.value + 1) * (page - 1);
    if (productsPerPage.value * (page - 1) > count.value) {
      limit.value = count.value;
    } else {
      limit.value =
        productsPerPage.value + (productsPerPage.value + 1) * (page - 1);
    }
  }
  currentPage.value = page;
  await fetchProducts(filter.value.name);
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
        class="mt-10"
        :productsPerPage="productsPerPage"
        :count="count"
        :offset="offset"
        :limit="limit"
        :pages="limitOfPages"
        :pageOffset="offsetPages"
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
            <CustomButton primary @click="deleteProductFile()">
              ELIMINAR
            </CustomButton>
          </div>
        </div>
      </div>
    </CustomModal>
  </div>
</template>
