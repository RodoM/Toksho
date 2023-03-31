<script setup>
const props = defineProps({
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
});

const pages = () => {
  if ((props.count / props.productsPerPage) % 1 == 0) {
    return Math.ceil(props.count / props.productsPerPage) + 1;
  }
  return Math.ceil(props.count / props.productsPerPage);
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
      <button @click="$emit('prevPage')">navigate_before</button>
    </li>
    <li v-for="i in pages()" :key="i">
      <button
        class="px-2.5 font-bold py-1 border-2 border-tertiary-dark drop-shadow-navlink"
        :class="[
          props.offset / props.productsPerPage + 1 === i
            ? 'bg-secondary-light'
            : 'bg-primary-light',
        ]"
        @click="$emit('goToPage', i)"
      >
        {{ i }}
      </button>
    </li>
    <li
      v-if="props.limit < props.count"
      class="p-1 border-2 material-icons-outlined border-tertiary-dark bg-primary-light drop-shadow-navlink"
    >
      <button @click="$emit('nextPage')">navigate_next</button>
    </li>
  </ul>
</template>
