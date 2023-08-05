<script setup>
import { onMounted, ref, watch } from "vue";
import { useToast } from "vue-toast-notification";
import {
  deleteFile,
  deleteProduct,
  setAsNovelty,
  setAsPresale,
  handlePublish,
  getAllAuthors,
  getAuthorPrices,
  changeAllPrices,
} from "@/supabase/helpers.js";
import { getImagePath } from "@/lib/composables/imageHelper";
import useProductPagination from "@/lib/composables/paginationHelper";

import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import SearchAndFilter from "@/components/shared/filters/SearchAndFilter.vue";
import PaginationComponent from "@/components/shared/PaginationComponent.vue";
import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";
import CustomButton from "@/lib/components/CustomButton.vue";

const $toast = useToast();

// Pagination
const { loading, productsData, productsFunctions, pagination, pagesFunctions } = useProductPagination(true);

const deleteProductFile = async (product) => {
  if (confirm("¿Esta seguro que desea eliminar este producto?"))
    try {
      await deleteFile(getImagePath(product.image));
      const error = await deleteProduct(product.id);
      if (error) throw error;
      else {
        $toast.open({
          position: "top-right",
          message: "Se eliminó correctamente el producto",
          type: "success",
          duration: 5000,
          dismissible: true,
          pauseOnHover: true,
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
        pauseOnHover: true,
      });
    }
};

// Novelties and Presales setters
const setProductAsNovelty = async (product) => {
  const el = document.getElementById(`${product.id}-novelty`);
  const confirmationMsg = product.isNovelty ? "¿Quitar producto de novedades?" : "¿Establecer producto como novedad?";
  const shouldSetAsNovelty = confirm(confirmationMsg);
  el.checked = shouldSetAsNovelty ? !product.isNovelty : product.isNovelty;
  if (el.checked !== product.isNovelty) await setAsNovelty(product.id, el.checked);
};

const setProductAsPresale = async (product) => {
  const el = document.getElementById(`${product.id}-presale`);
  const confirmationMsg = product.isPresale ? "¿Quitar producto de preventa?" : "¿Establecer producto como preventa?";
  const shouldSetAsNovelty = confirm(confirmationMsg);
  el.checked = shouldSetAsNovelty ? !product.isPresale : product.isPresale;
  if (el.checked !== product.isPresale) await setAsPresale(product.id, el.checked);
};

const handleProductPublish = async (product) => {
  const el = document.getElementById(`${product.id}-published`);
  const confirmationMsg = product.isPublished ? "¿Ocultar producto del catálogo?" : "¿Mostrar producto en el catálogo?";
  const shouldPublish = confirm(confirmationMsg);
  el.checked = shouldPublish ? !product.isPublished : product.isPublished;
  if (el.checked !== product.isPublished) await handlePublish(product.id, el.checked);
};

const authors = ref();
const prices = ref();

const showPriceForm = ref(false);

const selectedAuthor = ref();
const selectedPrice = ref();
const newPrice = ref();

watch(selectedAuthor, async () => {
  prices.value = await getAuthorPrices(selectedAuthor.value);
});

async function fetchProducts() {
  loading.value = true;
  await productsFunctions.fetchProducts();
  loading.value = false;
}

async function changePrice() {
  event.preventDefault();
  await changeAllPrices(selectedAuthor.value, selectedPrice.value, newPrice.value);
  await fetchProducts();
}

onMounted(async () => {
  await fetchProducts();
  authors.value = await getAllAuthors();
  authors.value = authors.value.sort();
});
</script>

<template>
  <div class="container mx-auto py-5">
    <SearchAndFilter
      v-show="!loading"
      class="px-5"
      :productsPerPage="pagination.productsPerPage"
      :totalProducts="productsData.count.value"
      :productsInPage="pagination.offset + pagination.productsPerPage + 1"
      @fetchWithFilters="productsFunctions.fetchProducts"
      @clearFilters="productsFunctions.clearFilters"
    >
      <CustomButton primary class="h-auto md:w-fit md:px-10" @click="$router.push('/admin/agregar-producto')"> AGREGAR </CustomButton>
    </SearchAndFilter>
    <div class="px-5">
      <content-block v-if="!loading" class="relative z-10 mx-5 mb-5 gap-y-5 px-5">
        <button class="flex items-center" @click="showPriceForm = !showPriceForm">
          <span class="font-medium">Cambio de precio masivo</span>
          <span class="material-icons-outlined transition-all duration-200" :class="!showPriceForm ? 'rotate-0' : 'rotate-180'">
            expand_more
          </span>
        </button>
        <form v-if="showPriceForm" class="flex flex-col gap-5 md:flex-row">
          <div class="w-full">
            <label>Autor</label>
            <v-select
              v-model="selectedAuthor"
              :options="authors"
              :clearSearchOnSelect="false"
              class="w-full border-2 border-tertiary-dark bg-background p-2 drop-shadow-items focus:outline-none"
            ></v-select>
          </div>
          <div class="w-full">
            <label>Precio anterior</label>
            <v-select
              v-model="selectedPrice"
              :options="prices"
              :clearSearchOnSelect="false"
              class="w-full border-2 border-tertiary-dark bg-background p-2 drop-shadow-items focus:outline-none"
            ></v-select>
          </div>
          <div class="w-full">
            <label>Nuevo precio</label>
            <input v-model="newPrice" type="number" class="w-full border-2 border-tertiary-dark p-3 drop-shadow-items focus:outline-none" />
          </div>

          <CustomButton primary class="mt-auto h-[52px] md:w-fit md:px-10" @click="changePrice()"> CAMBIAR </CustomButton>
        </form>
      </content-block>
    </div>
    <LoadingSpinner v-if="loading" />
    <div v-else-if="!loading && productsData.count.value > 0" class="overflow-x-auto whitespace-nowrap px-5 drop-shadow-items">
      <!-- Aislar tabla en componente -->
      <table class="w-full table-auto">
        <thead class="border-2 border-tertiary-dark bg-primary">
          <tr>
            <th class="px-5 text-start">NOMBRE</th>
            <th class="px-5 text-center">UNIDADES</th>
            <th class="px-5 text-center">PRECIO</th>
            <th class="px-5 text-center">DESCUENTO</th>
            <th class="px-5 text-center">NOVEDAD</th>
            <th class="px-5 text-center">PREVENTA</th>
            <th class="px-5 text-center">PUBLICADO</th>
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
                  class="material-icons-outlined rounded-full border-2 border-tertiary-dark bg-primary px-1 !text-base"
                  title="SIN STOCK"
                >
                  priority_high
                </span>
              </span>
            </td>
            <td class="px-5 text-center font-medium">{{ product.stock }}</td>
            <td class="px-5 text-center font-medium">${{ product.price }}</td>
            <td class="px-5 text-center font-medium">{{ product.discount ? product.discount : "0" }}%</td>
            <td class="px-5 text-center font-medium">
              <input
                v-model="product.isNovelty"
                type="checkbox"
                class="h-6 w-6"
                :name="product.name"
                :id="`${product.id}-novelty`"
                @click="setProductAsNovelty(product)"
              />
            </td>
            <td class="px-5 text-center font-medium">
              <input
                v-model="product.isPresale"
                type="checkbox"
                class="h-6 w-6"
                :name="product.name"
                :id="`${product.id}-presale`"
                @click="setProductAsPresale(product)"
              />
            </td>
            <td class="px-5 text-center font-medium">
              <input
                v-model="product.isPublished"
                type="checkbox"
                class="h-6 w-6"
                :name="product.name"
                :id="`${product.id}-published`"
                @click="handleProductPublish(product)"
              />
            </td>
            <td class="flex justify-center gap-3 px-5 py-2">
              <router-link
                :to="{
                  name: 'SeeEditProduct',
                  params: { id: product.id },
                  query: { edit: true },
                }"
                class="material-icons-outlined border-2 border-tertiary-dark bg-primary-light p-1 drop-shadow-navlink"
                >edit</router-link
              >
              <button
                class="material-icons-outlined border-2 border-tertiary-dark bg-primary-light p-1 drop-shadow-navlink"
                @click="deleteProductFile(product)"
              >
                delete
              </button>
              <router-link
                :to="{
                  name: 'SeeEditProduct',
                  params: { id: product.id },
                  query: { edit: false },
                }"
                class="material-icons-outlined border-2 border-tertiary-dark bg-primary-light p-1 drop-shadow-navlink"
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
    <div v-else class="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
      <span class="material-icons-outlined !text-9xl text-primary"> search_off </span>
      <span class="text-xl font-medium">Sin resultados</span>
      <span class="min-w-[335px] text-center font-medium">No se encontraron resultados con los datos especificados.</span>
    </div>
  </div>
</template>
