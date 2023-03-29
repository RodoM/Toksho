import { ref } from "vue";
import { defineStore } from "pinia";

export const itemsStore = defineStore(
  "items",
  () => {
    const items = ref([]);

    const addItem = (id, amount) => {
      items.value.push({ id, amount });
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
