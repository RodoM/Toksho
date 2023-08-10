<script setup>
import { reactive, computed, onMounted } from "vue";
import { getUser } from "@/supabase/helpers";
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf, email, numeric, minLength, maxLength, helpers } from "@vuelidate/validators";
import { userStore } from "@/stores/index.js";

import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";

const store = userStore();

const props = defineProps({
  shipmentPrice: {
    type: Number,
  },
});

const state = reactive({
  payer: {
    id: store.user ? store.user.id : null,
    name: undefined,
    surname: undefined,
    email: undefined,
    phone: {
      area_code: undefined,
      number: undefined,
    },
    address: {
      location: undefined,
      postal_code: undefined,
      province: undefined,
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
        required: helpers.withMessage("Requerido", required),
      },
      surname: {
        required: helpers.withMessage("Requerido", required),
      },
      email: {
        required: helpers.withMessage("Requerido", required),
        email: helpers.withMessage("Ingresa un email valido", email),
      },
      phone: {
        area_code: {
          required: helpers.withMessage("Requerido", required),
          numeric: helpers.withMessage("Solo se admiten numeros", numeric),
          minLength: helpers.withMessage("Mínimo 3 dígitos", minLength(3)),
          maxLength: helpers.withMessage("Máximo 4 dígitos", maxLength(4)),
        },
        number: {
          required: helpers.withMessage("Requerido", required),
          minLength: helpers.withMessage("Mínimo 6 dígitos", minLength(6)),
          maxLength: helpers.withMessage("Máximo 7 dígitos", maxLength(7)),
        },
      },
      address: {
        location: {
          requiredIf: helpers.withMessage("Requerido", requiredIf(state.shipment)),
        },
        postal_code: {
          requiredIf: helpers.withMessage("Requerido", requiredIf(state.shipment)),
        },
        province: {
          requiredIf: helpers.withMessage("Requerido", requiredIf(state.shipment)),
        },
        street_name: {
          requiredIf: helpers.withMessage("Requerido", requiredIf(state.shipment)),
        },
        street_number: {
          requiredIf: helpers.withMessage("Requerido", requiredIf(state.shipment)),
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

onMounted(async () => {
  if (store.user?.id) {
    const { first_name, last_name, email, phone, address } = await getUser(store.user.id);
    state.payer.name = first_name;
    state.payer.surname = last_name;
    state.payer.email = email;
    state.payer.phone.area_code = String(phone.code);
    state.payer.phone.number = phone.number;
    state.payer.address.province = address.province;
    state.payer.address.location = address.city;
    state.payer.address.postal_code = address.postalCode;
    state.payer.address.street_name = address.street;
    state.payer.address.street_number = address.number;
  }
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
            class="w-full border-2 border-tertiary-dark p-3 drop-shadow-navlink focus:outline-none"
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
            class="w-full border-2 border-tertiary-dark p-3 drop-shadow-navlink focus:outline-none"
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
          class="w-full border-2 border-tertiary-dark p-3 drop-shadow-navlink focus:outline-none"
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
            class="w-full border-2 border-tertiary-dark p-3 drop-shadow-navlink focus:outline-none"
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
            class="w-full border-2 border-tertiary-dark p-3 drop-shadow-navlink focus:outline-none"
          />
        </div>
      </div>

      <div class="flex gap-3">
        <input v-model="state.shipment" type="checkbox" />
        <span>Envio ${{ props.shipmentPrice }}</span>
      </div>

      <div v-if="state.shipment" class="flex flex-col gap-5">
        <div class="flex flex-col gap-5 md:flex-row">
          <div class="w-full">
            <div>
              <label :for="state.payer.address.province">Provincia</label>
              <span v-if="v$.payer.address.province.$error" class="pl-2 text-red-500">
                {{ v$.payer.address.province.$errors[0].$message }}
              </span>
            </div>
            <input
              v-model="state.payer.address.province"
              type="text"
              placeholder="Provincia"
              class="w-full border-2 border-tertiary-dark p-3 drop-shadow-navlink focus:outline-none"
            />
          </div>

          <div class="w-full">
            <div>
              <label :for="state.payer.address.location">Ciudad</label>
              <span v-if="v$.payer.address.location.$error" class="pl-2 text-red-500">
                {{ v$.payer.address.location.$errors[0].$message }}
              </span>
            </div>
            <input
              v-model="state.payer.address.location"
              type="text"
              placeholder="Ciudad"
              class="w-full border-2 border-tertiary-dark p-3 drop-shadow-navlink focus:outline-none"
            />
          </div>
        </div>

        <div class="flex flex-col gap-5 md:flex-row">
          <div class="w-full">
            <div>
              <label :for="state.payer.address.postal_code"> Código postal </label>
              <span v-if="v$.payer.address.postal_code.$error" class="pl-2 text-red-500">
                {{ v$.payer.address.postal_code.$errors[0].$message }}
              </span>
            </div>
            <input
              v-model="state.payer.address.postal_code"
              type="number"
              placeholder="Código postal"
              class="w-full border-2 border-tertiary-dark p-3 drop-shadow-navlink focus:outline-none"
            />
          </div>

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
              class="w-full border-2 border-tertiary-dark p-3 drop-shadow-navlink focus:outline-none"
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
              class="w-full border-2 border-tertiary-dark p-3 drop-shadow-navlink focus:outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  </content-block>
</template>
