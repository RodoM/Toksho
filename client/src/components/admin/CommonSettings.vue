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

const $toast = useToast();

const maintenance = ref();
const shipmentPrice = ref();

const maintenanceOptions = ref([
  { label: "Si", value: true },
  { label: "No", value: false },
]);

async function updateSettings() {
  event.preventDefault();
  if (confirm("¿Actualizar configuraciones?"))
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
          pauseOnHover: true,
        });
      }
    } catch (error) {
      $toast.open({
        position: "top-right",
        message: "Error al actualizar las configuraciones",
        type: "error",
        duration: 5000,
        dismissible: true,
        pauseOnHover: true,
      });
    }
}

onMounted(async () => {
  maintenance.value = await getMaintenance();
  shipmentPrice.value = await getShippingPrice();
});
</script>

<template>
  <form class="flex flex-col gap-y-5">
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
    <CustomButton
      class="w-full px-10 ml-auto md:w-fit"
      primary
      @click="updateSettings()"
    >
      APLICAR
    </CustomButton>
  </form>
</template>
