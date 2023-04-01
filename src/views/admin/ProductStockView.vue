<script setup>
import { onMounted, ref } from "vue";
import { supabase } from "@/supabase/supabase.js";
import { useToast } from "vue-toast-notification";
import {
  getAllProducts,
  searchProducts,
  filterProducts,
  deleteFile,
  setAsNovelty,
  setAsPresale,
} from "@/supabase/helpers.js";

import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import ProductSearchOptions from "@/components/shared/filters/ProductSearchOptions.vue";
import PaginationComponent from "@/components/shared/PaginationComponent.vue";
import CustomButton from "@/lib/components/CustomButton.vue";
import CustomModal from "../../lib/components/CustomModal.vue";

const $toast = useToast();

const products = ref([]);
const loading = ref(false);
const showModal = ref(false);

const count = ref(0);

const fetchProducts = async () => {
  const res = await getAllProducts(offset.value, limit.value);
  products.value = res.data;
  count.value = res.count;
};

const searchInput = ref("");

const inputSearchProducts = async () => {
  loading.value = true;
  if (searchInput.value.length > 0) {
    products.value = await searchProducts(searchInput.value);
  } else {
    fetchProducts();
  }
  loading.value = false;
};

const categories = ref();

const getAllCategories = async () => {
  let categoriesArr = [];
  const { data: Categories, error } = await supabase
    .from("Products")
    .select("categories");
  if (error) console.log(error);
  else {
    Categories.forEach((cat) => {
      cat.categories.forEach((c) => {
        categoriesArr.push(c);
      });
    });
    categories.value = [...new Set(categoriesArr)];
  }
};

const authors = ref();

const getAllAuthors = async () => {
  let authorsArr = [];
  const { data: Authors, error } = await supabase
    .from("Products")
    .select("author");
  if (error) console.log(error);
  else {
    Authors.forEach((author) => {
      authorsArr.push(author.author);
    });
    authors.value = [...new Set(authorsArr)];
  }
};

onMounted(async () => {
  loading.value = true;
  await fetchProducts();
  getAllCategories();
  getAllAuthors();
  loading.value = false;
});

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

// Filtering
const applyFilters = async (type, author, categorie, order, asc) => {
  loading.value = true;
  const res = await filterProducts(type, author, categorie, order, asc);
  products.value = res.data;
  count.value = res.count;
  loading.value = false;
};

const clearFilters = async () => {
  loading.value = true;
  await fetchProducts();
  loading.value = false;
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
  limit.value = offset.value;
  if (offset.value - productsPerPage.value > 0) {
    offset.value -= productsPerPage.value;
  } else {
    offset.value = 0;
  }
  await fetchProducts();
};

const nextPage = async () => {
  offset.value = limit.value;
  if (limit.value + productsPerPage.value < count.value) {
    limit.value += productsPerPage.value;
  } else {
    limit.value = count.value;
  }
  await fetchProducts();
};

const goToPage = async (page) => {
  if (productsPerPage.value * page > count.value) {
    limit.value = count.value;
  } else {
    limit.value = productsPerPage.value * page;
  }
  offset.value = productsPerPage.value * (page - 1);
  await fetchProducts();
};
</script>

<template>
  <div class="container py-5 mx-auto">
    <div class="flex mx-5 border-2 border-tertiary-dark drop-shadow-items">
      <input
        v-model="searchInput"
        type="text"
        placeholder="Busqueda..."
        class="w-full p-2 focus:outline-none"
      />
      <button
        class="p-2 border-l-2 material-icons-outlined border-tertiary-dark bg-primary-light"
        @click="inputSearchProducts"
      >
        search
      </button>
    </div>
    <div class="relative z-10 flex justify-between gap-3 p-5">
      <router-link to="/admin/agregar-producto">
        <CustomButton primary class="w-full md:px-10 md:w-fit">
          AGREGAR
        </CustomButton>
      </router-link>
      <ProductSearchOptions
        v-if="categories && authors"
        :productsInView="products.length"
        :totalProducts="count"
        :categories="categories"
        :authors="authors"
        class="gap-3"
        @applyFilter="applyFilters"
        @clearFilter="clearFilters"
      />
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
