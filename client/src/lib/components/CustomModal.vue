<script setup>
const props = defineProps({
  show: Boolean,
});
</script>

<template>
  <div
    v-if="props.show"
    tabindex="-1"
    class="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto h-[calc(100%-1rem)] md:h-full"
  >
    <div
      class="fixed w-full max-w-md transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
    >
      <slot></slot>
    </div>
  </div>
</template>
