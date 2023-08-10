<script setup>
import { onMounted } from "vue";
import { deleteFile, deleteProduct, setAsNovelty, setAsPresale, handlePublish } from "@/supabase/helpers.js";
import { getImagePath } from "@/lib/composables/imageHelper";
import useProductPagination from "@/lib/composables/paginationHelper";

import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import SearchAndFilter from "@/components/shared/filters/SearchAndFilter.vue";
import PaginationComponent from "@/components/shared/PaginationComponent.vue";
import CustomButton from "@/lib/components/CustomButton.vue";

// Pagination
const { loading, productsData, productsFunctions, pagination, pagesFunctions } = useProductPagination(true);

const deleteProductFile = async (product) => {
  if (confirm("¿Esta seguro que desea eliminar este producto?")) {
    await deleteFile(getImagePath(product.image));
    await deleteProduct(product.id);
    productsFunctions.fetchProducts();
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

async function fetchProducts() {
  loading.value = true;
  await productsFunctions.fetchProducts();
  loading.value = false;
}

onMounted(async () => {
  await fetchProducts();
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
    <LoadingSpinner v-if="loading" />
    <div v-else-if="!loading && productsData.count.value > 0" class="overflow-x-auto whitespace-nowrap px-5 drop-shadow-items">
      <!-- Aislar tabla en componente -->
      <table class="w-full table-auto">
        <thead class="border-2 border-tertiary-dark bg-primary">
          <tr>
            <th class="px-5 text-start">NOMBRE</th>
            <th class="px-5 text-center">UNIDADES</th>
            <th class="px-5 text-center">PRECIO BASE</th>
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
