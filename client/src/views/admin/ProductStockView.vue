<script setup>
import { onMounted, ref, watch } from "vue";
import { useToast } from "vue-toast-notification";
import {
  deleteFile,
  deleteProduct,
  setAsNovelty,
  setAsPresale,
  getAllAuthors,
  getAuthorPrices,
  changeAllPrices,
} from "@/supabase/helpers.js";
import useProductPagination from "@/lib/composables/paginationHelper.js";

import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import SearchAndFilter from "@/components/shared/filters/SearchAndFilter.vue";
import PaginationComponent from "@/components/shared/PaginationComponent.vue";
import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";
import CustomButton from "@/lib/components/CustomButton.vue";

const $toast = useToast();

// Pagination
const { loading, productsData, productsFunctions, pagination, pagesFunctions } =
  useProductPagination(true);

// product actions
const deleteImageFile = async (image) => {
  await deleteFile(image.substring(image.lastIndexOf("/") + 1, image.length));
};

const deleteProductFile = async (product) => {
  if (confirm("¿Esta seguro que desea eliminar este producto?"))
    try {
      deleteImageFile(product.image);
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
  const confirmationMsg = product.isNovelty
    ? "¿Quitar producto de novedades?"
    : "¿Establecer producto como novedad?";
  const shouldSetAsNovelty = confirm(confirmationMsg);
  el.checked = shouldSetAsNovelty ? !product.isNovelty : product.isNovelty;
  if (el.checked !== product.isNovelty)
    await setAsNovelty(product.id, el.checked);
};

const setProductAsPresale = async (product) => {
  const el = document.getElementById(`${product.id}-presale`);
  const confirmationMsg = product.isPresale
    ? "¿Quitar producto de preventa?"
    : "¿Establecer producto como preventa?";
  const shouldSetAsNovelty = confirm(confirmationMsg);
  el.checked = shouldSetAsNovelty ? !product.isPresale : product.isPresale;
  if (el.checked !== product.isPresale)
    await setAsPresale(product.id, el.checked);
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
  await changeAllPrices(
    selectedAuthor.value,
    selectedPrice.value,
    newPrice.value
  );
  await fetchProducts();
}

onMounted(async () => {
  await fetchProducts();
  authors.value = await getAllAuthors();
  authors.value = authors.value.sort();
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
    <div class="px-5">
      <content-block
        v-if="!loading"
        class="relative z-10 px-5 mx-5 mb-5 gap-y-5"
      >
        <button
          class="flex items-center"
          @click="showPriceForm = !showPriceForm"
        >
          <span class="font-medium">Cambio de precio masivo</span>
          <span
            class="transition-all duration-200 material-icons-outlined"
            :class="!showPriceForm ? 'rotate-0' : 'rotate-180'"
          >
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
              class="w-full p-2 border-2 bg-background border-tertiary-dark drop-shadow-items focus:outline-none"
            ></v-select>
          </div>
          <div class="w-full">
            <label>Precio anterior</label>
            <v-select
              v-model="selectedPrice"
              :options="prices"
              :clearSearchOnSelect="false"
              class="w-full p-2 border-2 bg-background border-tertiary-dark drop-shadow-items focus:outline-none"
            ></v-select>
          </div>
          <div class="w-full">
            <label>Nuevo precio</label>
            <input
              v-model="newPrice"
              type="number"
              class="w-full p-3 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
            />
          </div>

          <CustomButton
            primary
            class="md:px-10 md:w-fit h-[52px] mt-auto"
            @click="changePrice()"
          >
            CAMBIAR
          </CustomButton>
        </form>
      </content-block>
    </div>
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
                :id="`${product.id}-novelty`"
                @click="setProductAsNovelty(product)"
              />
            </td>
            <td class="px-5 font-medium text-center">
              <input
                v-model="product.isPresale"
                type="checkbox"
                class="w-6 h-6"
                :name="product.name"
                :id="`${product.id}-presale`"
                @click="setProductAsPresale(product)"
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
                @click="deleteProductFile(product)"
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
  </div>
</template>
