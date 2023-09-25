<script setup>
import { ref, onMounted } from "vue";
import { getMaintenance, setMaintenance } from "@/supabase/helpers";

import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import CustomButton from "@/lib/components/CustomButton.vue";

const maintenance = ref();

const maintenanceOptions = ref([
  { label: "Si", value: true },
  { label: "No", value: false },
]);

const loading = ref(false);

async function updateSettings(event) {
  event.preventDefault();
  if (!loading.value && confirm("¿Actualizar estado de la página?")) {
    loading.value = true;
    await setMaintenance(maintenance.value);
  }
  loading.value = false;
}

onMounted(async () => {
  maintenance.value = await getMaintenance();
});
</script>

<template>
  <content-block class="gap-y-5 px-5">
    <header-title>
      <span class="text-2xl font-bold">CONFIGURACIONES</span>
    </header-title>
    <form class="flex flex-col gap-4 md:flex-row">
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
    <CustomButton class="ml-auto w-full px-10 md:w-fit" primary :loading="loading" @click="updateSettings"> ACTUALIZAR </CustomButton>
  </content-block>
</template>
