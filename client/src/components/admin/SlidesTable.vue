<script setup>
import { ref } from "vue";
import { deleteSlide } from "@/supabase/helpers.js";
import { useToast } from "vue-toast-notification";

const props = defineProps({
  slides: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["deleted"]);

const $toast = useToast();

async function deleteSlideImage(slide) {
  if (confirm("¿Esta seguro que desea eliminar esta diapositiva?"))
    try {
      const error = await deleteSlide(slide.id, slide.updated_at);
      if (error) throw error;
      else {
        $toast.open({
          position: "top-right",
          message: "Se eliminó correctamente la diapositiva",
          type: "success",
          duration: 5000,
          dismissible: true,
        });
        emit("deleted");
      }
    } catch (error) {
      $toast.open({
        position: "top-right",
        message: "Error al borrar la diapositiva",
        type: "error",
        duration: 5000,
        dismissible: true,
      });
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
    <div class="mt-5 overflow-x-auto whitespace-nowrap drop-shadow-items">
      <table class="w-full table-auto">
        <thead class="border-2 bg-primary border-tertiary-dark">
          <tr>
            <th class="px-5 text-start">TEXTO PRIMARIO</th>
            <th class="px-5 text-start">TEXTO SECUNDARIO</th>
            <th class="px-5 text-start">ACCIONES</th>
          </tr>
        </thead>
        <tbody class="border-2 border-tertiary-dark">
          <tr
            v-for="(slide, i) in props.slides"
            :key="slide.id"
            :class="[i % 2 === 0 ? 'bg-secondary-light' : 'bg-secondary']"
          >
            <td class="px-5 font-medium text-start">
              {{ slide.primary_text }}
            </td>
            <td class="px-5 font-medium text-start">
              {{ slide.secondary_text }}
            </td>
            <td class="flex justify-start gap-3 px-5 py-2">
              <button
                class="p-1 border-2 material-icons-outlined bg-primary-light border-tertiary-dark drop-shadow-navlink"
                @click="deleteSlideImage(slide)"
              >
                delete
              </button>
              <button
                class="p-1 border-2 material-icons-outlined bg-primary-light border-tertiary-dark drop-shadow-navlink"
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
        <button class="ml-auto material-icons-outlined" @click="closeDialog()">
          close
        </button>
        <img
          :src="currentSlideImage"
          alt="slide image"
          class="border-2 w-96 border-tertiary-dark"
        />
      </div>
    </dialog>
  </div>
</template>
