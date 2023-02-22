<script setup>
import { onBeforeMount, ref, reactive } from "vue";
import { useRoute } from "vue-router";

import sbHelpers from "@/supabase/helpers.js";

import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";

const route = useRoute();

const product = reactive({});
const loading = ref(false);

onBeforeMount(async () => {
  loading.value = true;
  product.value = await sbHelpers.getProductDetails(route.params.id);
  loading.value = false;
});

function newPrice(price, discount) {
  return price - (discount / 100) * price;
}
</script>

<template>
  <div class="container mx-auto my-5">
    <LoadingSpinner v-if="loading" />
    <div
      v-if="!loading && product.value.length"
      class="flex flex-col gap-5 mx-5"
    >
      <img
        :src="product.value[0].image"
        alt=""
        class="border-2 border-tertiary-dark drop-shadow-items"
      />
      <header-title class="">
        <span class="text-2xl font-bold">{{ product.value[0].name }}</span>
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
    </div>
  </div>
</template>
