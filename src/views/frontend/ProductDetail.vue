<script setup>
import { onBeforeMount, ref, reactive } from "vue";
import { useRoute } from "vue-router";

import sbHelpers from "@/supabase/helpers.js";

import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import ProductList from "@/components/shared/products/ProductList.vue";

const route = useRoute();

const product = reactive({});
const loading = ref(false);
const related = reactive({});

async function relatedProducts() {
  related.value = await sbHelpers.getRelatedProducts(
    product.value[0].categories,
    product.value[0].name
  );
}

onBeforeMount(async () => {
  loading.value = true;
  product.value = await sbHelpers.getProductDetails(route.params.id);
  await relatedProducts();
  loading.value = false;
});

function newPrice(price, discount) {
  return price - (discount / 100) * price;
}
</script>

<template>
  <div class="container py-5 mx-auto">
    <LoadingSpinner v-if="loading" />
    <div
      v-if="!loading && product.value.length"
      class="flex flex-col gap-5 mx-5"
    >
      <div class="flex flex-col gap-5 lg:flex-row">
        <img
          :src="product.value[0].image"
          alt=""
          class="border-2 border-tertiary-dark drop-shadow-items lg:min-w-[450px] lg:w-[450px]"
        />
        <div class="flex flex-col justify-between gap-3">
          <header-title class="">
            <span class="text-2xl font-bold uppercase">{{ product.value[0].name }}</span>
          </header-title>
          <div>
            <span
              class="text-2xl font-bold"
              :class="{ 'line-through': product.value[0].discount }"
            >
              ${{ product.value[0].price }}
            </span>
            <span v-if="product.value[0].discount" class="text-2xl font-bold">
              ${{ newPrice(product.value[0].price, product.value[0].discount) }}
            </span>
          </div>
          <span>{{ product.value[0].description }}</span>
          <div>
            <span class="font-bold">Categoría: </span>
            <span
              v-for="(category, index) in product.value[0].categories"
              :key="index"
            >
              {{ category
              }}<span v-if="index < product.value[0].categories.length - 1"
                >,
              </span>
            </span>
          </div>
          <span>
            <span class="font-bold">Autor: </span>
            {{ product.value[0].author }}
          </span>
          <button
            v-if="product.value[0].stock > 0"
            class="p-3 text-sm font-bold border-2 bg-primary-light border-tertiary-dark drop-shadow-items"
          >
            AÑADIR AL CARRITO
          </button>
        </div>
      </div>
      <div class="flex flex-col gap-y-5">
        <header-title class="">
          <span class="text-2xl font-bold uppercase">RELACIONADOS</span>
        </header-title>
        <ProductList :products="related.value.splice(0, 6)" />
      </div>
    </div>
  </div>
</template>
