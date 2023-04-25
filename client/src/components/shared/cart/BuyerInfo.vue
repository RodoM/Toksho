<script setup>
import { reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  requiredIf,
  email,
  numeric,
  minLength,
  maxLength,
  helpers,
} from "@vuelidate/validators";

import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";

const state = reactive({
  payer: {
    name: undefined,
    surname: undefined,
    email: undefined,
    phone: {
      area_code: undefined,
      number: undefined,
    },
    address: {
      street_name: undefined,
      street_number: undefined,
    },
  },
  shipment: false,
});

const rules = computed(() => {
  return {
    payer: {
      name: {
        required: helpers.withMessage("Nombre requerido", required),
      },
      surname: {
        required: helpers.withMessage("Apellido requerido", required),
      },
      email: {
        required: helpers.withMessage("Email requerido", required),
        email: helpers.withMessage("Ingresa un email valido", email),
      },
      phone: {
        area_code: {
          required: helpers.withMessage("Código de área requerido", required),
          numeric: helpers.withMessage("Solo se admiten numeros", numeric),
          minLength: helpers.withMessage("Mínimo 3 dígitos", minLength(3)),
          maxLength: helpers.withMessage("Máximo 4 dígitos", maxLength(4)),
        },
        number: {
          required: helpers.withMessage("Número requerido", required),
          minLength: helpers.withMessage("Mínimo 6 dígitos", minLength(6)),
          maxLength: helpers.withMessage("Máximo 7 dígitos", maxLength(7)),
        },
      },
      address: {
        street_name: {
          requiredIf: helpers.withMessage(
            "Calle requerida",
            requiredIf(state.shipment)
          ),
        },
        street_number: {
          requiredIf: helpers.withMessage(
            "Número requerido",
            requiredIf(state.shipment)
          ),
        },
      },
    },
  };
});

const v$ = useVuelidate(rules, state);

const emit = defineEmits(["validate"]);

const validateInfo = async () => {
  const result = await v$.value.$validate();
  if (result) emit("validate");
};

defineExpose({
  state,
  validateInfo,
});
</script>

<template>
  <content-block class="px-5">
    <form class="flex flex-col gap-5">
      <div class="flex flex-col gap-5 md:flex-row">
        <div class="w-full">
          <div>
            <label :for="state.payer.name">Nombre</label>
            <span v-if="v$.payer.name.$error" class="pl-2 text-red-500">
              {{ v$.payer.name.$errors[0].$message }}
            </span>
          </div>
          <input
            v-model="state.payer.name"
            type="text"
            placeholder="Nombre"
            class="w-full p-3 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
          />
        </div>

        <div class="w-full">
          <div>
            <label :for="state.payer.surname">Apellido</label>
            <span v-if="v$.payer.surname.$error" class="pl-2 text-red-500">
              {{ v$.payer.surname.$errors[0].$message }}
            </span>
          </div>
          <input
            v-model="state.payer.surname"
            type="text"
            placeholder="Apellido"
            class="w-full p-3 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
          />
        </div>
      </div>

      <div>
        <div>
          <label :for="state.payer.email">Email</label>
          <span v-if="v$.payer.email.$error" class="pl-2 text-red-500">
            {{ v$.payer.email.$errors[0].$message }}
          </span>
        </div>
        <input
          v-model="state.payer.email"
          type="email"
          placeholder="Email"
          class="w-full p-3 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
        />
      </div>

      <div class="flex flex-col gap-5 md:flex-row">
        <div class="w-full">
          <div>
            <label :for="state.payer.phone.area_code">Código de área</label>
            <span v-if="v$.payer.phone.area_code.$error" class="pl-2 text-red-500">
              {{ v$.payer.phone.area_code.$errors[0].$message }}
            </span>
          </div>
          <input
            v-model="state.payer.phone.area_code"
            type="text"
            placeholder="Código de área"
            class="w-full p-3 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
          />
        </div>

        <div class="w-full">
          <div>
            <label :for="state.payer.phone.number">Número de télefono</label>
            <span v-if="v$.payer.phone.number.$error" class="pl-2 text-red-500">
              {{ v$.payer.phone.number.$errors[0].$message }}
            </span>
          </div>
          <input
            v-model="state.payer.phone.number"
            type="number"
            placeholder="Código de área"
            class="w-full p-3 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
          />
        </div>
      </div>

      <div class="flex gap-3">
        <input v-model="state.shipment" type="checkbox" />
        <span>Envio (Costo $X, los mismos se realizan los días)</span>
      </div>

      <div v-if="state.shipment" class="flex flex-col gap-5 md:flex-row">
        <div class="w-full">
          <div>
            <label :for="state.payer.address.street_name">Calle</label>
            <span v-if="v$.payer.address.street_name.$error" class="pl-2 text-red-500">
              {{ v$.payer.address.street_name.$errors[0].$message }}
            </span>
          </div>
          <input
            v-model="state.payer.address.street_name"
            type="text"
            placeholder="Calle"
            class="w-full p-3 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
          />
        </div>

        <div class="w-full">
          <div>
            <label :for="state.payer.address.street_number">Número</label>
            <span v-if="v$.payer.address.street_number.$error" class="pl-2 text-red-500">
              {{ v$.payer.address.street_number.$errors[0].$message }}
            </span>
          </div>
          <input
            v-model="state.payer.address.street_number"
            type="number"
            placeholder="Número"
            class="w-full p-3 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
          />
        </div>
      </div>
    </form>
  </content-block>
</template>
