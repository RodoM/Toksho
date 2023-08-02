<script setup>
import { ref } from "vue";

const props = defineProps({
  orders: {
    type: Array,
    required: true,
  },
});

const orderState = (state) => {
  if (state === "approved") return "APROBADO";
  else if (state === "pending") return "PENDIENTE";
  else if (state === "rejected") return "RECHAZADO";
};

const formatedDate = (date) => {
  return `${date.slice(8, 10)}/${date.slice(5, 7)}/${date.slice(0, 4)}`;
};

const currentOrder = ref();

function orderDetails(order) {
  currentOrder.value = order;
  const dialog = document.getElementById("dialog");
  dialog.showModal();
}

function closeDialog() {
  currentOrder.value = undefined;
  const dialog = document.getElementById("dialog");
  dialog.close();
}
</script>

<template>
  <div>
    <div
      v-if="props.orders.length > 0"
      class="px-5 overflow-x-auto whitespace-nowrap drop-shadow-items"
    >
      <table class="w-full table-auto">
        <thead class="border-2 bg-primary border-tertiary-dark">
          <tr>
            <th class="px-5 text-start">ID DE COMPRA</th>
            <th class="px-5 text-center">COMPRADOR</th>
            <th class="px-5 text-center">MONTO</th>
            <th class="px-5 text-center">FECHA</th>
            <th class="px-5 text-center">ESTADO</th>
            <th class="px-5 text-center">DETALLE</th>
          </tr>
        </thead>
        <tbody class="border-2 border-tertiary-dark">
          <tr
            v-for="(order, i) in props.orders"
            :key="order.id"
            :class="[i % 2 === 0 ? 'bg-secondary-light' : 'bg-secondary']"
          >
            <td class="px-5 font-medium">#{{ order.id }}</td>
            <td class="px-5 font-medium text-center">
              {{ order.payer.name }} {{ order.payer.surname }}
            </td>
            <td class="px-5 font-medium text-center">
              ${{ order.transaction_details.total_paid_amount }}
            </td>
            <td class="px-5 font-medium text-center">
              {{ formatedDate(order.date_created.slice(0, 10)) }}
            </td>
            <td class="px-5 font-medium text-center">
              {{ orderState(order.status_detail) }}
            </td>
            <td class="flex justify-center gap-3 px-5 py-2">
              <button
                class="p-1 border-2 material-icons-outlined bg-primary-light border-tertiary-dark drop-shadow-navlink"
                @click="orderDetails(order)"
              >
                visibility
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-else
      class="absolute flex flex-col items-center gap-3 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
    >
      <span class="material-icons-outlined !text-9xl text-primary">
        receipt_long
      </span>
      <span class="text-xl font-medium">Sin ordenes</span>
      <span class="font-medium text-center min-w-[335px]">
        Todavía no se realizó ninguna orden.
      </span>
    </div>
  </div>

  <dialog
    id="dialog"
    class="border-2 border-tertiary-dark bg-secondary-light md:w-[800px]"
  >
    <div class="flex flex-col gap-3">
      <button class="ml-auto material-icons-outlined" @click="closeDialog()">
        close
      </button>
      <div v-if="currentOrder" class="flex flex-col gap-3">
        <div class="flex justify-between">
          <span
            class="p-2 text-sm font-bold border-2 w-fit bg-primary border-tertiary-dark drop-shadow-navlink"
          >
            #{{ currentOrder.id }}
          </span>
          <span
            class="p-2 text-sm font-bold border-2 w-fit bg-primary border-tertiary-dark drop-shadow-navlink"
          >
            ESTADO: {{ orderState(currentOrder.status_detail) }}
          </span>
        </div>
        <div class="flex flex-col gap-2 md:flex-row">
          <div class="flex flex-col gap-1 px-2 md:w-1/2">
            <span class="font-medium">
              Nombre: {{ currentOrder.payer.name }}
              {{ currentOrder.payer.surname }}
            </span>
            <span class="font-medium">
              Teléfono: {{ currentOrder.payer.phone.area_code }}-{{
                currentOrder.payer.phone.number
              }}
            </span>
            <span class="font-medium">
              Email: {{ currentOrder.payer.email }}
            </span>
            <span
              v-if="currentOrder.payer.address.location"
              class="font-medium"
            >
              Localidad: {{ currentOrder.payer.address.location }}
              {{ `(CP: ${currentOrder.payer.address.postal_code})` }},
              {{ currentOrder.payer.address.province }}
            </span>
            <span
              v-if="currentOrder.payer.address.street_name"
              class="font-medium"
            >
              Dirección: {{ currentOrder.payer.address.street_name }}
              {{ currentOrder.payer.address.street_number }}
            </span>
          </div>
          <div class="border-b-2 border-r-2 border-tertiary-dark"></div>
          <div class="flex flex-col gap-1 px-2 md:w-1/2">
            <span
              v-for="item in currentOrder.items"
              :key="item.id"
              class="font-medium"
            >
              x{{ item.quantity }} - {{ item.title }} - ${{
                item.unit_price * item.quantity
              }}
            </span>
            <span
              v-if="currentOrder.payer.address.postal_code"
              class="font-medium"
            >
              x1 - Envio - $500
            </span>
          </div>
        </div>
        <div
          class="flex justify-between p-2 font-medium border-2 bg-primary border-tertiary-dark drop-shadow-navlink"
        >
          <span>{{
            formatedDate(currentOrder.date_created.slice(0, 10))
          }}</span>
          <span class="font-bold">
            TOTAL: ${{ currentOrder.transaction_details.total_paid_amount }}
          </span>
        </div>
      </div>
    </div>
  </dialog>
</template>
