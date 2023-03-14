<script setup>
const props = defineProps({
  primary: {
    type: Boolean,
  },
  secondary: {
    type: Boolean,
  },
  facebook: {
    type: Boolean,
  },
  google: {
    type: Boolean,
  },
  disabled: {
    type: Boolean,
  },
});
</script>

<template>
  <button
    v-if="facebook || google"
    :disabled="props.disabled"
    :class="[
      'p-3',
      'border-2',
      { 'bg-[#1877F2]': props.facebook },
      { 'bg-background': props.google },
      'border-tertiary-dark',
      'drop-shadow-items',
      'flex',
      'items-center',
      'gap-4',
      'w-full',
      'justify-center',
    ]"
  >
    <slot></slot>
  </button>
  <button
    v-else
    :disabled="props.disabled"
    :class="[
      'p-3',
      'text-sm',
      'font-bold',
      'border-2',
      { 'bg-primary-light': props.primary },
      { 'bg-secondary-light': props.secondary },
      'border-tertiary-dark',
      'drop-shadow-items',
    ]"
  >
    <slot></slot>
  </button>
</template>
