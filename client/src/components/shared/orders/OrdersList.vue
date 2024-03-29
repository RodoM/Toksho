<script setup>
import { ref } from "vue";
import { updateOrderShipment } from "@/supabase/helpers";

const props = defineProps({
  orders: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update"]);

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
  const dialog = document.getElementById("detailsDialog");
  dialog.showModal();
}

async function updateShipmentStatus(id, state) {
  if (confirm("¿Actualizar estado del envío?")) {
    await updateOrderShipment(id, !state);
    emit("update");
  }
}

const mpCommission = () => {
  const { total_paid_amount, net_received_amount } = currentOrder.value.transaction_details;
  return Number.parseFloat(total_paid_amount - net_received_amount).toFixed(2);
};

function closeDialog() {
  currentOrder.value = undefined;
  const dialog = document.getElementById("detailsDialog");
  dialog.close();
}
</script>

<template>
  <div>
    <div v-if="props.orders.length > 0" class="overflow-x-auto whitespace-nowrap px-5 drop-shadow-items">
      <table class="w-full table-auto">
        <thead class="border-2 border-tertiary-dark bg-primary">
          <tr>
            <th class="px-5 text-start">ID DE COMPRA</th>
            <th class="px-5 text-center">COMPRADOR</th>
            <th class="px-5 text-center">MONTO</th>
            <th class="px-5 text-center">FECHA</th>
            <th class="px-5 text-center">ESTADO</th>
            <th class="px-5 text-center">TIENE ENVÍO</th>
            <th class="px-5 text-center">SE ENVIÓ EL LINK</th>
            <th class="px-5 text-center">ACCIONES</th>
          </tr>
        </thead>
        <tbody class="border-2 border-tertiary-dark">
          <tr v-for="(order, i) in props.orders" :key="order.id" :class="[i % 2 === 0 ? 'bg-secondary-light' : 'bg-secondary']">
            <td class="px-5 font-medium">#{{ order.id }}</td>
            <td class="px-5 text-center font-medium">{{ order.payer.name }} {{ order.payer.surname }}</td>
            <td class="px-5 text-center font-medium">${{ order.transaction_details.net_received_amount }}</td>
            <td class="px-5 text-center font-medium">{{ formatedDate(order.date_created.slice(0, 10)) }}</td>
            <td class="px-5 text-center font-medium">{{ orderState(order.status) }}</td>
            <td class="px-5 text-center font-medium">{{ order.has_shipping ? "SI" : "NO" }}</td>
            <td class="px-5 text-center font-medium">{{ order.updated_shipment ? "SI" : "NO" }}</td>
            <td class="flex justify-center gap-3 px-5 py-2">
              <button
                class="material-icons-outlined border-2 border-tertiary-dark bg-primary-light p-1 drop-shadow-navlink"
                @click="orderDetails(order)"
              >
                visibility
              </button>
              <button
                class="material-icons-outlined border-2 border-tertiary-dark bg-primary-light p-1 drop-shadow-navlink"
                :class="[order.has_shipping ? '' : 'opacity-0']"
                :disabled="!order.has_shipping"
                @click="updateShipmentStatus(order.id, order.updated_shipment)"
              >
                update
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
      <span class="material-icons-outlined !text-9xl text-primary"> receipt_long </span>
      <span class="text-xl font-medium">Sin ordenes</span>
      <span class="min-w-[335px] text-center font-medium"> Todavía no se realizó ninguna orden. </span>
    </div>
  </div>

  <dialog id="detailsDialog" class="border-2 border-tertiary-dark bg-secondary-light md:w-[800px]">
    <div class="flex flex-col gap-3">
      <button class="material-icons-outlined ml-auto" @click="closeDialog()">close</button>
      <div v-if="currentOrder" class="flex flex-col gap-3">
        <div class="flex justify-between">
          <span class="w-fit border-2 border-tertiary-dark bg-primary p-2 text-sm font-bold drop-shadow-navlink">
            #{{ currentOrder.id }}
          </span>
          <span class="w-fit border-2 border-tertiary-dark bg-primary p-2 text-sm font-bold drop-shadow-navlink">
            ESTADO: {{ orderState(currentOrder.status) }}
          </span>
        </div>
        <div class="flex flex-col gap-2 md:flex-row">
          <div class="flex flex-col gap-1 px-2 md:w-1/2">
            <span class="font-medium">
              Nombre: {{ currentOrder.payer.name }}
              {{ currentOrder.payer.surname }}
            </span>
            <span class="font-medium"> Teléfono: {{ currentOrder.payer.phone.area_code }}-{{ currentOrder.payer.phone.number }} </span>
            <span class="font-medium"> Email: {{ currentOrder.payer.email }} </span>
          </div>
          <div class="border-b-2 border-r-2 border-tertiary-dark"></div>
          <div class="flex flex-col gap-1 px-2 md:w-1/2">
            <span v-for="item in currentOrder.items" :key="item.id" class="font-medium">
              x{{ item.quantity }} - {{ item.title }}: ${{ item.unit_price * item.quantity }}
            </span>
            <span class="font-medium">Subtotal ${{ currentOrder.transaction_details.total_paid_amount }}</span>
            <span class="font-medium">Comisión Mercado Pago ${{ mpCommission() }}</span>
          </div>
        </div>
        <div class="flex justify-between border-2 border-tertiary-dark bg-primary p-2 font-medium drop-shadow-navlink">
          <span>{{ formatedDate(currentOrder.date_created.slice(0, 10)) }}</span>
          <span class="font-bold"> TOTAL: ${{ currentOrder.transaction_details.net_received_amount }} </span>
        </div>
      </div>
    </div>
  </dialog>
</template>
