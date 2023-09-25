<script setup>
import { onMounted, reactive, computed } from "vue";
import { getUser, updateUser } from "@/supabase/helpers";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, maxLength, helpers, requiredIf } from "@vuelidate/validators";

import CustomButton from "@/lib/components/CustomButton.vue";
import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";

const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
});

let state = reactive({
  first_name: "",
  last_name: "",
  email: "",
  phone: {
    code: "",
    number: "",
  },
});

const rules = computed(() => {
  return {
    first_name: {
      required: helpers.withMessage("Requerido", required),
    },
    last_name: {
      required: helpers.withMessage("Requerido", required),
    },
    email: {
      required: helpers.withMessage("Requerido", required),
      email: helpers.withMessage("Ingresa un correo electronico valido", email),
    },
    phone: {
      code: {
        requiredIf: helpers.withMessage("Requerido", requiredIf(!isObjectEmpty(state.phone))),
        minLength: helpers.withMessage("Mínimo 3 dígitos", minLength(3)),
        maxLength: helpers.withMessage("Máximo 4 dígitos", maxLength(4)),
      },
      number: {
        requiredIf: helpers.withMessage("Requerido", requiredIf(!isObjectEmpty(state.phone))),
        minLength: helpers.withMessage("Mínimo 6 dígitos", minLength(6)),
        maxLength: helpers.withMessage("Máximo 7 dígitos", maxLength(7)),
      },
    },
  };
});

const v$ = useVuelidate(rules, state);

function isObjectEmpty(object) {
  for (let key in object) {
    if (object[key] !== "") {
      return false;
    }
  }
  return true;
}

async function updateUserData() {
  await updateUser(props.userId, state);
}

async function submitForm() {
  event.preventDefault();
  const result = await v$.value.$validate();
  if (result) updateUserData();
}

onMounted(async () => {
  const userData = await getUser(props.userId);
  Object.assign(state, userData);
});
</script>

<template>
  <content-block class="p-5">
    <form class="flex flex-col gap-y-3">
      <div class="flex flex-col gap-3 xl:flex-row">
        <div class="w-full">
          <div>
            <label :for="state.first_name">Nombre</label>
            <span v-if="v$.first_name.$error" class="pl-2 text-red-500">
              {{ v$.first_name.$errors[0].$message }}
            </span>
          </div>
          <input
            v-model="state.first_name"
            type="text"
            placeholder="Nombre"
            class="w-full border-2 border-tertiary-dark p-3 drop-shadow-navlink focus:outline-none"
          />
        </div>

        <div class="w-full">
          <div>
            <label :for="state.last_name">Apellido</label>
            <span v-if="v$.last_name.$error" class="pl-2 text-red-500">
              {{ v$.last_name.$errors[0].$message }}
            </span>
          </div>
          <input
            v-model="state.last_name"
            type="text"
            placeholder="Apellido"
            class="w-full border-2 border-tertiary-dark p-3 drop-shadow-navlink focus:outline-none"
          />
        </div>
      </div>

      <div class="w-full">
        <div>
          <label :for="state.email">Email</label>
          <span v-if="v$.email.$error" class="pl-2 text-red-500">
            {{ v$.email.$errors[0].$message }}
          </span>
        </div>
        <input
          v-model="state.email"
          type="mail"
          placeholder="Email"
          class="w-full border-2 border-tertiary-dark p-3 drop-shadow-navlink focus:outline-none"
        />
      </div>

      <div class="flex flex-col gap-3 xl:flex-row">
        <div class="w-full">
          <div>
            <label :for="state.phone?.code">Código de area</label>
            <span v-if="v$.phone.code?.$error" class="pl-2 text-red-500">
              {{ v$.phone.code?.$errors[0].$message }}
            </span>
          </div>
          <input
            v-model="state.phone.code"
            type="number"
            placeholder="Código de area"
            class="w-full border-2 border-tertiary-dark p-3 drop-shadow-navlink focus:outline-none"
          />
        </div>
        <div class="w-full">
          <div>
            <label :for="state.phone.number">Número</label>
            <span v-if="v$.phone.number.$error" class="pl-2 text-red-500">
              {{ v$.phone.number.$errors[0].$message }}
            </span>
          </div>
          <input
            v-model="state.phone.number"
            type="number"
            placeholder="Número de télefono"
            class="w-full border-2 border-tertiary-dark p-3 drop-shadow-navlink focus:outline-none"
          />
        </div>
      </div>

      <CustomButton class="ml-auto w-full px-10 lg:w-fit" primary @click="submitForm()"> ACTUALIZAR </CustomButton>
    </form>
  </content-block>
</template>
