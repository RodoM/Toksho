<script setup>
import { reactive, computed, onMounted } from "vue";
import { getUser } from "@/supabase/helpers";
import { useVuelidate } from "@vuelidate/core";
import { required, email, numeric, minLength, maxLength, helpers } from "@vuelidate/validators";
import { userStore } from "@/stores/index.js";

import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";

const store = userStore();

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
    const { first_name, last_name, email, phone } = await getUser(store.user.id);
    state.payer.name = first_name;
    state.payer.surname = last_name;
    state.payer.email = email;
    state.payer.phone.area_code = String(phone.code);
    state.payer.phone.number = phone.number;
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
        <span>Envio</span>
      </div>

      <div v-if="state.shipment" class="flex flex-col gap-5">
        <p class="border-2 border-tertiary-dark bg-primary p-3 drop-shadow-navlink">
          Una vez confirmada tu compra se te enviará un link de <span class="font-medium">Andreani Envios</span> a tu email para que
          completes con tus datos personales y elijas la forma de envío. Una vez pagado el mismo se te enviará el código de seguimiento.
        </p>
      </div>
    </form>
  </content-block>
</template>
