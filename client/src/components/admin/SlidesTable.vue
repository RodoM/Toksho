<script setup>
import { ref } from "vue";
import { deleteSlide } from "@/supabase/helpers.js";

const props = defineProps({
  slides: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["deleted"]);

async function deleteSlideImage(slide) {
  if (confirm("¿Esta seguro que desea eliminar esta diapositiva?")) {
    await deleteSlide(slide.id, slide.updated_at);
    emit("deleted");
  }
}

const currentSlideImage = ref();

function openDialog(slide) {
  currentSlideImage.value = slide.image;
  const dialog = document.getElementById("dialog");
  dialog.showModal();
}

function closeDialog() {
  currentSlideImage.value = undefined;
  const dialog = document.getElementById("dialog");
  dialog.close();
}
</script>

<template>
  <div>
    <div class="overflow-x-auto whitespace-nowrap drop-shadow-items">
      <table class="w-full table-auto">
        <thead class="border-2 border-tertiary-dark bg-primary">
          <tr>
            <th class="px-5 text-start">TEXTO PRIMARIO</th>
            <th class="px-5 text-start">TEXTO SECUNDARIO</th>
            <th class="px-5 text-start">ACCIONES</th>
          </tr>
        </thead>
        <tbody class="border-2 border-tertiary-dark">
          <tr v-for="(slide, i) in props.slides" :key="slide.id" :class="[i % 2 === 0 ? 'bg-secondary-light' : 'bg-secondary']">
            <td class="px-5 text-start font-medium">
              {{ slide.primary_text }}
            </td>
            <td class="px-5 text-start font-medium">
              {{ slide.secondary_text }}
            </td>
            <td class="flex justify-start gap-3 px-5 py-2">
              <button
                class="material-icons-outlined border-2 border-tertiary-dark bg-primary-light p-1 drop-shadow-navlink"
                @click="deleteSlideImage(slide)"
              >
                delete
              </button>
              <button
                class="material-icons-outlined border-2 border-tertiary-dark bg-primary-light p-1 drop-shadow-navlink"
                @click="openDialog(slide)"
              >
                visibility
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <dialog id="dialog" class="border-2 border-tertiary-dark">
      <div class="flex flex-col gap-3">
        <button class="material-icons-outlined ml-auto" @click="closeDialog()">close</button>
        <img :src="currentSlideImage" alt="slide image" class="w-96 border-2 border-tertiary-dark" />
      </div>
    </dialog>
  </div>
</template>
