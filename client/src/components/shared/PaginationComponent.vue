<script setup>
const props = defineProps({
  count: {
    type: Number,
    required: true,
  },
  paginationData: {
    type: Object,
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

const pages = () => {
  if (props.paginationData.limitPages >= 5) return 5;
  else return props.paginationData.limitPages;
};
</script>

<template>
  <ul v-if="!(props.count < props.paginationData.productsPerPage + 1)" class="flex justify-center gap-3">
    <li
      v-if="props.paginationData.offset > 0"
      class="material-icons-outlined border-2 border-tertiary-dark bg-primary-light p-1 drop-shadow-navlink"
    >
      <button @click="prevPage">navigate_before</button>
    </li>
    <li v-for="i in pages()" :key="i">
      <button
        class="border-2 border-tertiary-dark px-2.5 py-1 font-bold drop-shadow-navlink"
        :class="[props.paginationData.currentPage === i + props.paginationData.offsetPages ? 'bg-secondary-light' : 'bg-primary-light']"
        @click="$emit('goToPage', i + props.paginationData.offsetPages)"
      >
        {{ i + props.paginationData.offsetPages }}
      </button>
    </li>
    <li
      v-if="props.paginationData.limit < props.count"
      class="material-icons-outlined border-2 border-tertiary-dark bg-primary-light p-1 drop-shadow-navlink"
    >
      <button @click="nextPage">navigate_next</button>
    </li>
  </ul>
</template>
