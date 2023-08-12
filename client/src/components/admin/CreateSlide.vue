<script setup>
import { ref, reactive, computed } from "vue";
import { createSlide } from "@/supabase/helpers";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

import ContentBlock from "@/components/shared/blocks/ContentBlock.vue";
import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import CustomButton from "@/lib/components/CustomButton.vue";

const emit = defineEmits(["created"]);

const getFile = (event) => {
  const selectedFile = event.target.files[0];
  state.image = selectedFile;
};

const convertImage = async () => {
  const width = 1280;
  const height = 720;
  const resizedBlob = await resizeImage(state.image, width, height);

  const convertedFile = new File([resizedBlob], "converted.webp", {
    type: "image/webp",
  });
  return convertedFile;
};

const resizeImage = (file, width, height) => {
  const img = new Image();
  img.src = URL.createObjectURL(file);

  return new Promise((resolve) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((resizedBlob) => {
        resolve(resizedBlob);
      }, "image/webp");
    };
  });
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

const loading = ref(false);

async function createSlideImage() {
  if (!loading.value) {
    loading.value = true;
    const image = await convertImage();
    const { primaryText, secondaryText } = state;
    await createSlide(image, primaryText, secondaryText);
    emit("created");
  }
  loading.value = false;
}

async function submitForm(event) {
  event.preventDefault();
  const result = await v$.value.$validate();
  if (result) createSlideImage();
}
</script>

<template>
  <content-block class="z-0 gap-y-5 px-5">
    <header-title>
      <span class="text-2xl font-bold">DIAPOSITIVAS</span>
    </header-title>
    <form class="flex flex-col justify-between gap-4 md:flex-row">
      <div class="w-full">
        <div>
          <label :for="state.image">Imágen</label>
          <span v-if="v$.image.$error" class="pl-2 text-red-500">
            {{ v$.image.$errors[0].$message }}
          </span>
        </div>
        <input
          id="imageInput"
          type="file"
          class="block h-[52px] w-full cursor-pointer border-2 border-tertiary-dark bg-white drop-shadow-items focus:outline-none"
          @change="getFile"
        />
      </div>
      <div class="w-full">
        <div>
          <label :for="state.primaryText">Texto primario</label>
          <span v-if="v$.primaryText.$error" class="pl-2 text-red-500">
            {{ v$.primaryText.$errors[0].$message }}
          </span>
        </div>
        <input
          v-model="state.primaryText"
          type="text"
          placeholder="Texto grande"
          class="w-full border-2 border-tertiary-dark p-3 drop-shadow-items focus:outline-none"
        />
      </div>
      <div class="w-full">
        <div>
          <label :for="state.secondaryText">Texto secundario</label>
          <span v-if="v$.secondaryText.$error" class="pl-2 text-red-500">
            {{ v$.secondaryText.$errors[0].$message }}
          </span>
        </div>
        <input
          v-model="state.secondaryText"
          type="text"
          placeholder="Texto pequeño"
          class="w-full border-2 border-tertiary-dark p-3 drop-shadow-items focus:outline-none"
        />
      </div>
    </form>
    <CustomButton primary class="ml-auto w-full px-10 md:w-fit" :loading="loading" @click="submitForm"> AGREGAR </CustomButton>
  </content-block>
</template>

<style scoped>
input[type="file"]::file-selector-button {
  height: 100%;
  cursor: pointer;
  background-color: #eeba5e;
  border: none;
  border-right: 2px solid #0f0f0f;
  padding: 8px;
}
</style>
