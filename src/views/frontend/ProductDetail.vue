<script setup>
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

import sbHelpers from "@/supabase/helpers.js";

import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import ProductList from "@/components/shared/products/ProductList.vue";
import CustomButton from "@/lib/components/CustomButton.vue";

const route = useRoute();

const product = ref();
const loading = ref(false);
const related = ref();

async function relatedProducts() {
  related.value = await sbHelpers.getRelatedProducts(
    product.value.categories,
    product.value.name
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
    <div v-if="!loading && product" class="flex flex-col gap-5 mx-5">
      <div class="flex flex-col gap-5 lg:flex-row">
        <img
          :src="product.image"
          alt=""
          class="border-2 border-tertiary-dark drop-shadow-items lg:h-[685px] lg:min-w-[450px] lg:w-[450px]"
        />
        <div class="flex flex-col justify-between gap-3">
          <header-title class="">
            <span class="text-2xl font-bold uppercase">{{ product.name }}</span>
          </header-title>
          <div>
            <span
              class="text-2xl font-bold"
              :class="{ 'line-through': product.discount }"
            >
              ${{ product.price }}
            </span>
            <span v-if="product.discount" class="text-2xl font-bold">
              ${{ newPrice(product.price, product.discount) }}
            </span>
          </div>
          <span>{{ product.description }}</span>
          <div>
            <span class="font-bold">Categorías: </span>
            <span v-for="(category, index) in product.categories" :key="index" class="p-1 mr-2 border-2 bg-secondary-light border-tertiary-dark drop-shadow-navlink">
              {{ category }}
            </span>
          </div>
          <span>
            <span class="font-bold">Autor: </span>
            {{ product.author }}
          </span>
          <!-- <button
            v-if="product.stock > 0"
            class="p-3 text-sm font-bold border-2 bg-primary-light border-tertiary-dark drop-shadow-items"
          >
            AÑADIR AL CARRITO
          </button> -->
          <CustomButton primary :disabled="product.stock == 0">
            {{ product.stock == 0 ? "SIN STOCK" : "AÑADIR AL CARRITO" }}
          </CustomButton>
        </div>
      </div>
      <div class="flex flex-col gap-y-5">
        <header-title class="">
          <span class="text-2xl font-bold uppercase">RELACIONADOS</span>
        </header-title>
        <ProductList :products="related" />
      </div>
    </div>
  </div>
</template>
