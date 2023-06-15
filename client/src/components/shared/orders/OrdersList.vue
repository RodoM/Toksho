<script setup>
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
</script>

<template>
  <ul class="flex flex-col gap-5">
    <li
      v-for="order in props.orders"
      :key="order.id"
      class="p-4 border-2 bg-secondary-light border-tertiary-dark drop-shadow-items"
    >
      <div class="flex flex-col gap-3">
        <div class="flex justify-between">
          <span
            class="p-2 text-sm font-bold border-2 w-fit bg-primary border-tertiary-dark drop-shadow-navlink"
          >
            #{{ order.id }}
          </span>
          <span
            class="p-2 text-sm font-bold border-2 w-fit bg-primary border-tertiary-dark drop-shadow-navlink"
          >
            ESTADO: {{ orderState(order.status_detail) }}
          </span>
        </div>
        <div class="flex flex-col gap-2 md:flex-row">
          <div class="flex flex-col gap-1 px-2 md:w-1/2">
            <span class="font-medium">
              Nombre: {{ order.payer.name }} {{ order.payer.surname }}
            </span>
            <span class="font-medium">
              Teléfono: {{ order.payer.phone.area_code }}-{{
                order.payer.phone.number
              }}
            </span>
            <span class="font-medium"> Email: {{ order.payer.email }} </span>
            <span v-if="order.payer.address.location" class="font-medium">
              Localidad: {{ order.payer.address.location }}
              {{ `(CP: ${order.payer.address.postal_code})` }},
              {{ order.payer.address.province }}
            </span>
            <span v-if="order.payer.address.street_name" class="font-medium">
              Dirección: {{ order.payer.address.street_name }}
              {{ order.payer.address.street_number }}
            </span>
          </div>
          <div class="border-b-2 border-r-2 border-tertiary-dark"></div>
          <div class="flex flex-col gap-1 px-2 md:w-1/2">
            <span
              v-for="item in order.items"
              :key="item.id"
              class="font-medium"
            >
              x{{ item.quantity }} - {{ item.title }} - ${{
                item.unit_price * item.quantity
              }}
            </span>
            <span v-if="order.payer.address.postal_code" class="font-medium">
              x1 - Envio - $500
            </span>
          </div>
        </div>
        <div
          class="flex justify-between p-2 font-medium border-2 bg-primary border-tertiary-dark drop-shadow-navlink"
        >
          <span>{{ formatedDate(order.date_created.slice(0, 10)) }}</span>
          <span class="font-bold">
            TOTAL: ${{ order.transaction_details.total_paid_amount }}
          </span>
        </div>
      </div>
    </li>
  </ul>
</template>
