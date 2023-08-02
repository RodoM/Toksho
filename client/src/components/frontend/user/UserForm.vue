<script setup>
import { onMounted, reactive, computed } from "vue";
import { getUser, updateUser } from "@/supabase/helpers.js";
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers, requiredIf } from "@vuelidate/validators";
import { useToast } from "vue-toast-notification";

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
  address: {
    province: "",
    city: "",
    postalCode: "",
    street: "",
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
        requiredIf: helpers.withMessage(
          "Requerido",
          requiredIf(!isObjectEmpty(state.phone))
        ),
      },
      number: {
        requiredIf: helpers.withMessage(
          "Requerido",
          requiredIf(!isObjectEmpty(state.phone))
        ),
      },
    },
    address: {
      province: {
        requiredIf: helpers.withMessage(
          "Requerido",
          requiredIf(!isObjectEmpty(state.address))
        ),
      },
      city: {
        requiredIf: helpers.withMessage(
          "Requerido",
          requiredIf(!isObjectEmpty(state.address))
        ),
      },
      postalCode: {
        requiredIf: helpers.withMessage(
          "Requerido",
          requiredIf(!isObjectEmpty(state.address))
        ),
      },
      street: {
        requiredIf: helpers.withMessage(
          "Requerido",
          requiredIf(!isObjectEmpty(state.address))
        ),
      },
      number: {
        requiredIf: helpers.withMessage(
          "Requerido",
          requiredIf(!isObjectEmpty(state.address))
        ),
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

const $toast = useToast();

async function updateUserData() {
  try {
    const error = await updateUser(props.userId, state);
    if (error) throw error;
    else {
      $toast.open({
        position: "top-right",
        message: "Se actualizaron correctamente los datos",
        type: "success",
        duration: 5000,
        dismissible: true,
        pauseOnHover: true,
      });
    }
  } catch (error) {
    $toast.open({
      position: "top-right",
      message: "Error al actualizar los datos",
      type: "error",
      duration: 5000,
      dismissible: true,
      pauseOnHover: true,
    });
  }
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
      <div class="flex flex-col gap-3 lg:flex-row">
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
            class="w-full p-3 border-2 border-tertiary-dark drop-shadow-navlink focus:outline-none"
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
            class="w-full p-3 border-2 border-tertiary-dark drop-shadow-navlink focus:outline-none"
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
          class="w-full p-3 border-2 border-tertiary-dark drop-shadow-navlink focus:outline-none"
        />
      </div>

      <div class="flex flex-col gap-3 lg:flex-row">
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
            class="w-full p-3 border-2 border-tertiary-dark drop-shadow-navlink focus:outline-none"
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
            class="w-full p-3 border-2 border-tertiary-dark drop-shadow-navlink focus:outline-none"
          />
        </div>
      </div>

      <div class="w-full">
        <div>
          <label :for="state.address.province">Provincia</label>
          <span v-if="v$.address.province.$error" class="pl-2 text-red-500">
            {{ v$.address.province.$errors[0].$message }}
          </span>
        </div>
        <input
          v-model="state.address.province"
          type="text"
          placeholder="Provincia"
          class="w-full p-3 border-2 border-tertiary-dark drop-shadow-navlink focus:outline-none"
        />
      </div>

      <div class="flex flex-col gap-3 lg:flex-row">
        <div class="w-full">
          <div>
            <label :for="state.address.city">Ciudad</label>
            <span v-if="v$.address.city.$error" class="pl-2 text-red-500">
              {{ v$.address.city.$errors[0].$message }}
            </span>
          </div>
          <input
            v-model="state.address.city"
            type="text"
            placeholder="Ciudad"
            class="w-full p-3 border-2 border-tertiary-dark drop-shadow-navlink focus:outline-none"
          />
        </div>
        <div class="w-full">
          <div>
            <label :for="state.address.postalCode">Código postal</label>
            <span v-if="v$.address.postalCode.$error" class="pl-2 text-red-500">
              {{ v$.address.postalCode.$errors[0].$message }}
            </span>
          </div>
          <input
            v-model="state.address.postalCode"
            type="number"
            placeholder="Código postal"
            class="w-full p-3 border-2 border-tertiary-dark drop-shadow-navlink focus:outline-none"
          />
        </div>
      </div>

      <div class="flex flex-col gap-3 lg:flex-row">
        <div class="w-full">
          <div>
            <label :for="state.address.street">Calle</label>
            <span v-if="v$.address.street.$error" class="pl-2 text-red-500">
              {{ v$.address.street.$errors[0].$message }}
            </span>
          </div>
          <input
            v-model="state.address.street"
            type="text"
            placeholder="Calle"
            class="w-full p-3 border-2 border-tertiary-dark drop-shadow-navlink focus:outline-none"
          />
        </div>
        <div class="w-full">
          <div>
            <label :for="state.address.number">Número</label>
            <span v-if="v$.address.number.$error" class="pl-2 text-red-500">
              {{ v$.address.number.$errors[0].$message }}
            </span>
          </div>
          <input
            v-model="state.address.number"
            type="number"
            placeholder="Número de calle"
            class="w-full p-3 border-2 border-tertiary-dark drop-shadow-navlink focus:outline-none"
          />
        </div>
      </div>

      <CustomButton
        class="w-full px-10 ml-auto lg:w-fit"
        primary
        @click="submitForm()"
      >
        ACTUALIZAR
      </CustomButton>
    </form>
  </content-block>
</template>
