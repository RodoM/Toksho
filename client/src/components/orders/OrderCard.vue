<script setup>
const props = defineProps({
  order: {
    type: Object,
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
  <div class="flex flex-col gap-3 border-2 border-tertiary-dark bg-secondary-light p-2 drop-shadow-items">
    <div class="flex justify-between">
      <span class="w-fit border-2 border-tertiary-dark bg-primary p-2 text-sm font-bold drop-shadow-navlink"> #{{ props.order.id }} </span>
      <span class="w-fit border-2 border-tertiary-dark bg-primary p-2 text-sm font-bold drop-shadow-navlink">
        ESTADO: {{ orderState(props.order.status) }}
      </span>
    </div>
    <div class="flex flex-col gap-2 md:flex-row">
      <div class="flex flex-col gap-1 px-2 md:w-1/2">
        <span class="font-medium">
          Nombre: {{ props.order.payer.name }}
          {{ props.order.payer.surname }}
        </span>
        <span class="font-medium"> Teléfono: {{ props.order.payer.phone.area_code }}-{{ props.order.payer.phone.number }} </span>
        <span class="font-medium"> Email: {{ props.order.payer.email }} </span>
      </div>
      <div class="border-b-2 border-r-2 border-tertiary-dark"></div>
      <div class="flex flex-col gap-1 px-2 md:w-1/2">
        <span v-for="item in props.order.items" :key="item.id" class="font-medium">
          x{{ item.quantity }} - {{ item.title }} - ${{ item.unit_price * item.quantity }}
        </span>
      </div>
    </div>
    <div class="flex justify-between border-2 border-tertiary-dark bg-primary p-2 font-medium drop-shadow-navlink">
      <span>{{ formatedDate(props.order.date_created.slice(0, 10)) }}</span>
      <span class="font-bold"> TOTAL: ${{ props.order.transaction_details.total_paid_amount }} </span>
    </div>
  </div>
</template>
