<script setup>
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  productsPerPage: {
    type: Number,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  offset: {
    type: Number,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
  pages: {
    type: Number,
    required: true,
  },
  pageOffset: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["prevPage", "nextPage", "goToPage"]);

const prevPage = () => {
  emit("prevPage");
};

const nextPage = () => {
  emit("nextPage");
};

// Paginación como google
// Mostrar, si las hay, 5 paginas (1,2,3,4,5), cuando se llegue a la 5ta ponerla en medio y mostrar
// las 2 siguientes (3,4,5,6,7) y a partir de ahi la siguiente pagina colocarla en medio, es decir,
// (3,4,5,6,7) -> (4,5,6,7,8) -> (5,6,7,8,9) -> (6,7,8,9,10). Desplazar los valores con funciones de
// prev y next, tambien meter los emits ahi dentro

const pages = () => {
  if (props.pages >= 5) return 5;
  else return props.pages;
};
</script>

<template>
  <ul
    v-if="!(props.count < props.productsPerPage + 1)"
    class="flex justify-center gap-3"
  >
    <li
      v-if="props.offset > 0"
      class="p-1 border-2 material-icons-outlined border-tertiary-dark bg-primary-light drop-shadow-navlink"
    >
      <button @click="prevPage">navigate_before</button>
    </li>
    <li v-for="i in pages()" :key="i">
      <button
        class="px-2.5 font-bold py-1 border-2 border-tertiary-dark drop-shadow-navlink"
        :class="[
          props.currentPage === i + pageOffset
            ? 'bg-secondary-light'
            : 'bg-primary-light',
        ]"
        @click="$emit('goToPage', i + pageOffset)"
      >
        {{ i + pageOffset }}
      </button>
    </li>
    <li
      v-if="props.limit < props.count"
      class="p-1 border-2 material-icons-outlined border-tertiary-dark bg-primary-light drop-shadow-navlink"
    >
      <button @click="nextPage">navigate_next</button>
    </li>
  </ul>
</template>
