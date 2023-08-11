<script setup>
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";
import { itemsStore } from "@/stores/shoppingCart.js";
import { userStore } from "@/stores/index.js";
import { showToast } from "@/lib/composables/toastHelper";
import { getRelatedProducts, getProductDetails, getUserCart, updateUserCart, getMaintenance } from "@/supabase/helpers";

import LoadingSpinner from "@/components/shared/LoadingSpinner.vue";
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import ProductList from "@/components/shared/products/ProductList.vue";
import CustomButton from "@/lib/components/CustomButton.vue";

const route = useRoute();
const itemStore = itemsStore();
const usersStore = userStore();

const product = ref();
const userCart = ref([]);
const maintenance = ref();
const loading = ref(false);
const related = ref();

const amount = ref(1);

const lessAmount = () => {
  if (amount.value > 1) {
    amount.value -= 1;
  }
};

const moreAmount = () => {
  if (amount.value < product.value.stock) {
    amount.value += 1;
  }
};

const addProduct = async (id) => {
  if (!userCart.value.find((x) => x.id === id) && !itemStore.items.find((x) => x.id === id)) {
    if (usersStore.user?.id) {
      userCart.value.push({ id: id, amount: amount.value });
      await updateUserCart(userCart.value, usersStore.user.id);
      userCart.value = await getUserCart(usersStore.user.id);
    } else {
      itemStore.addItem(id, amount.value);
    }
  } else {
    showToast("El producto ya se encuentra en tu carrito", "warning");
  }
};

async function relatedProducts() {
  related.value = await getRelatedProducts(product.value.categories, product.value.name);
}

onBeforeMount(async () => {
  loading.value = true;
  maintenance.value = await getMaintenance();
  product.value = await getProductDetails(route.params.id);
  if (usersStore.user?.id) {
    userCart.value = await getUserCart(usersStore.user.id);
  }
  await relatedProducts();
  loading.value = false;
});

function newPrice(price, discount) {
  return price - (discount / 100) * price;
}
</script>

<template>
  <div class="container mx-auto py-5">
    <LoadingSpinner v-if="loading" />
    <div v-if="!loading && product" class="mx-5 flex flex-col gap-5">
      <div class="flex flex-col gap-5 lg:flex-row">
        <img
          :src="product.image"
          :alt="product.name"
          loading="lazy"
          class="border-2 border-tertiary-dark drop-shadow-items lg:h-[685px] lg:w-[450px] lg:min-w-[450px]"
        />
        <div class="flex flex-col justify-between gap-3">
          <div class="flex flex-col gap-5">
            <header-title class="">
              <span class="text-2xl font-bold uppercase">
                {{ product.name }}
              </span>
            </header-title>
            <div>
              <span class="text-2xl font-bold" :class="{ 'line-through': product.discount }"> ${{ product.price }} </span>
              <span v-if="product.discount" class="text-2xl font-bold"> ${{ newPrice(product.price, product.discount) }} </span>
            </div>
            <span>{{ product.description }}</span>
            <div>
              <span class="font-bold">Categorías: </span>
              <span v-for="(category, index) in product.categories" :key="index">
                {{ category }}{{ index + 1 < product.categories.length ? ", " : "" }}
              </span>
            </div>
            <span>
              <span class="font-bold">Autor: </span>
              {{ product.author }}
            </span>
          </div>
          <div v-if="!maintenance" class="flex flex-col gap-3 md:flex-row">
            <div class="flex drop-shadow-items">
              <button class="w-1/3 border-2 border-tertiary-dark bg-primary-light font-bold" @click="lessAmount">-</button>
              <input
                v-model="amount"
                type="number"
                disabled
                class="w-1/3 border-y-2 border-tertiary-dark bg-white p-3 text-center font-bold focus:outline-none"
              />
              <button class="w-1/3 border-2 border-tertiary-dark bg-primary-light font-bold" @click="moreAmount">+</button>
            </div>
            <CustomButton primary class="w-full" :disabled="product.stock == 0" @click="addProduct(product.id)">
              {{ product.stock == 0 ? "SIN STOCK" : "AÑADIR AL CARRITO" }}
            </CustomButton>
          </div>
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
