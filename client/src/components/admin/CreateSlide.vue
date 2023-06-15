<script setup>
import { reactive, computed } from "vue";
import { createSlide } from "@/supabase/helpers.js";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useToast } from "vue-toast-notification";
import CustomButton from "@/lib/components/CustomButton.vue";

const emit = defineEmits(["created"]);

const $toast = useToast();

const getFile = () => {
  const selectedFile = event.target.files[0];
  state.image = selectedFile;
};

const state = reactive({
  image: undefined,
  primaryText: undefined,
  secondaryText: undefined,
});

const rules = computed(() => {
  return {
    image: {
      required: helpers.withMessage("Imágen requerida", required),
    },
    primaryText: {
      required: helpers.withMessage("Texto requerido", required),
    },
    secondaryText: {
      required: helpers.withMessage("Texto requerido", required),
    },
  };
});

const v$ = useVuelidate(rules, state);

async function createSlideImage() {
  const { image, primaryText, secondaryText } = state;
  try {
    const error = await createSlide(image, primaryText, secondaryText);
    if (error) throw error;
    else {
      $toast.open({
        position: "top-right",
        message: "Se creo correctamente la diapositiva",
        type: "success",
        duration: 5000,
        dismissible: true,
        pauseOnHover: true,
      });
      emit("created");
    }
  } catch (error) {
    $toast.open({
      position: "top-right",
      message: "Error al crear la diapositiva",
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
  if (result) createSlideImage();
}
</script>

<template>
  <form class="flex flex-col justify-between gap-5 md:flex-row">
    <div>
      <div>
        <label :for="state.image">Imágen</label>
        <span v-if="v$.image.$error" class="pl-2 text-red-500">
          {{ v$.image.$errors[0].$message }}
        </span>
      </div>
      <input
        id="imageInput"
        type="file"
        class="bg-white border-2 border-tertiary-dark drop-shadow-items h-[52px] py-[9px] px-3 w-fillAvailable"
        @change="getFile"
      />
    </div>
    <div>
      <div>
        <label :for="state.primaryText">Texto primario</label>
        <span v-if="v$.primaryText.$error" class="pl-2 text-red-500">
          {{ v$.primaryText.$errors[0].$message }}
        </span>
      </div>
      <input
        v-model="state.primaryText"
        type="text"
        placeholder="Texto primario"
        class="w-full p-3 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
      />
    </div>
    <div>
      <div>
        <label :for="state.secondaryText">Texto secundario</label>
        <span v-if="v$.secondaryText.$error" class="pl-2 text-red-500">
          {{ v$.secondaryText.$errors[0].$message }}
        </span>
      </div>
      <input
        v-model="state.secondaryText"
        type="text"
        placeholder="Texto secundario"
        class="w-full p-3 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
      />
    </div>
    <CustomButton
      primary
      class="md:px-10 md:w-fit h-[52px] mt-auto"
      @click="submitForm()"
    >
      AGREGAR
    </CustomButton>
  </form>
</template>
