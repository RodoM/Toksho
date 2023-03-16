<script setup>
import { reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, alpha, helpers } from "@vuelidate/validators";
import { supabase } from "@/supabase/supabase.js";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

import sbHelpers from "@/supabase/helpers.js";

import HeaderTitle from "@/components/frontend/headers/HeaderTitle.vue";
import CustomButton from "@/lib/components/CustomButton.vue";

const router = useRouter();
const $toast = useToast();

const state = reactive({
  type: "",
  name: "",
  image: {
    image: null,
    imageReader: "/src/assets/images/image-placeholder.jpg",
    imageURL: "",
  },
  author: "",
  categories: "",
  price: "",
  discount: "0",
  description: "",
  stock: "",
});

const rules = computed(() => {
  return {
    type: {
      required: helpers.withMessage("Tipo requerido", required),
      alpha: helpers.withMessage("Solo caracteres alfabeticos", alpha),
    },
    name: {
      required: helpers.withMessage("Nombre requerido", required),
    },
    image: {
      image: {
        required: helpers.withMessage("Imágen requerida", required),
      },
    },
    author: {
      required: helpers.withMessage("Autor requerido", required),
    },
    categories: {
      required: helpers.withMessage("Categorías requeridas", required),
    },
    price: {
      required: helpers.withMessage("Precio requerido", required),
    },
    description: {
      required: helpers.withMessage("Descripción requerida", required),
    },
    stock: {
      required: helpers.withMessage("Stock requerido", required),
    },
  };
});

const v$ = useVuelidate(rules, state);

const getCategories = () => {
  return state.categories.split(/\s*,\s*/);
};

const getFile = () => {
  const selectedFile = event.target.files[0];
  state.image.image = selectedFile;

  const inputValue = document.querySelector("#fileInput");
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    state.image.imageReader = reader.result;
  });
  reader.readAsDataURL(inputValue.files[0]);
};

const addProduct = async () => {
  let date = new Date();
  date = String(date.getTime());
  const results = await Promise.all([
    sbHelpers.uploadFile(state.name.concat(date), state.image.image),
    sbHelpers.getFileURL(state.name.concat(date)),
  ]);
  state.image.imageURL = results[1];
  const { error } = await supabase.from("Products").insert([
    {
      name: state.name,
      type: state.type,
      categories: getCategories(),
      image: state.image.imageURL,
      price: state.price,
      discount: state.discount,
      stock: state.stock,
      author: state.author,
      description: state.description,
      updated_at: date,
    },
  ]);
  if (error) {
    $toast.open({
      position: "top-right",
      message: "Error al agregar el producto",
      type: "error",
      duration: 5000,
      dismissible: true,
      pauseOnHover: true,
    });
  } else {
    $toast.open({
      position: "top-right",
      message: "Se agrego correctamente el producto",
      type: "success",
      duration: 5000,
      dismissible: true,
      pauseOnHover: true,
    });
    router.push({ name: "Stock" });
  }
};

const goBack = (e) => {
  e.preventDefault();
  router.push({ name: "Stock" });
};

const submitForm = async (e) => {
  e.preventDefault();
  const result = await v$.value.$validate();
  if (result) addProduct();
};
</script>

<template>
  <div class="container py-5 mx-auto">
    <header-title class="mx-5 mb-5">
      <span class="text-2xl font-bold uppercase">AÑADIR PRODUCTO</span>
    </header-title>
    <form class="flex flex-col gap-4 mx-5">
      <div class="flex flex-col gap-4 md:flex-row">
        <img
          :src="state.image.imageReader"
          alt=""
          class="md:h-[680px] md:w-[503px] lg:h-[656px] lg:min-w-[468px] bg-slate-400 border-2 border-tertiary-dark drop-shadow-items"
        />
        <div class="flex flex-col w-full gap-4">
          <div class="w-full">
            <div>
              <label :for="state.type">Tipo de producto</label>
              <span v-if="v$.type.$error" class="pl-2 text-red-500">
                {{ v$.type.$errors[0].$message }}
              </span>
            </div>
            <input
              v-model="state.type"
              type="text"
              placeholder="Tipo de producto"
              class="w-full p-2 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
            />
          </div>
          <div class="w-full">
            <div>
              <label :for="state.name">Nombre del producto</label>
              <span v-if="v$.name.$error" class="pl-2 text-red-500">
                {{ v$.name.$errors[0].$message }}
              </span>
            </div>
            <input
              v-model="state.name"
              type="text"
              placeholder="Nombre del producto"
              class="w-full p-2 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
            />
          </div>
          <div class="w-full">
            <div>
              <label :for="state.image.image">Imagen</label>
              <span v-if="v$.image.image.$error" class="pl-2 text-red-500">
                {{ v$.image.image.$errors[0].$message }}
              </span>
            </div>
            <input
              id="fileInput"
              type="file"
              accept="image/png, image/jpeg"
              class="block w-full bg-white border-2 cursor-pointer drop-shadow-items border-tertiary-dark focus:outline-none"
              @change="getFile"
            />
          </div>
          <div class="w-full">
            <div>
              <label :for="state.author">Autor</label>
              <span v-if="v$.author.$error" class="pl-2 text-red-500">
                {{ v$.author.$errors[0].$message }}
              </span>
            </div>
            <input
              v-model="state.author"
              type="text"
              placeholder="Autor"
              class="w-full p-2 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
            />
          </div>
          <div>
            <div>
              <label :for="state.categories">
                Categorías (separadas por comas)
              </label>
              <span v-if="v$.categories.$error" class="pl-2 text-red-500">
                {{ v$.categories.$errors[0].$message }}
              </span>
            </div>
            <input
              v-model="state.categories"
              type="text"
              placeholder="Categorías"
              class="w-full p-2 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
            />
          </div>
          <div class="w-full">
            <div>
              <label :for="state.price">Precio</label>
              <span v-if="v$.price.$error" class="pl-2 text-red-500">
                {{ v$.price.$errors[0].$message }}
              </span>
            </div>
            <input
              v-model="state.price"
              type="number"
              placeholder="Precio"
              class="w-full p-2 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
            />
          </div>
          <div class="w-full">
            <div>
              <label :for="state.discount">Descuento (opcional)</label>
            </div>
            <input
              v-model="state.discount"
              type="number"
              placeholder="Descuento"
              class="w-full p-2 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
            />
          </div>
          <div class="w-full">
            <div>
              <label :for="state.stock">Cantidad de stock</label>
              <span v-if="v$.stock.$error" class="pl-2 text-red-500">
                {{ v$.stock.$errors[0].$message }}
              </span>
            </div>
            <input
              v-model="state.stock"
              type="number"
              placeholder="Cantidad de stock"
              class="w-full p-2 border-2 border-tertiary-dark drop-shadow-items focus:outline-none"
            />
          </div>
        </div>
      </div>
      <div>
        <div>
          <label :for="state.description">Descripción</label>
          <span v-if="v$.description.$error" class="pl-2 text-red-500">
            {{ v$.description.$errors[0].$message }}
          </span>
        </div>
        <textarea
          v-model="state.description"
          type="text"
          placeholder="Descripción"
          class="w-full p-2 border-2 border-tertiary-dark drop-shadow-items focus:outline-none h-80"
        />
      </div>
      <div class="flex flex-col justify-between gap-3 md:flex-row">
        <CustomButton class="md:px-36 md:order-2" primary @click="submitForm">
          AGREGAR
        </CustomButton>
        <CustomButton class="md:px-36 md:order-1" secondary @click="goBack">
          VOLVER
        </CustomButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
input[type="file"]::file-selector-button {
  cursor: pointer;
  background-color: #eeba5e;
  border: none;
  border-right: 2px solid #0f0f0f;
  padding: 8px;
}
</style>
