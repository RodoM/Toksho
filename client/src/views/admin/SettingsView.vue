<script setup>
import { ref, onMounted } from "vue";
import {
  getMaintenance,
  setMaintenance,
  getShippingPrice,
  setShippingPrice,
} from "@/supabase/helpers.js";
import { useToast } from "vue-toast-notification";

import CustomButton from "@/lib/components/CustomButton.vue";
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";

const $toast = useToast();

const maintenance = ref();
const shipmentPrice = ref();

const maintenanceOptions = ref([
  { label: "Si", value: true },
  { label: "No", value: false },
]);

async function updateSettings() {
  try {
    const setMaintenanceErr = await setMaintenance(maintenance.value);
    const setShippingPriceErr = await setShippingPrice(shipmentPrice.value);
    if (setMaintenanceErr || setShippingPriceErr) {
      throw setMaintenanceErr || setShippingPriceErr;
    } else {
      $toast.open({
        position: "top-right",
        message: "Se actualizaron las configuraciones",
        type: "success",
        duration: 5000,
        dismissible: true,
      });
    }
  } catch (error) {
    $toast.open({
      position: "top-right",
      message: "Error al actualizar las configuraciones",
      type: "error",
      duration: 5000,
      dismissible: true,
    });
  }
}

onMounted(async () => {
  maintenance.value = await getMaintenance();
  shipmentPrice.value = await getShippingPrice();
});
</script>

<template>
  <div class="container p-5 mx-auto">
    <header-title>
      <span class="text-2xl font-bold">CONFIGURACIONES</span>
    </header-title>
    <br />
    <content-block class="px-5 gap-y-5">
      <div>
        <label>Precio de envios</label>
        <input
          v-model="shipmentPrice"
          type="number"
          placeholder="Precio"
          class="w-full p-3 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
        />
      </div>

      <div class="z-10">
        <label>Página en mantenimiento</label>
        <v-select
          v-model="maintenance"
          :options="maintenanceOptions"
          :reduce="(opt) => opt.value"
          :clearSearchOnSelect="false"
          :clearable="false"
          class="w-full p-2 border-2 maintenance-select bg-background border-tertiary-dark drop-shadow-items focus:outline-none"
        ></v-select>
      </div>

      <!-- <label class="relative inline-flex items-center cursor-pointer w-fit">
        <input type="checkbox" value="" class="sr-only peer" />
        <div
          class="w-11 h-6 bg-tertiary-light rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
        ></div>
        <span class="ml-3 text-sm font-medium"> PÁGINA EN MANTENIMIENTO </span>
      </label> -->
      <CustomButton class="ml-auto w-fit" primary @click="updateSettings()">
        APLICAR
      </CustomButton>
    </content-block>
  </div>
</template>
