<script setup>
import { onMounted, ref, watch } from "vue";
import { getAllEditorials, getEditorialSizes, getEditorialSizePrice, changePrice } from "@/supabase/helpers";

import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";
import CustomButton from "@/lib/components/CustomButton.vue";

const loading = ref(false);

const price = ref({
  editorial: undefined,
  size: undefined,
  currentPrice: undefined,
  newPrice: undefined,
});

const editorials = ref();
const sizes = ref();
const prices = ref();

watch(
  () => price.value.editorial,
  async (editorial) => {
    sizes.value = await getEditorialSizes(editorial);
  }
);

watch(
  () => price.value.size,
  async (size) => {
    prices.value = await getEditorialSizePrice(price.value.editorial, size);
  }
);

const setNewPrice = async () => {
  if (!loading.value) {
    loading.value = true;
    const { editorial, size, currentPrice, newPrice } = price.value;
    await changePrice(editorial, size, currentPrice, newPrice);
  }
  loading.value = false;
};

onMounted(async () => {
  editorials.value = await getAllEditorials();
});
</script>

<template>
  <content-block class="z-10 gap-y-5 px-5">
    <header-title>
      <span class="text-2xl font-bold">PRECIOS</span>
    </header-title>
    <div class="flex flex-col items-center gap-4 md:flex-row">
      <div class="z-30 w-full">
        <label>Editorial</label>
        <v-select
          v-model="price.editorial"
          :placeholder="'Editorial'"
          :options="editorials"
          :clearSearchOnSelect="false"
          class="border-2 border-tertiary-dark bg-background p-2 drop-shadow-items focus:outline-none"
        ></v-select>
      </div>
      <div class="z-20 w-full">
        <label>Tamaño</label>
        <v-select
          v-model="price.size"
          :placeholder="'Tamaño'"
          :options="sizes"
          :clearSearchOnSelect="false"
          class="border-2 border-tertiary-dark bg-background p-2 drop-shadow-items focus:outline-none"
        >
          <template #no-options> Selecciona una editorial </template>
        </v-select>
      </div>
      <div class="z-10 w-full">
        <label>Precio actual</label>
        <v-select
          v-model="price.currentPrice"
          :placeholder="'Precio actual'"
          :options="prices"
          :clearSearchOnSelect="false"
          class="border-2 border-tertiary-dark bg-background p-2 drop-shadow-items focus:outline-none"
        >
          <template #no-options> Selecciona un tamaño </template>
        </v-select>
      </div>
      <div class="w-full">
        <label>Nuevo precio</label>
        <input
          v-model="price.newPrice"
          :placeholder="'Nuevo precio'"
          type="number"
          class="w-full border-2 border-tertiary-dark p-3 drop-shadow-items focus:outline-none"
        />
      </div>
    </div>
    <CustomButton class="ml-auto w-full px-10 md:w-fit" primary :loading="loading" @click="setNewPrice"> ACTUALIZAR </CustomButton>
  </content-block>
</template>
