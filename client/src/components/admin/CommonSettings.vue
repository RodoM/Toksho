<script setup>
import { ref, onMounted } from "vue";
import { getMaintenance, setMaintenance, getShippingPrice, setShippingPrice } from "@/supabase/helpers";

import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import CustomButton from "@/lib/components/CustomButton.vue";

const maintenance = ref();
const shipmentPrice = ref();

const maintenanceOptions = ref([
  { label: "Si", value: true },
  { label: "No", value: false },
]);

async function updateSettings(event) {
  event.preventDefault();
  if (confirm("¿Actualizar configuraciones?")) {
    await setMaintenance(maintenance.value);
    await setShippingPrice(shipmentPrice.value);
  }
}

onMounted(async () => {
  maintenance.value = await getMaintenance();
  shipmentPrice.value = await getShippingPrice();
});
</script>

<template>
  <content-block class="gap-y-5 px-5">
    <header-title>
      <span class="text-2xl font-bold">CONFIGURACIONES</span>
    </header-title>
    <form class="flex flex-col gap-4 md:flex-row">
      <div class="w-full">
        <label>Precio de envios</label>
        <input
          v-model="shipmentPrice"
          type="number"
          placeholder="Precio"
          class="w-full border-2 border-tertiary-dark p-3 drop-shadow-items focus:outline-none"
        />
      </div>

      <div class="z-10 w-full">
        <label>Página en mantenimiento</label>
        <v-select
          v-model="maintenance"
          :options="maintenanceOptions"
          :reduce="(opt) => opt.value"
          :clearSearchOnSelect="false"
          :clearable="false"
          class="maintenance-select w-full border-2 border-tertiary-dark bg-background p-2 drop-shadow-items focus:outline-none"
        ></v-select>
      </div>
    </form>
    <CustomButton class="ml-auto w-full px-10 md:w-fit" primary @click="updateSettings()"> ACTUALIZAR </CustomButton>
  </content-block>
</template>
