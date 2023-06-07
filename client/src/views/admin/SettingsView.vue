<script setup>
import { ref } from "vue";
import CustomButton from "@/lib/components/CustomButton.vue";
import CustomModal from "@/lib/components/CustomModal.vue";

const slides = ref([
  {
    id: 1,
    image: "https://ixjtiaxfychgauasmxrl.supabase.co/storage/v1/object/public/news/images/3",
    small_text: "ejemplo 1",
    big_text: "texto 1",
  },
  {
    id: 2,
    image: "https://ixjtiaxfychgauasmxrl.supabase.co/storage/v1/object/public/news/images/3",
    small_text: "ejemplo 2",
    big_text: "texto 2",
  },
  {
    id: 3,
    image: "https://ixjtiaxfychgauasmxrl.supabase.co/storage/v1/object/public/news/images/3",
    small_text: "ejemplo 3",
    big_text: "texto 3",
  },
]);

const showModal = ref(false);
const editSlide = ref(false);
const addSlide = ref(false);
const imageToShow = ref();

const viewImage = (image) => {
  showModal.value = true;
  imageToShow.value = image;
};
</script>

<template>
  <div class="container py-5 mx-auto">
    <div class="px-5 mb-5">
      <CustomButton primary @click="addSlide = !addSlide">
        AGREGAR NUEVA SLIDE
      </CustomButton>
    </div>
    <div class="px-5 mb-5 overflow-x-auto whitespace-nowrap drop-shadow-items">
      <!-- Aislar tabla en componente -->
      <table class="w-full table-auto">
        <thead class="border-2 bg-primary border-tertiary-dark">
          <tr>
            <th class="px-5 text-start">IMAGEN</th>
            <th class="px-5 text-center">TEXTO SECUNDARIO</th>
            <th class="px-5 text-center">TEXTO PRIMARIO</th>
            <th class="px-5 text-center">ACCIONES</th>
          </tr>
        </thead>
        <tbody class="border-2 border-tertiary-dark">
          <tr
            v-for="(slide, i) in slides"
            :key="slide.id"
            :class="[i % 2 === 0 ? 'bg-secondary-light' : 'bg-secondary']"
          >
            <td class="px-5 font-medium md:w-[450px]">
              <button
                v-if="slide.id != editSlide"
                class="p-1 border-2 material-icons-outlined bg-primary-light border-tertiary-dark drop-shadow-navlink"
                @click="viewImage(slide.image)"
              >
                visibility
              </button>
              <input
                v-else
                id="fileInput"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                class="block bg-white border-2 cursor-pointer drop-shadow-items border-tertiary-dark focus:outline-none"
              />
            </td>
            <td class="px-5 font-medium text-center">{{ slide.small_text }}</td>
            <td class="px-5 font-medium text-center">{{ slide.big_text }}</td>
            <td class="flex justify-center gap-3 px-5 py-2">
              <button
                v-if="slide.id != editSlide"
                class="p-1 border-2 material-icons-outlined bg-primary-light border-tertiary-dark drop-shadow-navlink"
                @click="editSlide = slide.id"
              >
                edit
              </button>
              <button
                v-else
                class="p-1 border-2 material-icons-outlined bg-primary-light border-tertiary-dark drop-shadow-navlink"
                @click="editSlide = undefined"
              >
                done
              </button>
              <button
                class="p-1 border-2 material-icons-outlined bg-primary-light border-tertiary-dark drop-shadow-navlink"
              >
                delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <CustomModal :show="showModal">
      <div
        class="relative border-2 drop-shadow-items border-tertiary-dark bg-background"
      >
        <button
          type="button"
          class="absolute top-3 right-2.5"
          @click="showModal = false"
        >
          <span class="material-icons-outlined text-tertiary-dark">
            close
          </span>
        </button>
        <img :src="imageToShow" alt="slide-image" />
      </div>
    </CustomModal>
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
