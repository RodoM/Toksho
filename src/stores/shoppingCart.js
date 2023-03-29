import { ref } from "vue";
import { defineStore } from "pinia";

export const itemsStore = defineStore(
  "items",
  () => {
    const items = ref([]);

    const addItem = (item) => {
      items.value.push(item);
    };

    const deleteItem = (item) => {
      items.value.splice(items.value.indexOf(item), 1);
    };

    return {
      items,
      addItem,
      deleteItem,
    };
  },
  { persist: true }
);
